import "server-only";
import { db } from "@/lib/db";

export const listBooks = () =>
  db.book.findMany({
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    include: { front: { select: { name: true } }, _count: { select: { downloads: true } } },
  });

export const getBook = (id: string) =>
  db.book.findUnique({ where: { id }, include: { downloads: { orderBy: { createdAt: "asc" } } } });
