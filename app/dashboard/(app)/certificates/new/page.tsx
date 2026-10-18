import { PageHeader } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { listCourseOptions, listEventOptions } from "@/modules/certificates/queries";
import { IssueForm } from "@/modules/certificates/ui/issue-form";

export const metadata = { title: "Emitir certificados" };

export default async function NewCertificates({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireRole("ADMIN", "EDITOR");
  const q = await searchParams;
  const [courses, events] = await Promise.all([listCourseOptions(), listEventOptions()]);
  // Today in Brasília, as YYYY-MM-DD ("sv-SE" formats that way).
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(new Date());
  return (
    <>
      <PageHeader title="Emitir certificados" subtitle="Para uma pessoa ou para várias de uma vez, todas com o mesmo título, carga horária e data." />
      <section className="dash-card">
        <IssueForm
          courses={courses}
          events={events}
          today={today}
          initial={{
            people: (q.people ?? "").slice(0, 400),
            courseId: courses.some((c) => c.id === q.course) ? (q.course as string) : "",
            title: (q.title ?? "").slice(0, 160),
            hours: /^\d{1,4}$/.test(q.hours ?? "") ? (q.hours as string) : "",
            kind: q.kind === "PARTICIPATION" ? "PARTICIPATION" : "COMPLETION",
          }}
        />
      </section>
    </>
  );
}
