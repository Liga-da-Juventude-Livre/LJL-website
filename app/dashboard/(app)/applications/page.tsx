import Link from "next/link";
import { ExportLink } from "@/components/dashboard/ExportLink";
import { Empty, PageHeader, Pill, SearchBox, dateBR } from "@/components/dashboard/ui";
import { SKILLS, skillLabel } from "@/content/talent";
import type { ApplicationStatus } from "@/generated/prisma/client";
import { APPLICATION_STATUSES, applicationStatus } from "@/modules/applications/labels";
import { purgeStaleApplications } from "@/modules/applications/actions";
import { ConfirmButton } from "@/components/dashboard/client";
import { RETENTION_MONTHS } from "@/modules/applications/retention";
import { countApplicationsByStatus, countStaleApplications, listApplications } from "@/modules/applications/queries";
import { requireRole } from "@/modules/auth/dal";
import { canManageContent } from "@/modules/auth/permissions";

export const metadata = { title: "Candidaturas" };

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ status?: string; skill?: string; q?: string }> }) {
  const user = await requireRole("ADMIN", "EDITOR", "COORDINATOR");
  const { status, skill, q: rawQ } = await searchParams;
  const q = rawQ?.trim() || undefined;
  const statusFilter = APPLICATION_STATUSES.find((s) => s.value === status)?.value as ApplicationStatus | undefined;
  const skillFilter = SKILLS.find((s) => s.value === skill)?.value;
  const [applications, counts, stale] = await Promise.all([
    listApplications(user, { status: statusFilter, skill: skillFilter, q }),
    countApplicationsByStatus(user),
    user.role === "ADMIN" ? countStaleApplications() : 0,
  ]);
  const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
  const central = canManageContent(user);
  const href = (s?: string, k?: string) => {
    const p = new URLSearchParams();
    if (s) p.set("status", s);
    if (k) p.set("skill", k);
    if (q) p.set("q", q);
    return `/dashboard/applications${p.size ? `?${p}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Candidaturas"
        subtitle={central ? "Quem quer ajudar a Liga, por diretório." : "Quem quer ajudar o seu diretório. Filtre por competência quando abrir uma vaga."}
        actions={<ExportLink kind="applications" />}
      />
      <nav className="dash-filters" aria-label="Filtrar por situação">
        <Link href={href(undefined, skillFilter)} aria-current={!statusFilter}>
          Todas ({total})
        </Link>
        {APPLICATION_STATUSES.map((s) => (
          <Link key={s.value} href={href(s.value, skillFilter)} aria-current={statusFilter === s.value}>
            {s.label} ({counts[s.value] ?? 0})
          </Link>
        ))}
      </nav>
      <SearchBox q={q} placeholder="Buscar por nome, e-mail ou curso" keep={{ status: statusFilter, skill: skillFilter }} />
      <nav className="dash-filters" aria-label="Filtrar por competência">
        <Link href={href(statusFilter)} aria-current={!skillFilter}>
          Qualquer competência
        </Link>
        {SKILLS.map((s) => (
          <Link key={s.value} href={href(statusFilter, s.value)} aria-current={skillFilter === s.value}>
            {s.label}
          </Link>
        ))}
      </nav>
      {applications.length === 0 ? (
        <Empty title="Nenhuma candidatura aqui">{statusFilter || skillFilter || q ? "Tente outra busca ou filtro." : "Quando alguém preencher o formulário em /join, a candidatura aparece aqui."}</Empty>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Pessoa</th>
                {central && <th>Diretório</th>}
                <th>Competências</th>
                <th>Recebida</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => {
                const s = applicationStatus(a.status);
                return (
                  <tr key={a.id}>
                    <td>
                      <p className="dash-title">
                        <Link href={`/dashboard/applications/${a.id}`}>{a.name}</Link>
                      </p>
                      <p className="dash-sub">{[a.course, a.period].filter(Boolean).join(" · ") || a.email}</p>
                    </td>
                    {central && <td>{a.chapter?.name ?? "Sem diretório"}</td>}
                    <td>
                      <p className="dash-sub">{a.skills.map(skillLabel).join(", ") || "—"}</p>
                    </td>
                    <td>{dateBR(a.createdAt)}</td>
                    <td>
                      <Pill tone={s.tone}>{s.label}</Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {stale > 0 && (
        <section className="dash-card">
          <h2>Limpeza</h2>
          <p>
            {stale === 1 ? "1 candidatura está" : `${stale} candidaturas estão`} sem atividade há mais de {RETENTION_MONTHS} meses e nunca virou membro. A política de privacidade prevê apagar esses dados.
          </p>
          <form action={purgeStaleApplications} className="dash-form-actions">
            <ConfirmButton message="Apagar essas candidaturas e os dados das pessoas? Isso não pode ser desfeito.">Apagar candidaturas antigas</ConfirmButton>
          </form>
        </section>
      )}
    </>
  );
}
