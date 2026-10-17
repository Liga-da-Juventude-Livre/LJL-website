import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

// Fronts are the shared taxonomy; seeded, and read by the forms of posts and books.
export const listFronts = cache(() => db.front.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }));
