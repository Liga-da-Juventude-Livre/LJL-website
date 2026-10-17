import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, StatusBadge } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { deleteCourse } from "@/modules/courses/actions";
import { getCourse, listBookOptions } from "@/modules/courses/queries";
import { CourseForm } from "@/modules/courses/ui/course-form";
import { LessonsEditor } from "@/modules/courses/ui/lessons-editor";
import { listFronts } from "@/modules/fronts/queries";

export const metadata = { title: "Editar curso" };

export default async function EditCourse({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN", "EDITOR");
  const course = await getCourse((await params).id);
  if (!course) notFound();
  const [fronts, books] = await Promise.all([listFronts(), listBookOptions()]);
  return (
    <>
      <PageHeader
        title={course.title}
        actions={
          <>
            <StatusBadge status={course.status} />
            {course.status === "PUBLISHED" && (
              <Link className="dash-btn dash-btn-ghost" href={`/courses/${course.slug}`} target="_blank">
                Ver no site ↗
              </Link>
            )}
          </>
        }
      />
      <div className="dash-stack">
        <section className="dash-card">
          <h2>O curso</h2>
          <CourseForm
            fronts={fronts}
            deleteAction={deleteCourse.bind(null, course.id)}
            initial={{
              id: course.id,
              title: course.title,
              slug: course.slug,
              summary: course.summary,
              description: course.description ?? "",
              kind: course.kind,
              level: course.level,
              frontId: course.frontId ?? "",
              durationWeeks: course.durationWeeks?.toString() ?? "",
              workloadHours: course.workloadHours?.toString() ?? "",
              issuesCertificate: course.issuesCertificate,
              status: course.status,
              sortOrder: String(course.sortOrder),
            }}
          />
        </section>
        <section className="dash-card">
          <h2>Aulas</h2>
          <LessonsEditor courseId={course.id} lessons={course.lessons} books={books} />
        </section>
      </div>
    </>
  );
}
