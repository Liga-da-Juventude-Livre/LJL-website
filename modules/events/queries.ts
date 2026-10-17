import "server-only";
import { db } from "@/lib/db";

export const listEvents = () =>
  db.event.findMany({ orderBy: { startsAt: "desc" }, include: { chapter: { select: { name: true } } } });

export const getEvent = (id: string) => db.event.findUnique({ where: { id } });
