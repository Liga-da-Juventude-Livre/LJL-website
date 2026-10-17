import { db } from "./seed/client";
import { sampleArticles } from "./seed/data/sample-articles";
import { sampleCourses } from "./seed/data/sample-courses";
import { primeiroMes } from "./seed/data/tracks";
import { DEMO_DOMAIN } from "./seed/demo";

// Removes the sample content and the demo logins, and nothing else: the library, the fronts and the real administrator stay.
// A sample article is only deleted while its byline still ends with "(exemplo)": if the team rewrote and re-signed it, it is theirs now.
// "Primeiro mês" goes back to a draft instead of being deleted, since it is the track the team is meant to review and publish.
async function main() {
  const demoUsers = { email: { endsWith: DEMO_DOMAIN } };
  const samplePosts = await db.post.deleteMany({
    where: { OR: [{ type: "ARTICLE", slug: { in: sampleArticles.map((a) => a.slug) }, authorName: { endsWith: "(exemplo)" } }, { createdBy: demoUsers }] },
  });
  const courses = await db.course.deleteMany({ where: { OR: [{ slug: { in: sampleCourses.map((c) => c.slug) } }, { createdBy: demoUsers }] } });
  await db.course.updateMany({ where: { slug: primeiroMes.slug }, data: { status: "DRAFT", issuesCertificate: false } });
  const logs = await db.activityLog.deleteMany({ where: { user: demoUsers } });
  const users = await db.user.deleteMany({ where: demoUsers });
  console.log(`✓ removidos: ${users.count} logins de exemplo, ${samplePosts.count} artigos, ${courses.count} cursos, ${logs.count} registros de atividade`);
  console.log("  “Primeiro mês” voltou a ser rascunho.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
