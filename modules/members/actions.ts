"use server";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import type { FormState } from "@/lib/form-state";
import { redirectWithNotice } from "@/lib/flash";
import { failure, formToObject, invalid } from "@/lib/forms";
import { memberTitleLabel } from "@/content/talent";
import { recordActivity } from "@/modules/activity/record";
import { requireRole } from "@/modules/auth/dal";
import { chapterScope } from "@/modules/auth/permissions";
import { memberSchema } from "./schemas";

const roles = ["ADMIN", "EDITOR", "COORDINATOR"] as const;
type Actor = Awaited<ReturnType<typeof requireRole>>;

// Activity lines name the diretório and the role, never the person: memberships are personal data and must stay erasable.
const todayBR = () => new Date(`${new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(new Date())}T00:00:00Z`);

async function visible(user: Actor, id: string) {
  const m = await db.membership.findFirst({
    where: { id, ...chapterScope(user) },
    select: { id: true, title: true, userId: true, chapter: { select: { name: true } } },
  });
  if (!m) notFound();
  return m;
}

export async function saveMember(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireRole(...roles);
  const raw = formToObject(formData);
  const parsed = memberSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const { id, chapterId: askedChapter, applicationId, userId, endsOn, ...data } = parsed.data;
  const pinned = (field: string, message: string) => failure(raw, "Corrija os campos destacados.", { [field]: [message] });

  if (endsOn && endsOn < data.startedOn) return pinned("endsOn", "O fim do mandato não pode ser antes do início.");

  // A coordinator can only act inside their own diretório; central staff pick one.
  const chapterId = user.role === "COORDINATOR" ? user.chapterId : askedChapter;
  if (!chapterId) return pinned("chapterId", "Escolha o diretório.");
  const chapter = await db.chapter.findUnique({ where: { id: chapterId }, select: { id: true, name: true } });
  if (!chapter) return pinned("chapterId", "Diretório não encontrado.");

  // Linking a login is for administrators only, and only to an account of the same diretório.
  let linkUser: string | null | undefined = undefined;
  if (user.role === "ADMIN") {
    linkUser = userId ?? null;
    if (linkUser && !(await db.user.findFirst({ where: { id: linkUser, chapterId }, select: { id: true } }))) {
      return pinned("userId", "Escolha uma conta deste diretório.");
    }
  }

  let skills: string[] = [];
  if (applicationId) {
    const app = await db.application.findFirst({
      where: { id: applicationId, ...chapterScope(user) },
      select: { id: true, skills: true, chapterId: true, membership: { select: { id: true } } },
    });
    if (!app || (app.chapterId && app.chapterId !== chapterId)) return failure(raw, "Candidatura não encontrada neste diretório.");
    if (app.membership && app.membership.id !== id) return failure(raw, "Esta candidatura já virou membro.");
    skills = app.skills;
  }

  if (id) {
    const current = await visible(user, id);
    if (user.role === "COORDINATOR" && chapterId !== user.chapterId) notFound();
    await db.membership.update({
      where: { id },
      data: { ...data, endsOn: endsOn ?? null, notes: data.notes ?? null, chapterId, ...(linkUser !== undefined ? { userId: linkUser } : {}) },
    });
    await recordActivity({
      userId: user.id,
      action: "member.update",
      entity: "Membership",
      entityId: id,
      summary: `Editou um membro (${current.chapter.name}): ${memberTitleLabel(data.title)}`,
    });
    redirectWithNotice(`/dashboard/members/${id}`, "Dados do membro salvos.");
  }

  const created = await db.membership.create({
    data: {
      ...data,
      endsOn: endsOn ?? null,
      notes: data.notes ?? null,
      chapterId,
      skills,
      applicationId: applicationId ?? null,
      userId: linkUser ?? null,
      createdById: user.id,
    },
  });
  if (applicationId) await db.application.update({ where: { id: applicationId }, data: { status: "MEMBER", handledById: user.id } });
  await recordActivity({
    userId: user.id,
    action: "member.create",
    entity: "Membership",
    entityId: created.id,
    summary: `Adicionou um membro (${chapter.name}): ${memberTitleLabel(data.title)}`,
  });
  redirectWithNotice(`/dashboard/members/${created.id}`, "Membro adicionado.");
}

/** Ends the mandate: the person becomes an alumnus. An administrator also switches off the linked login. */
export async function endMembership(id: string): Promise<void> {
  const user = await requireRole(...roles);
  const m = await visible(user, id);
  await db.membership.update({ where: { id }, data: { endedOn: todayBR() } });
  if (user.role === "ADMIN" && m.userId) {
    const account = await db.user.findUnique({ where: { id: m.userId }, select: { role: true } });
    if (account && account.role !== "ADMIN") {
      await db.user.update({ where: { id: m.userId }, data: { active: false } });
      await db.session.deleteMany({ where: { userId: m.userId } });
    }
  }
  await recordActivity({
    userId: user.id,
    action: "member.end",
    entity: "Membership",
    entityId: id,
    summary: `Encerrou um mandato (${m.chapter.name}): ${memberTitleLabel(m.title)}`,
  });
  redirectWithNotice(`/dashboard/members/${id}`, "Mandato encerrado. A pessoa agora é alumni.");
}

export async function reactivateMembership(id: string): Promise<void> {
  const user = await requireRole(...roles);
  const m = await visible(user, id);
  await db.membership.update({ where: { id }, data: { endedOn: null } });
  await recordActivity({
    userId: user.id,
    action: "member.reactivate",
    entity: "Membership",
    entityId: id,
    summary: `Reativou um membro (${m.chapter.name}): ${memberTitleLabel(m.title)}`,
  });
  redirectWithNotice(`/dashboard/members/${id}`, "Membro reativado.");
}

export async function deleteMembership(id: string): Promise<void> {
  const user = await requireRole(...roles);
  const m = await visible(user, id);
  await db.membership.delete({ where: { id } });
  await recordActivity({
    userId: user.id,
    action: "member.delete",
    entity: "Membership",
    summary: `Excluiu um membro (${m.chapter.name}): ${memberTitleLabel(m.title)}`,
  });
  redirectWithNotice("/dashboard/members", "Registro excluído.");
}
