import { PageHeader } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { CourseForm, emptyCourse } from "@/modules/courses/ui/course-form";
import { listFronts } from "@/modules/fronts/queries";

export const metadata = { title: "Novo curso" };

export default async function NewCourse() {
  await requireRole("ADMIN", "EDITOR");
  return (
    <>
      <PageHeader title="Novo curso" subtitle="Depois de criar, você adiciona as aulas." />
      <section className="dash-card">
        <CourseForm initial={emptyCourse} fronts={await listFronts()} />
      </section>
    </>
  );
}
