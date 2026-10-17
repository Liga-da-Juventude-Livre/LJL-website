import "server-only";
import { db } from "@/lib/db";

// ── dashboard ──
export const listCourses = () =>
  db.course.findMany({
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    include: { front: { select: { name: true } }, _count: { select: { lessons: true } } },
  });

export const getCourse = (id: string) =>
  db.course.findUnique({
    where: { id },
    include: { lessons: { orderBy: [{ position: "asc" }, { createdAt: "asc" }] } },
  });

/** Published books a lesson can point to. */
export const listBookOptions = () =>
  db.book.findMany({ where: { published: true }, orderBy: [{ title: "asc" }], select: { id: true, title: true, author: true } });

// ── public (only PUBLISHED) ──
export const listPublishedCourses = () =>
  db.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    include: { front: { select: { name: true } }, _count: { select: { lessons: true } } },
  });

export const getPublishedCourse = (slug: string) =>
  db.course.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      front: { select: { name: true } },
      lessons: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        include: {
          book: {
            select: {
              slug: true,
              title: true,
              author: true,
              year: true,
              coverUrl: true,
              // Only editions someone has checked are offered.
              downloads: { where: { verifiedAt: { not: null } }, select: { url: true, language: true, source: true }, take: 2 },
            },
          },
        },
      },
    },
  });
