import { PageHeader } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { listCourseOptions, listEventOptions } from "@/modules/certificates/queries";
import { IssueForm } from "@/modules/certificates/ui/issue-form";

export const metadata = { title: "Emitir certificados" };

export default async function NewCertificates() {
  await requireRole("ADMIN", "EDITOR");
  const [courses, events] = await Promise.all([listCourseOptions(), listEventOptions()]);
  // Today in Brasília, as YYYY-MM-DD ("sv-SE" formats that way).
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(new Date());
  return (
    <>
      <PageHeader title="Emitir certificados" subtitle="Para uma pessoa ou para várias de uma vez, todas com o mesmo título, carga horária e data." />
      <section className="dash-card">
        <IssueForm courses={courses} events={events} today={today} />
      </section>
    </>
  );
}
