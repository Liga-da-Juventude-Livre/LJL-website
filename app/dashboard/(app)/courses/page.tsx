import Link from "next/link";
import { Empty, LinkButton, PageHeader, Pill, StatusBadge } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { levelLabel } from "@/modules/books/labels";
import { kindLabel } from "@/modules/courses/labels";
import { listCourses } from "@/modules/courses/queries";

export const metadata = { title: "Cursos" };

export default async function CoursesPage() {
  await requireRole("ADMIN", "EDITOR");
  const courses = await listCourses();
  return (
    <>
      <PageHeader
        title="Cursos e trilhas"
        subtitle="Trilhas de leitura e cursos. O progresso de quem estuda fica no navegador da pessoa, sem cadastro."
        actions={<LinkButton href="/dashboard/courses/new">Novo curso</LinkButton>}
      />
      {courses.length === 0 ? (
        <Empty title="Nenhum curso ainda">Crie o primeiro e adicione as aulas.</Empty>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Tipo</th>
                <th>Nível</th>
                <th>Aulas</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td>
                    <p className="dash-title">
                      <Link href={`/dashboard/courses/${c.id}`}>{c.title}</Link>
                    </p>
                    {c.front && <p className="dash-sub">{c.front.name}</p>}
                  </td>
                  <td>
                    <Pill tone={c.kind === "TRACK" ? "green" : "grey"}>{kindLabel(c.kind)}</Pill>
                  </td>
                  <td>{levelLabel(c.level)}</td>
                  <td>{c._count.lessons}</td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
