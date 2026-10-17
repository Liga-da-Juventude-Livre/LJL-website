"use server";

import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isUniqueViolation } from "@/lib/db-errors";
import type { FormState } from "@/lib/form-state";
import { failure, formToObject, invalid } from "@/lib/forms";
import { freeSlug } from "@/lib/slug";
import { deleteUploaded } from "@/lib/storage";
import type { PublishStatus } from "@/generated/prisma/client";
import { recordActivity } from "@/modules/activity/record";
import { requireUser } from "@/modules/auth/dal";
import { allowedStatuses, canDeletePost, canEditPost } from "@/modules/auth/permissions";
import { POST_KINDS } from "./config";
import { postSchema } from "./schemas";

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const raw = formToObject(formData);
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const { id, slug, ...data } = parsed.data;

  if (!allowedStatuses(user).includes(data.status)) {
    return failure(raw, "Seu perfil só pode salvar rascunhos e enviar para revisão.");
  }

  const existing = id ? await db.post.findUnique({ where: { id } }) : null;
  if (id && !existing) notFound();
  if (existing && !canEditPost(user, existing)) return failure(raw, "Você não pode editar este texto.");

  // The type is fixed when the post is created; an edit cannot turn an article into news.
  const type = existing?.type ?? data.type;
  const taken = async (s: string) => !!(await db.post.findFirst({ where: { type, slug: s, ...(id ? { NOT: { id } } : {}) }, select: { id: true } }));
  const finalSlug = slug || existing?.slug || (await freeSlug(data.title, taken));
  if (slug && (await taken(slug))) return failure(raw, "Corrija os campos destacados.", { slug: ["Já existe um texto com esse endereço."] });

  const becamePublished = data.status === "PUBLISHED" && existing?.status !== "PUBLISHED";
  const fields = {
    ...data,
    type,
    slug: finalSlug,
    frontId: data.frontId ?? null,
    chapterId: data.chapterId ?? null,
    publishedAt: data.status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : (existing?.publishedAt ?? null),
  };

  let savedId: string;
  try {
    if (existing) {
      await db.post.update({ where: { id: existing.id }, data: fields });
      savedId = existing.id;
    } else {
      savedId = (await db.post.create({ data: { ...fields, createdById: user.id } })).id;
    }
  } catch (error) {
    if (isUniqueViolation(error)) return failure(raw, "Corrija os campos destacados.", { slug: ["Já existe um texto com esse endereço."] });
    throw error;
  }

  if (existing?.coverUrl && data.coverUrl !== undefined && data.coverUrl !== existing.coverUrl) await deleteUploaded(existing.coverUrl);

  const kind = POST_KINDS[type];
  await recordActivity({
    userId: user.id,
    action: becamePublished ? "post.publish" : existing ? "post.update" : "post.create",
    entity: "Post",
    entityId: savedId,
    summary: `${becamePublished ? "Publicou" : existing ? "Editou" : "Criou"} ${kind.singular}: ${data.title}`,
  });
  redirect(kind.path);
}

export async function setPostStatus(id: string, status: PublishStatus): Promise<void> {
  const user = await requireUser();
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();
  if (!canEditPost(user, post) || !allowedStatuses(user).includes(status)) redirect(POST_KINDS[post.type].path);
  await db.post.update({
    where: { id },
    data: { status, publishedAt: status === "PUBLISHED" ? (post.publishedAt ?? new Date()) : post.publishedAt },
  });
  await recordActivity({
    userId: user.id,
    action: status === "PUBLISHED" ? "post.publish" : "post.status",
    entity: "Post",
    entityId: id,
    summary: `${status === "PUBLISHED" ? "Publicou" : status === "ARCHIVED" ? "Arquivou" : "Mudou a situação de"} ${POST_KINDS[post.type].singular}: ${post.title}`,
  });
  redirect(POST_KINDS[post.type].path);
}

export async function deletePost(id: string): Promise<void> {
  const user = await requireUser();
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();
  if (!canDeletePost(user, post)) redirect(POST_KINDS[post.type].path);
  await db.post.delete({ where: { id } });
  await deleteUploaded(post.coverUrl);
  await recordActivity({ userId: user.id, action: "post.delete", entity: "Post", entityId: id, summary: `Excluiu ${POST_KINDS[post.type].singular}: ${post.title}` });
  redirect(POST_KINDS[post.type].path);
}
