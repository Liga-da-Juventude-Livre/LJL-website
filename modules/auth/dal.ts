import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { Role } from "@/generated/prisma/client";
import { currentToken, hashToken } from "./session";

// Data access layer for auth: the real check happens here, against the database. proxy.ts only does a cheap
// "is there a cookie" redirect, which is not security on its own.

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  chapterId: string | null;
  mustChangePassword: boolean;
};

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const token = await currentToken();
  if (!token) return null;
  const row = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      expiresAt: true,
      user: { select: { id: true, name: true, email: true, role: true, chapterId: true, mustChangePassword: true, active: true } },
    },
  });
  if (!row || row.expiresAt < new Date() || !row.user.active) return null;
  const { id, name, email, role, chapterId, mustChangePassword } = row.user;
  return { id, name, email, role, chapterId, mustChangePassword };
});

/** The logged-in user, or a redirect to the login page. Pass `allowMustChange` only on the change-password page. */
export async function requireUser(opts: { allowMustChange?: boolean } = {}): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/dashboard/login");
  if (user.mustChangePassword && !opts.allowMustChange) redirect("/dashboard/account?required=1");
  return user;
}

/** Like requireUser, and also sends anyone without one of `roles` back to the dashboard home. */
export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/dashboard?denied=1");
  return user;
}
