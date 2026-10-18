import "server-only";
import { db } from "@/lib/db";
import type { ApplicationStatus, Prisma } from "@/generated/prisma/client";
import { applicationScope, type Actor } from "@/modules/auth/permissions";
import { RETENTION_MONTHS } from "./retention";

// Every query takes the viewer and adds their scope, so a coordinator can never read another diretório's people.

export const listApplications = (user: Actor, filter: { status?: ApplicationStatus; skill?: string; q?: string } = {}) => {
  const where: Prisma.ApplicationWhereInput = {
    ...applicationScope(user),
    ...(filter.status ? { status: filter.status } : {}),
    ...(filter.skill ? { skills: { has: filter.skill } } : {}),
    ...(filter.q ? { OR: [{ name: { contains: filter.q, mode: "insensitive" as const } }, { email: { contains: filter.q, mode: "insensitive" as const } }, { course: { contains: filter.q, mode: "insensitive" as const } }] } : {}),
  };
  return db.application.findMany({ where, orderBy: { createdAt: "desc" }, include: { chapter: { select: { name: true } } } });
};

export const countApplicationsByStatus = async (user: Actor) => {
  const rows = await db.application.groupBy({ by: ["status"], where: applicationScope(user), _count: { _all: true } });
  return Object.fromEntries(rows.map((r) => [r.status, r._count._all])) as Partial<Record<ApplicationStatus, number>>;
};

export const getApplication = (user: Actor, id: string) =>
  db.application.findFirst({ where: { id, ...applicationScope(user) }, include: { chapter: { select: { name: true } } } });

export const countNewApplications = (user: Actor) => db.application.count({ where: { status: "NEW", ...applicationScope(user) } });

/** Active chapters for the public form's dropdown. */
export const listChapterChoices = () =>
  db.chapter.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true, university: true } });

/** Applications nobody has touched for a year and that never became a membership: the retention policy deletes these. */
export const staleWhere = (): Prisma.ApplicationWhereInput => {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS);
  return { updatedAt: { lt: cutoff }, status: { notIn: ["INVITED", "MEMBER"] }, membership: null };
};
export const countStaleApplications = () => db.application.count({ where: staleWhere() });
