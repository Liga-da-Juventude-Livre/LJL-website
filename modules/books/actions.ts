"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isUniqueViolation } from "@/lib/db-errors";
import type { FormState } from "@/lib/form-state";
import { failure, formToObject, invalid } from "@/lib/forms";
import { freeSlug } from "@/lib/slug";
import { deleteUploaded } from "@/lib/storage";
import { recordActivity } from "@/modules/activity/record";
import { requireRole } from "@/modules/auth/dal";
import { bookSchema, downloadSchema } from "./schemas";

const roles = ["ADMIN", "EDITOR"] as const;

export async function saveBook(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireRole(...roles);
  const raw = formToObject(formData);
  const parsed = bookSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const { id, slug, ...data } = parsed.data;

  const front = await db.front.findUnique({ where: { id: data.frontId }, select: { id: true } });
  if (!front) return failure(raw, "Corrija os campos destacados.", { frontId: ["Escolha uma frente."] });

  const taken = async (s: string) => !!(await db.book.findFirst({ where: { slug: s, ...(id ? { NOT: { id } } : {}) }, select: { id: true } }));
  const existing = id ? await db.book.findUnique({ where: { id }, select: { slug: true, coverUrl: true } }) : null;
  if (id && !existing) notFound();
  const finalSlug = slug || existing?.slug || (await freeSlug(data.title, taken));
  if (slug && (await taken(slug))) return failure(raw, "Corrija os campos destacados.", { slug: ["Já existe um livro com esse endereço."] });

  let savedId = id;
  try {
    if (id) {
      await db.book.update({ where: { id }, data: { ...data, slug: finalSlug } });
    } else {
      savedId = (await db.book.create({ data: { ...data, slug: finalSlug, createdById: user.id } })).id;
    }
  } catch (error) {
    if (isUniqueViolation(error)) return failure(raw, "Corrija os campos destacados.", { slug: ["Já existe um livro com esse endereço."] });
    throw error;
  }
  if (existing?.coverUrl && data.coverUrl !== undefined && data.coverUrl !== existing.coverUrl) await deleteUploaded(existing.coverUrl);
  await recordActivity({ userId: user.id, action: id ? "book.update" : "book.create", entity: "Book", entityId: savedId, summary: `${id ? "Editou" : "Cadastrou"} o livro ${data.title}` });
  // After creating, go straight to the edit page: that is where free editions are added.
  redirect(id ? "/dashboard/books" : `/dashboard/books/${savedId}`);
}

export async function deleteBook(id: string): Promise<void> {
  const user = await requireRole(...roles);
  const book = await db.book.findUnique({ where: { id }, select: { title: true, coverUrl: true } });
  if (!book) notFound();
  await db.book.delete({ where: { id } }); // downloads go with it (cascade)
  await deleteUploaded(book.coverUrl);
  await recordActivity({ userId: user.id, action: "book.delete", entity: "Book", entityId: id, summary: `Excluiu o livro ${book.title}` });
  redirect("/dashboard/books");
}

export async function addDownload(bookId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireRole(...roles);
  const raw = formToObject(formData);
  const parsed = downloadSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const book = await db.book.findUnique({ where: { id: bookId }, select: { title: true } });
  if (!book) notFound();
  const { verified, ...data } = parsed.data;
  await db.bookDownload.create({ data: { ...data, bookId, verifiedAt: verified ? new Date() : null } });
  await recordActivity({ userId: user.id, action: "book.download.add", entity: "Book", entityId: bookId, summary: `Adicionou edição gratuita de ${book.title}` });
  revalidatePath(`/dashboard/books/${bookId}`);
  return { ok: "Edição adicionada." };
}

export async function verifyDownload(id: string): Promise<void> {
  const user = await requireRole(...roles);
  const dl = await db.bookDownload.update({ where: { id }, data: { verifiedAt: new Date() }, include: { book: { select: { id: true, title: true } } } });
  await recordActivity({ userId: user.id, action: "book.download.verify", entity: "Book", entityId: dl.book.id, summary: `Conferiu o link de ${dl.book.title}` });
  revalidatePath(`/dashboard/books/${dl.book.id}`);
}

export async function removeDownload(id: string): Promise<void> {
  const user = await requireRole(...roles);
  const dl = await db.bookDownload.delete({ where: { id }, include: { book: { select: { id: true, title: true } } } });
  await recordActivity({ userId: user.id, action: "book.download.remove", entity: "Book", entityId: dl.book.id, summary: `Removeu uma edição gratuita de ${dl.book.title}` });
  revalidatePath(`/dashboard/books/${dl.book.id}`);
}
