import { db } from "./client";
import { sampleCourses } from "./data/sample-courses";

// Sample content so the site and the dashboard are not empty: two courses next to "Primeiro mês". There are no sample
// articles any more: the team writes or adds its own in the dashboard.
// Created once and never overwritten, so editing a sample in the dashboard is safe. `npm run db:samples:clear` removes them.

export async function seedSamples() {
  const fronts = new Map((await db.front.findMany({ select: { id: true, name: true } })).map((f) => [f.name, f.id]));

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
