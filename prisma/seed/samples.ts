import { db } from "./client";
import { sampleArticles } from "./data/sample-articles";
import { sampleCourses } from "./data/sample-courses";

// Sample content so the site and the dashboard are not empty: six articles (four published, one in review, one draft) and
// two courses next to "Primeiro mês". Articles are signed "Equipe da Liga (exemplo)" and have no owner; `--demo` gives them owners.
// Created once and never overwritten, so editing a sample in the dashboard is safe. `npm run db:samples:clear` removes them.
export const SAMPLE_BYLINE = "Equipe da Liga (exemplo)";

export async function seedSamples() {
  const chapter = await db.chapter.findUnique({ where: { slug: "puc-rio" }, select: { id: true } });
  const fronts = new Map((await db.front.findMany({ select: { id: true, name: true } })).map((f) => [f.name, f.id]));

  for (const a of sampleArticles) {
    await db.post.upsert({
      where: { type_slug: { type: "ARTICLE", slug: a.slug } },
      update: {},
      create: {
        type: "ARTICLE",
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        body: a.body,
        status: a.status,
        publishedAt: a.status === "PUBLISHED" ? new Date(Date.now() - (a.daysAgo ?? 0) * 24 * 60 * 60 * 1000) : null,
        authorName: SAMPLE_BYLINE,
        frontId: fronts.get(a.front) ?? null,
        chapterId: chapter?.id ?? null,
      },
    });
  }
  console.log(`✓ ${sampleArticles.length} artigos de exemplo (${sampleArticles.filter((a) => a.status === "PUBLISHED").length} publicados, 1 em revisão, 1 rascunho)`);

  for (const c of sampleCourses) {
    if (await db.course.findUnique({ where: { slug: c.slug }, select: { id: true } })) continue;
    const { lessons, front } = c;
    await db.course.create({
      data: {
        slug: c.slug,
        title: c.title,
        summary: c.summary,
        description: c.description,
        kind: c.kind,
        level: c.level,
        durationWeeks: c.durationWeeks,
        workloadHours: c.workloadHours,
        sortOrder: c.sortOrder,
        status: "PUBLISHED",
        issuesCertificate: false,
        frontId: fronts.get(front) ?? null,
        lessons: {
          create: await Promise.all(
            lessons.map(async ({ book, ...lesson }, i) => ({
              ...lesson,
              position: i + 1,
              bookId: book ? ((await db.book.findUnique({ where: { slug: book }, select: { id: true } }))?.id ?? null) : null,
            })),
          ),
        },
      },
    });
  }
  console.log(`✓ trilhas e cursos de exemplo publicados: ${sampleCourses.map((c) => c.title).join(", ")}`);
}
