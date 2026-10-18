import "server-only";
import { db } from "@/lib/db";
import { chapterScope, type Actor } from "@/modules/auth/permissions";

// Like applications, every query adds the viewer's scope so a coordinator only ever sees their own diretório.

/** How soon a mandate's end counts as "a vacancy is coming". */
export const SOON_DAYS = 45;

/** True when an active mandate ends within SOON_DAYS, or already should have. */
export const isEndingSoon = (m: { endedOn: Date | null; endsOn: Date | null }) =>
  !m.endedOn && !!m.endsOn && m.endsOn.getTime() <= Date.now() + SOON_DAYS * 86_400_000;

export const listMembers = (user: Actor, alumni: boolean) =>
  db.membership.findMany({
    where: { ...chapterScope(user), endedOn: alumni ? { not: null } : null },
    orderBy: alumni ? { endedOn: "desc" } : [{ endsOn: { sort: "asc", nulls: "last" } }, { name: "asc" }],
    include: { chapter: { select: { name: true } } },
  });

export const countMembers = async (user: Actor) => {
  const [active, alumni] = await Promise.all([
    db.membership.count({ where: { ...chapterScope(user), endedOn: null } }),
    db.membership.count({ where: { ...chapterScope(user), endedOn: { not: null } } }),
  ]);
  return { active, alumni };
};

export const getMember = (user: Actor, id: string) =>
  db.membership.findFirst({
    where: { id, ...chapterScope(user) },
    include: { chapter: { select: { name: true } }, user: { select: { id: true, name: true, role: true, active: true } } },
  });

/** Active mandates that end within SOON_DAYS (or already should have), i.e. the vacancies about to open. */
export const countEndingSoon = (user: Actor) =>
  db.membership.count({
    where: { ...chapterScope(user), endedOn: null, endsOn: { lte: new Date(Date.now() + SOON_DAYS * 86_400_000) } },
  });

/** Talent-pool people of the same diretório, those who share most skills with the member first. */
export async function suggestSuccessors(user: Actor, member: { chapterId: string; skills: string[] }) {
  const pool = await db.application.findMany({
    where: { ...chapterScope(user), chapterId: member.chapterId, status: "POOL" },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, course: true, skills: true, hoursPerWeek: true },
  });
  const score = (skills: string[]) => skills.filter((s) => member.skills.includes(s)).length;
  return pool.map((a) => ({ ...a, match: score(a.skills) })).sort((a, b) => b.match - a.match);
}

/** Accounts of a diretório, for linking a membership to a login (administrators only). */
export const listAccountChoices = (chapterId: string) =>
  db.user.findMany({ where: { chapterId, active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } });
