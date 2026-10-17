import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export const listChapterOptions = cache(() =>
  db.chapter.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
);

export const listChapters = () =>
  db.chapter.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { users: true, posts: true, events: true } } },
  });

export const getChapter = (id: string) => db.chapter.findUnique({ where: { id } });
