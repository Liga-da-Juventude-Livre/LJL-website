import { hashPassword } from "../../modules/auth/password";
import { db } from "./client";
import { sampleCourses } from "./data/sample-courses";
import { primeiroMes } from "./data/tracks";

// Sample LOGINS, behind `--demo`, because they have a password everyone knows: never for a real database. They give the sample
// articles owners (so each author sees their own in the dashboard) and turn on the certificate notice on two courses.
// Every demo account uses an @liga.test address (a domain that can never receive mail), which is how `db:samples:clear` finds them.
export const DEMO_DOMAIN = "@liga.test";
export const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD?.trim() || "liga-demo-2026";

const people = {
  admin: { name: "Ana Admin", email: `admin${DEMO_DOMAIN}`, role: "ADMIN" as const },
  editor: { name: "Eduardo Editor", email: `editor${DEMO_DOMAIN}`, role: "EDITOR" as const },
  autor: { name: "Bia Autora", email: `autor${DEMO_DOMAIN}`, role: "AUTHOR" as const },
  coord: { name: "Carla Coordenadora", email: `coord${DEMO_DOMAIN}`, role: "COORDINATOR" as const },
  autor2: { name: "Caio Autor", email: `autor2${DEMO_DOMAIN}`, role: "AUTHOR" as const },
};

export async function seedDemo() {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    throw new Error("Os logins de exemplo não rodam em produção (NODE_ENV/VERCEL_ENV = production).");
  }
  const chapter = await db.chapter.findUnique({ where: { slug: "puc-rio" }, select: { id: true } });
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const users = {} as Record<keyof typeof people, { id: string; name: string }>;
  for (const [key, p] of Object.entries(people) as [keyof typeof people, (typeof people)[keyof typeof people]][]) {
    const row = await db.user.upsert({ where: { email: p.email }, update: {}, create: { ...p, passwordHash, chapterId: chapter?.id ?? null, mustChangePassword: false } });
    users[key] = { id: row.id, name: row.name };
  }
  console.log(`✓ ${Object.keys(users).length} logins de exemplo`);

  const sampleSlugs = sampleCourses.map((c) => c.slug);
  await db.course.updateMany({ where: { slug: { in: sampleSlugs }, createdById: null }, data: { createdById: users.editor.id } });
  const certifying = [primeiroMes.slug, ...sampleCourses.filter((c) => c.issuesCertificate).map((c) => c.slug)];
  await db.course.updateMany({ where: { slug: { in: certifying } }, data: { issuesCertificate: true } });
  console.log("✓ cursos de exemplo agora têm dono; “Emite certificado” ligado em " + certifying.length + " cursos");

  console.log("\nLogins de exemplo (senha de todos: " + DEMO_PASSWORD + ")");
  for (const p of Object.values(people)) console.log(`  ${p.email.padEnd(22)} ${p.role.padEnd(11)} ${p.name}`);
  console.log("\nNunca rode isto num banco de verdade. Para remover os exemplos: npm run db:samples:clear");
}
