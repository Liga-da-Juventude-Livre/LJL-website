import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, Pill, dateTimeBR } from "@/components/dashboard/ui";
import { interestLabel, skillLabel } from "@/content/talent";
import { applicationStatus } from "@/modules/applications/labels";
import { getApplication } from "@/modules/applications/queries";
import { ApplicationForm } from "@/modules/applications/ui/application-form";
import { db } from "@/lib/db";
import { requireRole } from "@/modules/auth/dal";
import { canManageContent } from "@/modules/auth/permissions";

export const metadata = { title: "Candidatura" };

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole("ADMIN", "EDITOR", "COORDINATOR");
  const a = await getApplication(user, (await params).id);
  if (!a) notFound();
  const s = applicationStatus(a.status);
  const trail = canManageContent(user) ? await db.course.findUnique({ where: { slug: "primeiro-mes" }, select: { id: true, title: true, workloadHours: true } }) : null;
  const trailCertificate = trail
    ? `/dashboard/certificates/new?people=${encodeURIComponent(`${a.name}, ${a.email}`)}&course=${trail.id}&title=${encodeURIComponent(`Trilha de leitura: ${trail.title}`)}${trail.workloadHours ? `&hours=${trail.workloadHours}` : ""}&kind=COMPLETION`
    : null;
  const member = await db.membership.findUnique({ where: { applicationId: a.id }, select: { id: true } });
  const reply = `mailto:${a.email}?subject=${encodeURIComponent("Sua candidatura na Liga da Juventude Livre")}`;

  return (
    <>
      <PageHeader
        back={{ href: "/dashboard/applications", label: "Candidaturas" }}
        title={a.name}
        subtitle={`${a.chapter?.name ?? "Sem diretório"} · recebida em ${dateTimeBR(a.createdAt)}`}
        actions={
          <>
            <Pill tone={s.tone}>{s.label}</Pill>
            <a className="dash-btn dash-btn-ghost" href={reply}>
              Responder por e-mail
            </a>
            {member ? (
              <Link className="dash-btn dash-btn-ghost" href={`/dashboard/members/${member.id}`}>
                Ver como membro
              </Link>
            ) : (
              <Link className="dash-btn dash-btn-ghost" href={`/dashboard/members/new?application=${a.id}`}>
                Tornar membro
              </Link>
            )}
            {trailCertificate ? (
              <Link className="dash-btn dash-btn-ghost" href={trailCertificate}>
                Certificado da trilha
              </Link>
            ) : null}
            {user.role === "ADMIN" && (a.status === "INVITED" || a.status === "MEMBER") ? (
              <Link className="dash-btn dash-btn-ghost" href="/dashboard/users/new">
                Criar a conta
              </Link>
            ) : null}
          </>
        }
      />
      <div className="dash-stack">
        <section className="dash-card">
          <h2>A candidatura</h2>
          <dl className="dash-facts">
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={reply}>{a.email}</a>
              </dd>
            </div>
            <div>
              <dt>Curso e período</dt>
              <dd>{[a.course, a.period].filter(Boolean).join(" · ") || "—"}</dd>
            </div>
            <div>
              <dt>Disponibilidade</dt>
              <dd>{a.hoursPerWeek ? `${a.hoursPerWeek} h por semana` : "—"}</dd>
            </div>
            <div>
              <dt>Portfólio</dt>
              <dd>
                {a.portfolioUrl ? (
                  <a href={a.portfolioUrl} target="_blank" rel="noopener noreferrer">
                    {a.portfolioUrl}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="dash-facts-wide">
              <dt>Competências</dt>
              <dd>{a.skills.map(skillLabel).join(", ") || "—"}</dd>
            </div>
            <div className="dash-facts-wide">
              <dt>Quer fazer</dt>
              <dd>{a.interests.map(interestLabel).join(", ") || "—"}</dd>
            </div>
            <div className="dash-facts-wide">
              <dt>Mensagem</dt>
              <dd className="dash-pre">{a.message ?? "—"}</dd>
            </div>
            <div>
              <dt>Consentimento</dt>
              <dd>Dado em {dateTimeBR(a.consentAt)}</dd>
            </div>
          </dl>
        </section>
        <section className="dash-card">
          <h2>Acompanhamento</h2>
          <ApplicationForm id={a.id} initial={{ status: a.status, notes: a.notes ?? "" }} />
        </section>
      </div>
    </>
  );
}
