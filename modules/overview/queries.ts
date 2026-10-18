import "server-only";
import { db } from "@/lib/db";
import { countNewApplications } from "@/modules/applications/queries";
import { countEndingSoon } from "@/modules/members/queries";
import { canHandleApplications, canManageContent, type Actor } from "@/modules/auth/permissions";

export async function getOverview(user: Actor) {
  const editor = canManageContent(user);
  const mine = editor ? {} : { createdById: user.id };

  const [grouped, awaiting, books, upcomingEvents, chapters, users, activity, newRequests, courses, certificates, newApplications, endingSoon] = await Promise.all([
    db.post.groupBy({ by: ["type", "status"], where: mine, _count: { _all: true } }),
    db.post.findMany({
      where: { status: "IN_REVIEW", ...mine },
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: { id: true, title: true, type: true, authorName: true, updatedAt: true },
    }),
    editor ? db.book.count({ where: { published: true } }) : 0,
    editor ? db.event.count({ where: { status: "PUBLISHED", startsAt: { gte: new Date() } } }) : 0,
    editor ? db.chapter.count({ where: { active: true } }) : 0,
    user.role === "ADMIN" ? db.user.count({ where: { active: true } }) : 0,
    editor
      ? db.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, select: { id: true, summary: true, createdAt: true, user: { select: { name: true } } } })
      : [],
    editor ? db.chapterRequest.count({ where: { status: "NEW" } }) : 0,
    editor ? db.course.count({ where: { status: "PUBLISHED" } }) : 0,
    editor ? db.certificate.count({ where: { revokedAt: null } }) : 0,
    canHandleApplications(user) ? countNewApplications(user) : 0,
    canHandleApplications(user) ? countEndingSoon(user) : 0,
  ]);

  const count = (type: "ARTICLE" | "NEWS" | null, status: string) =>
    grouped.filter((g) => g.status === status && (type === null || g.type === type)).reduce((a, g) => a + g._count._all, 0);

  return {
    editor,
    publishedArticles: count("ARTICLE", "PUBLISHED"),
    publishedNews: count("NEWS", "PUBLISHED"),
    inReview: count(null, "IN_REVIEW"),
    drafts: count(null, "DRAFT"),
    books,
    upcomingEvents,
    chapters,
    newApplications,
    endingSoon,
    canApplications: canHandleApplications(user),
    users,
    awaiting,
    activity,
    newRequests,
    courses,
    certificates,
  };
}

export type NavBadges = { inReview: number; applications: number; endingSoon: number; requests: number };

/** What is waiting for this person, for the numbers next to menu items. Zero hides the badge. */
export async function getNavBadges(user: Actor): Promise<NavBadges> {
  const editor = canManageContent(user);
  const [inReview, applications, endingSoon, requests] = await Promise.all([
    editor ? db.post.count({ where: { status: "IN_REVIEW" } }) : 0,
    canHandleApplications(user) ? countNewApplications(user) : 0,
    canHandleApplications(user) ? countEndingSoon(user) : 0,
    editor ? db.chapterRequest.count({ where: { status: "NEW" } }) : 0,
  ]);
  return { inReview, applications, endingSoon, requests };
}
