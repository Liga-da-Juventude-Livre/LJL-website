"use server";

import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { FormState } from "@/lib/form-state";
import { formToObject, invalid } from "@/lib/forms";
import { recordActivity } from "@/modules/activity/record";
import { requireRole } from "@/modules/auth/dal";
import { applicationScope } from "@/modules/auth/permissions";
import { applicationStatus } from "./labels";
import { RETENTION_MONTHS } from "./retention";
import { staleWhere } from "./queries";
import { applicationUpdateSchema } from "./schemas";

const roles = ["ADMIN", "EDITOR", "COORDINATOR"] as const;

// Activity lines name the diretório, never the person: applications are personal data and must stay erasable.
async function visible(user: Awaited<ReturnType<typeof requireRole>>, id: string) {
  const application = await db.application.findFirst({ where: { id, ...applicationScope(user) }, select: { id: true, chapter: { select: { name: true } } } });
  if (!application) notFound();
  return application;
}

export async function updateApplication(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireRole(...roles);
  const raw = formToObject(formData);
  const parsed = applicationUpdateSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const { status, notes } = parsed.data;

  const application = await visible(user, id);
  await db.application.update({ where: { id }, data: { status, notes: notes ?? null, handledById: user.id } });
  await recordActivity({
    userId: user.id,
    action: "application.update",
    entity: "Application",
    entityId: id,
    summary: `Atualizou uma candidatura (${application.chapter?.name ?? "sem diretório"}): ${applicationStatus(status).label}`,
  });
  return { ok: "Salvo." };
}

export async function deleteApplication(id: string): Promise<void> {
  const user = await requireRole(...roles);
  const application = await visible(user, id);
  await db.application.delete({ where: { id } });
  await recordActivity({
    userId: user.id,
    action: "application.delete",
    entity: "Application",
    summary: `Excluiu uma candidatura (${application.chapter?.name ?? "sem diretório"})`,
  });
  redirect("/dashboard/applications");
}

/** Retention policy (see /privacy): deletes applications untouched for a year. Administrators only. */
export async function purgeStaleApplications(): Promise<void> {
  const user = await requireRole("ADMIN");
  const { count } = await db.application.deleteMany({ where: staleWhere() });
  await recordActivity({
    userId: user.id,
    action: "application.purge",
    entity: "Application",
    summary: `Apagou ${count} candidaturas sem atividade há mais de ${RETENTION_MONTHS} meses`,
  });
  redirect("/dashboard/applications");
}
