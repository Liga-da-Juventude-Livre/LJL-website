import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrations talk to Postgres directly: on Neon set DIRECT_URL to the non-pooled connection string.
// The running app uses DATABASE_URL (the pooled one).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
