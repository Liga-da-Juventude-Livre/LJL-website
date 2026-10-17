// No "server-only" here on purpose: prisma/seed.ts (plain Node) reuses this file. node:crypto already keeps it out of client bundles.
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";

// scrypt with a per-password salt; the parameters are stored in the hash so they can be raised later.
// Format: scrypt$N$r$p$salt(base64)$hash(base64)
const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;

function derive(password: string, salt: Buffer, n: number, r: number, p: number, keylen: number) {
  return new Promise<Buffer>((resolve, reject) =>
    scryptCallback(password, salt, keylen, { N: n, r, p }, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, N, R, P, KEYLEN);
  return ["scrypt", N, R, P, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, n, r, p, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await derive(password, Buffer.from(salt, "base64"), Number(n), Number(r), Number(p), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Burns the same time as a real check, so "no such e-mail" cannot be told apart by response time. */
export async function fakeVerify(password: string): Promise<void> {
  await derive(password, Buffer.alloc(16), N, R, P, KEYLEN);
}

export const MIN_PASSWORD = 10;
