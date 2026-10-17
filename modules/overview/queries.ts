import "server-only";
import { db } from "@/lib/db";
import { canManageContent, type Actor } from "@/modules/auth/permissions";

export async function getOverview(user: Actor) {
  const editor = canManageContent(user);
  const mine = editor ? {} : { createdById: user.id };

  const [grouped, awaiting, books, upcomingEvents, chapters, users, activity, newRequests, courses, certificates] = await Promise.all([
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
    users,
    awaiting,
    activity,
    newRequests,
    courses,
    certificates,
  };
}
