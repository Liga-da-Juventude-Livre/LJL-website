"use server";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import type { FormState } from "@/lib/form-state";
import { redirectWithNotice } from "@/lib/flash";
import { formToObject, invalid } from "@/lib/forms";
import { slugify } from "@/lib/slug";
import { recordActivity } from "@/modules/activity/record";
import { requireRole } from "@/modules/auth/dal";
import { requestStatus } from "./labels";
import { requestUpdateSchema } from "./schemas";

const roles = ["ADMIN", "EDITOR"] as const;

// Activity lines name the university, never the person: requests are personal data and must stay erasable.
export async function updateChapterRequest(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireRole(...roles);
  const raw = formToObject(formData);
  const parsed = requestUpdateSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const { status, university, notes } = parsed.data;

  const existing = await db.chapterRequest.findUnique({ where: { id }, select: { id: true } });
  if (!existing) notFound();
  await db.chapterRequest.update({
    where: { id },
    data: { status, university, universityKey: slugify(university), notes: notes ?? null, handledById: user.id },
  });
  await recordActivity({
    userId: user.id,
    action: "chapter-request.update",
    entity: "ChapterRequest",
    entityId: id,
    summary: `Atualizou um pedido de diretório (${university}): ${requestStatus(status).label}`,
  });
  return { ok: "Salvo." };
}

export async function deleteChapterRequest(id: string): Promise<void> {
  const user = await requireRole(...roles);
  const request = await db.chapterRequest.findUnique({ where: { id }, select: { university: true } });
  if (!request) notFound();
  await db.chapterRequest.delete({ where: { id } });
  await recordActivity({
    userId: user.id,
    action: "chapter-request.delete",
    entity: "ChapterRequest",
    summary: `Excluiu um pedido de diretório (${request.university})`,
  });
  redirectWithNotice("/dashboard/chapter-requests", "Pedido excluído.");
}
