import "server-only";
import { db } from "@/lib/db";
import type { PostType, PublishStatus } from "@/generated/prisma/client";
import { canManageContent, type Actor } from "@/modules/auth/permissions";

/** Editors and admins see every post; authors only the ones they created. */
export function listPosts(user: Actor, type: PostType, status?: PublishStatus) {
  return db.post.findMany({
    where: { type, ...(status ? { status } : {}), ...(canManageContent(user) ? {} : { createdById: user.id }) },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      title: true,
      authorName: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
      front: { select: { name: true } },
      createdById: true,
    },
  });
}

export const countPostsByStatus = async (user: Actor, type: PostType) => {
  const rows = await db.post.groupBy({
    by: ["status"],
    where: { type, ...(canManageContent(user) ? {} : { createdById: user.id }) },
    _count: { _all: true },
  });
  return Object.fromEntries(rows.map((r) => [r.status, r._count._all])) as Partial<Record<PublishStatus, number>>;
};

export const getPost = (id: string) => db.post.findUnique({ where: { id } });
