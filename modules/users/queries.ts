import "server-only";
import { db } from "@/lib/db";
import type { Prisma, Role } from "@/generated/prisma/client";

export type UserFilter = { q?: string; role?: Role; status?: "active" | "inactive" };

export const listUsers = ({ q, role, status }: UserFilter = {}) => {
  const where: Prisma.UserWhereInput = {
    ...(role ? { role } : {}),
    ...(status ? { active: status === "active" } : {}),
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {}),
  };
  return db.user.findMany({
    where,
    orderBy: [{ active: "desc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true, active: true, lastLoginAt: true, createdAt: true, chapter: { select: { name: true } } },
  });
};

export const countUsersByRole = async () => {
  const rows = await db.user.groupBy({ by: ["role"], _count: { _all: true } });
  return Object.fromEntries(rows.map((r) => [r.role, r._count._all])) as Partial<Record<Role, number>>;
};

export const getUser = (id: string) =>
  db.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true, active: true, chapterId: true, lastLoginAt: true, createdAt: true } });
