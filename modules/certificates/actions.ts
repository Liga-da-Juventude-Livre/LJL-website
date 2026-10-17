"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isUniqueViolation } from "@/lib/db-errors";
import type { FormState } from "@/lib/form-state";
import { failure, formToObject, invalid } from "@/lib/forms";
import { recordActivity } from "@/modules/activity/record";
import { requireRole } from "@/modules/auth/dal";
import { generateCode } from "./codes";
import { editSchema, issueSchema, parsePeople, revokeSchema } from "./schemas";

const roles = ["ADMIN", "EDITOR"] as const;
const detail = (id: string) => `/dashboard/certificates/${id}`;

// Activity lines name the activity, never the person: certificates hold personal data and must stay erasable.
export async function issueCertificates(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireRole(...roles);
  const raw = formToObject(formData);
  const parsed = issueSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const { people: source, courseId, eventId, ...data } = parsed.data;

  const { people, problems } = parsePeople(source);
  if (problems.length > 0) return failure(raw, "Corrija os campos destacados.", { people: problems.slice(0, 6) });
  if (people.length === 0) return failure(raw, "Corrija os campos destacados.", { people: ["Informe pelo menos uma pessoa."] });
  if (courseId && !(await db.course.findUnique({ where: { id: courseId }, select: { id: true } }))) return failure(raw, "Corrija os campos destacados.", { courseId: ["Curso não encontrado."] });
  if (eventId && !(await db.event.findUnique({ where: { id: eventId }, select: { id: true } }))) return failure(raw, "Corrija os campos destacados.", { eventId: ["Evento não encontrado."] });

  // A code collision is astronomically unlikely, but handle it anyway: retry the whole batch with fresh codes.
  for (let attempt = 0; ; attempt++) {
    try {
      await db.$transaction(
        people.map((p) =>
          db.certificate.create({
            data: { ...data, recipientName: p.name, recipientEmail: p.email ?? null, courseId: courseId ?? null, eventId: eventId ?? null, issuedById: user.id, code: generateCode() },
          }),
        ),
      );
      break;
    } catch (error) {
      if (!isUniqueViolation(error) || attempt >= 3) throw error;
    }
  }
  await recordActivity({
    userId: user.id,
    action: "certificate.issue",
    entity: "Certificate",
    summary: `Emitiu ${people.length} ${people.length === 1 ? "certificado" : "certificados"}: ${data.title}`,
  });
  redirect(`/dashboard/certificates?issued=${people.length}`);
}

export async function updateCertificate(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireRole(...roles);
  const raw = formToObject(formData);
  const parsed = editSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const existing = await db.certificate.findUnique({ where: { id }, select: { title: true } });
  if (!existing) notFound();
  const { recipientEmail, ...rest } = parsed.data;
  await db.certificate.update({ where: { id }, data: { ...rest, recipientEmail: recipientEmail ?? null } });
  await recordActivity({ userId: user.id, action: "certificate.update", entity: "Certificate", entityId: id, summary: `Corrigiu um certificado: ${rest.title}` });
  revalidatePath(detail(id));
  return { ok: "Salvo." };
}

export async function revokeCertificate(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireRole(...roles);
  const raw = formToObject(formData);
  const parsed = revokeSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const existing = await db.certificate.findUnique({ where: { id }, select: { title: true } });
  if (!existing) notFound();
  await db.certificate.update({ where: { id }, data: { revokedAt: new Date(), revokedReason: parsed.data.reason ?? null } });
  await recordActivity({ userId: user.id, action: "certificate.revoke", entity: "Certificate", entityId: id, summary: `Revogou um certificado: ${existing.title}` });
  revalidatePath(detail(id));
  return { ok: "Certificado revogado. A página pública agora mostra que ele foi revogado." };
}

export async function restoreCertificate(id: string): Promise<void> {
  const user = await requireRole(...roles);
  const existing = await db.certificate.findUnique({ where: { id }, select: { title: true } });
  if (!existing) notFound();
  await db.certificate.update({ where: { id }, data: { revokedAt: null, revokedReason: null } });
  await recordActivity({ userId: user.id, action: "certificate.restore", entity: "Certificate", entityId: id, summary: `Reativou um certificado: ${existing.title}` });
  revalidatePath(detail(id));
}

/** Erases the record (and so the person's data). To keep the record and only invalidate it, revoke instead. */
export async function deleteCertificate(id: string): Promise<void> {
  const user = await requireRole(...roles);
  const existing = await db.certificate.findUnique({ where: { id }, select: { title: true } });
  if (!existing) notFound();
  await db.certificate.delete({ where: { id } });
  await recordActivity({ userId: user.id, action: "certificate.delete", entity: "Certificate", summary: `Excluiu um certificado: ${existing.title}` });
  redirect("/dashboard/certificates");
}
