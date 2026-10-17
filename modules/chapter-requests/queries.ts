import "server-only";
import { db } from "@/lib/db";
import type { RequestStatus } from "@/generated/prisma/client";
import { slugify } from "@/lib/slug";

export const listRequests = (status?: RequestStatus) =>
  db.chapterRequest.findMany({ where: status ? { status } : {}, orderBy: { createdAt: "desc" } });

export const countRequestsByStatus = async () => {
  const rows = await db.chapterRequest.groupBy({ by: ["status"], _count: { _all: true } });
  return Object.fromEntries(rows.map((r) => [r.status, r._count._all])) as Partial<Record<RequestStatus, number>>;
};

export const getRequest = (id: string) => db.chapterRequest.findUnique({ where: { id } });

/** What the public /chapters page shows. Interest counts only requests a person on the team has already answered
 *  (CONTACTED or STARTED), so a flood of fake submissions can never inflate the number. */
export async function getPublicChapterInfo() {
  const [chapters, answered] = await Promise.all([
    db.chapter.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true, university: true, city: true, state: true } }),
    db.chapterRequest.findMany({
      where: { status: { in: ["CONTACTED", "STARTED"] } },
      orderBy: { createdAt: "asc" },
      select: { university: true, universityKey: true },
    }),
  ]);
  const chapterKeys = new Set(chapters.map((c) => slugify(c.university)));
  // Per campus: count the people, and show the spelling used most often (ties go to the oldest request, which is
  // iterated first). Staff can also normalise the spelling on each request.
  const byKey = new Map<string, { count: number; spellings: Map<string, number> }>();
  for (const r of answered) {
    if (chapterKeys.has(r.universityKey)) continue; // already has a chapter
    const entry = byKey.get(r.universityKey) ?? { count: 0, spellings: new Map() };
    entry.count++;
    entry.spellings.set(r.university, (entry.spellings.get(r.university) ?? 0) + 1);
    byKey.set(r.universityKey, entry);
  }
  const interest = [...byKey.values()]
    .map((e) => ({ count: e.count, name: [...e.spellings.entries()].reduce((best, cur) => (cur[1] > best[1] ? cur : best))[0] }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "pt-BR"));
  return { chapters, interest };
}
