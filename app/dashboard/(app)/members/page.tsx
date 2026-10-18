import Link from "next/link";
import { ExportLink } from "@/components/dashboard/ExportLink";
import { Empty, LinkButton, PageHeader, Pill, SearchBox, calendarDateBR } from "@/components/dashboard/ui";
import { memberTitleLabel } from "@/content/talent";
import { requireRole } from "@/modules/auth/dal";
import { canManageContent } from "@/modules/auth/permissions";
import { SOON_DAYS, countEndingSoon, isEndingSoon, countMembers, listMembers } from "@/modules/members/queries";

export const metadata = { title: "Membros" };

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ view?: string; q?: string }> }) {
  const user = await requireRole("ADMIN", "EDITOR", "COORDINATOR");
  const { view, q: rawQ } = await searchParams;
  const alumni = view === "alumni";
  const q = rawQ?.trim() || undefined;
  const [members, counts, soon] = await Promise.all([listMembers(user, alumni, q), countMembers(user), countEndingSoon(user)]);
  const central = canManageContent(user);

  return (
    <>
      <PageHeader
        title="Membros"
        subtitle="Quem está no diretório agora e quem já passou por ele. Mandatos que terminam em breve abrem vaga para o banco de talentos."
        actions={
          <>
            <ExportLink kind="members" />
            <LinkButton href="/dashboard/members/new">Novo membro</LinkButton>
          </>
        }
      />
      {soon > 0 && !alumni && (
        <p className="dash-alert dash-alert-warn" role="status">
          {soon === 1 ? "1 mandato termina" : `${soon} mandatos terminam`} em até {SOON_DAYS} dias (ou já passou da data). Abra a vaga e veja o banco de talentos.
        </p>
      )}
      <nav className="dash-filters" aria-label="Ativos ou alumni">
        <Link href="/dashboard/members" aria-current={!alumni}>
          Ativos ({counts.active})
        </Link>
        <Link href="/dashboard/members?view=alumni" aria-current={alumni}>
          Alumni ({counts.alumni})
        </Link>
      </nav>
      <SearchBox q={q} placeholder="Buscar por nome ou e-mail" keep={{ view: alumni ? "alumni" : undefined }} />
      {members.length === 0 ? (
        <Empty title={alumni ? "Nenhum alumni ainda" : "Nenhum membro ativo"}>
          {alumni ? "Quem encerra o mandato aparece aqui." : "Convide alguém do banco de talentos em Candidaturas ou adicione um membro."}
        </Empty>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Pessoa</th>
                {central && <th>Diretório</th>}
                <th>Função</th>
                <th>{alumni ? "Saiu em" : "Mandato até"}</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const ending = isEndingSoon(m);
                return (
                  <tr key={m.id}>
                    <td>
                      <p className="dash-title">
                        <Link href={`/dashboard/members/${m.id}`}>{m.name}</Link>
                      </p>
                      <p className="dash-sub">{m.email}</p>
                    </td>
                    {central && <td>{m.chapter.name}</td>}
                    <td>
                      {memberTitleLabel(m.title)} {m.mentor && alumni ? <Pill tone="green">Mentor</Pill> : null}
                    </td>
                    <td>
                      {alumni ? calendarDateBR(m.endedOn) : m.endsOn ? calendarDateBR(m.endsOn) : "—"} {ending ? <Pill tone="yellow">Vaga a caminho</Pill> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
