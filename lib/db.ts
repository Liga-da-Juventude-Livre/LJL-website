import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// One Prisma client per server process (kept on globalThis so dev hot-reload does not open a new pool each time).
// It is created on first use, not at import, so `next build` works without a database.
// DATABASE_URL should be Neon's pooled connection string (host contains "-pooler").
const g = globalThis as unknown as { __prisma?: PrismaClient };

function client(): PrismaClient {
  if (!g.__prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL não está definida. Copie .env.example para .env e preencha.");
    // Optional cap on connections per server instance (pg's default is 10).
    const max = Number(process.env.DATABASE_POOL_MAX) || undefined;
    g.__prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString, max }) });
  }
  return g.__prisma;
}

export const db = new Proxy({} as PrismaClient, {
  get: (_target, prop) => Reflect.get(client(), prop),
});
