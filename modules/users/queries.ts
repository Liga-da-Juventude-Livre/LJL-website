import "server-only";
import { db } from "@/lib/db";

export const listUsers = () =>
  db.user.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true, active: true, lastLoginAt: true, chapter: { select: { name: true } } },
  });

export const getUser = (id: string) =>
  db.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true, active: true, chapterId: true } });
