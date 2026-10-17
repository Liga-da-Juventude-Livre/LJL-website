import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { SESSION_COOKIE } from "./constants";

// Opaque random token in an httpOnly cookie; the database keeps only its SHA-256 hash. Sessions are fixed-length
// (no sliding renewal, because cookies cannot be refreshed while rendering a page).
export const SESSION_DAYS = 14;

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.session.create({ data: { tokenHash: hashToken(token), userId, expiresAt } });
  // Housekeeping: drop sessions that have already expired.
  await db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/dashboard",
    expires: expiresAt,
  });
}

export async function currentToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function destroyCurrentSession(): Promise<void> {
  const token = await currentToken();
  if (token) await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/dashboard" });
}

/** Logs a user out everywhere except the device making the request (used after a password change). */
export async function destroyOtherSessions(userId: string): Promise<void> {
  const token = await currentToken();
  await db.session.deleteMany({ where: { userId, ...(token ? { NOT: { tokenHash: hashToken(token) } } : {}) } });
}
