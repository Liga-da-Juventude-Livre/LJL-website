"use server";

import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isUniqueViolation } from "@/lib/db-errors";
import type { FormState } from "@/lib/form-state";
import { failure, formToObject, invalid } from "@/lib/forms";
import { freeSlug } from "@/lib/slug";
import { recordActivity } from "@/modules/activity/record";
import { requireRole } from "@/modules/auth/dal";
import { chapterSchema } from "./schemas";

const roles = ["ADMIN", "EDITOR"] as const;

export async function saveChapter(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireRole(...roles);
  const raw = formToObject(formData);
  const parsed = chapterSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const { id, slug, ...data } = parsed.data;

  try {
    if (id) {
      const current = await db.chapter.findUnique({ where: { id }, select: { slug: true } });
      if (!current) notFound();
      await db.chapter.update({ where: { id }, data: { ...data, slug: slug || current.slug } });
      await recordActivity({ userId: user.id, action: "chapter.update", entity: "Chapter", entityId: id, summary: `Editou o diretório ${data.name}` });
    } else {
      const finalSlug = slug || (await freeSlug(data.name, async (s) => !!(await db.chapter.findUnique({ where: { slug: s }, select: { id: true } }))));
      const created = await db.chapter.create({ data: { ...data, slug: finalSlug } });
      await recordActivity({ userId: user.id, action: "chapter.create", entity: "Chapter", entityId: created.id, summary: `Criou o diretório ${data.name}` });
    }
  } catch (error) {
    if (isUniqueViolation(error)) return failure(raw, "Corrija os campos destacados.", { slug: ["Já existe um diretório com esse endereço."] });
    throw error;
  }
  redirect("/dashboard/chapters");
}

export async function deleteChapter(id: string): Promise<void> {
  const user = await requireRole(...roles);
  const chapter = await db.chapter.findUnique({ where: { id }, select: { name: true } });
  if (!chapter) notFound();
  // Posts, events and people keep existing; they just lose the link to this diretório.
  await db.chapter.delete({ where: { id } });
  await recordActivity({ userId: user.id, action: "chapter.delete", entity: "Chapter", entityId: id, summary: `Excluiu o diretório ${chapter.name}` });
  redirect("/dashboard/chapters");
}
