import { books } from "../../content/library";
import { fronts } from "../../content/site";
import { slugify } from "../../lib/slug";
import { hashPassword, MIN_PASSWORD } from "../../modules/auth/password";
import { db } from "./client";
import { primeiroMes } from "./data/tracks";

// What every environment gets. Safe to run again: each row is created only if it is missing, so edits made in the
// dashboard survive. The real administrator comes from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (and SEED_ADMIN_NAME).

const LEVEL = { Iniciante: "BEGINNER", Intermediário: "INTERMEDIATE", Avançado: "ADVANCED" } as const;
const VERIFIED_ON = new Date("2026-10-17T12:00:00-03:00"); // when the free-edition links were last checked by hand

export async function seedCore({ publishTrack = false }: { publishTrack?: boolean } = {}) {
  const frontIds = new Map<string, string>();
  for (const [i, f] of fronts.entries()) {
    const slug = slugify(f.title);
    const row = await db.front.upsert({ where: { slug }, update: {}, create: { slug, name: f.title, summary: f.text, question: f.question, sortOrder: i } });
    frontIds.set(f.title, row.id);
  }
  console.log(`✓ ${frontIds.size} frentes`);

  const chapter = await db.chapter.upsert({
    where: { slug: "puc-rio" },
    update: {},
    create: { slug: "puc-rio", name: "Diretório PUC-Rio", university: "PUC-Rio", city: "Rio de Janeiro", state: "RJ", active: true },
  });
  console.log(`✓ diretório ${chapter.name}`);

  let downloads = 0;
  for (const [i, b] of books.entries()) {
    const frontId = frontIds.get(b.front);
    if (!frontId) throw new Error(`Frente desconhecida para "${b.title}": ${b.front}`);
    const slug = slugify(b.title);
    const book = await db.book.upsert({
      where: { slug },
      update: {},
      create: { slug, title: b.title, author: b.author, year: b.year, level: LEVEL[b.level], note: b.note, featured: !!b.start, sortOrder: i, frontId },
    });
    if (b.download && !(await db.bookDownload.findFirst({ where: { bookId: book.id, url: b.download.url } }))) {
      await db.bookDownload.create({
        data: { bookId: book.id, url: b.download.url, language: b.download.language, source: b.download.source, edition: b.download.edition, verifiedAt: VERIFIED_ON },
      });
      downloads++;
    }
  }
  console.log(`✓ ${books.length} livros (${downloads} edições gratuitas novas)`);

  // The first reading track: published together with the sample content, or a draft with --no-samples. Created once only.
  if (!(await db.course.findUnique({ where: { slug: primeiroMes.slug }, select: { id: true } }))) {
    const { lessons, ...course } = primeiroMes;
    await db.course.create({
      data: {
        ...course,
        status: publishTrack ? "PUBLISHED" : "DRAFT",
        sortOrder: 0,
        lessons: {
          create: await Promise.all(
            lessons.map(async ({ book, ...lesson }, i) => ({
              ...lesson,
              position: i + 1,
              bookId: (await db.book.findUnique({ where: { slug: book }, select: { id: true } }))?.id ?? null,
            })),
          ),
        },
      },
    });
    console.log(`✓ trilha “Primeiro mês” (${publishTrack ? "publicada" : "rascunho"}; as perguntas e tarefas merecem a revisão da equipe)`);
  }

  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("• Administrador não criado: defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD para criar o primeiro acesso.");
  } else if (password.length < MIN_PASSWORD) {
    throw new Error(`SEED_ADMIN_PASSWORD precisa ter pelo menos ${MIN_PASSWORD} caracteres.`);
  } else {
    const admin = await db.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: process.env.SEED_ADMIN_NAME?.trim() || "Administrador",
        passwordHash: await hashPassword(password),
        role: "ADMIN",
        chapterId: chapter.id,
        mustChangePassword: true,
      },
    });
    console.log(`✓ administrador ${admin.email} (troca a senha no primeiro acesso)`);
  }
}
