"use server";

import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isUniqueViolation } from "@/lib/db-errors";
import type { FormState } from "@/lib/form-state";
import { failure, formToObject, invalid } from "@/lib/forms";
import { freeSlug } from "@/lib/slug";
import { recordActivity } from "@/modules/activity/record";
import { requireRole } from "@/modules/auth/dal";
import { eventSchema } from "./schemas";

const roles = ["ADMIN", "EDITOR"] as const;

export async function saveEvent(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireRole(...roles);
  const raw = formToObject(formData);
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const { id, slug, ...data } = parsed.data;

  const taken = async (s: string) => !!(await db.event.findFirst({ where: { slug: s, ...(id ? { NOT: { id } } : {}) }, select: { id: true } }));
  const existing = id ? await db.event.findUnique({ where: { id }, select: { slug: true } }) : null;
  if (id && !existing) notFound();
  const finalSlug = slug || existing?.slug || (await freeSlug(data.title, taken));
  if (slug && (await taken(slug))) return failure(raw, "Corrija os campos destacados.", { slug: ["Já existe um evento com esse endereço."] });

  const fields = {
    ...data,
    slug: finalSlug,
    endsAt: data.endsAt ?? null,
    location: data.location ?? null,
    onlineUrl: data.onlineUrl ?? null,
    registrationUrl: data.registrationUrl ?? null,
    chapterId: data.chapterId ?? null,
  };
  let savedId = id;
  try {
    if (id) await db.event.update({ where: { id }, data: fields });
    else savedId = (await db.event.create({ data: { ...fields, createdById: user.id } })).id;
  } catch (error) {
    if (isUniqueViolation(error)) return failure(raw, "Corrija os campos destacados.", { slug: ["Já existe um evento com esse endereço."] });
    throw error;
  }
  await recordActivity({ userId: user.id, action: id ? "event.update" : "event.create", entity: "Event", entityId: savedId, summary: `${id ? "Editou" : "Criou"} o evento ${data.title}` });
  redirect("/dashboard/events");
}

export async function deleteEvent(id: string): Promise<void> {
  const user = await requireRole(...roles);
  const event = await db.event.findUnique({ where: { id }, select: { title: true } });
  if (!event) notFound();
  await db.event.delete({ where: { id } });
  await recordActivity({ userId: user.id, action: "event.delete", entity: "Event", entityId: id, summary: `Excluiu o evento ${event.title}` });
  redirect("/dashboard/events");
}
