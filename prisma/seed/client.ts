import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

// One client for the seed scripts. They talk to Postgres directly: on Neon, DIRECT_URL is the non-pooled string.
const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("Defina DATABASE_URL (ou DIRECT_URL) no .env antes de rodar o seed.");

export const db = new PrismaClient({ adapter: new PrismaPg({ connectionString, max: Number(process.env.DATABASE_POOL_MAX) || undefined }) });
