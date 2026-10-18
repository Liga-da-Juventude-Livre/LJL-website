import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, Pill, calendarDateBR } from "@/components/dashboard/ui";
import { memberTitleLabel, skillLabel } from "@/content/talent";
import { requireRole } from "@/modules/auth/dal";
import { canManageContent } from "@/modules/auth/permissions";
import { getMember, listAccountChoices, suggestSuccessors } from "@/modules/members/queries";
import { MemberActions } from "@/modules/members/ui/member-actions";
import { MemberForm } from "@/modules/members/ui/member-form";
import { listChapterOptions } from "@/modules/chapters/queries";

export const metadata = { title: "Membro" };

const iso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole("ADMIN", "EDITOR", "COORDINATOR");
  const m = await getMember(user, (await params).id);
  if (!m) notFound();
  const active = !m.endedOn;
  const [chapters, accounts, successors] = await Promise.all([
    user.role === "COORDINATOR" ? [] : listChapterOptions(),
    user.role === "ADMIN" ? listAccountChoices(m.chapterId) : [],
    suggestSuccessors(user, m),
  ]);
  const certificate = `/dashboard/certificates/new?people=${encodeURIComponent(`${m.name}, ${m.email}`)}&title=${encodeURIComponent(`Membro do ${m.chapter.name} (${memberTitleLabel(m.title)})`)}&kind=PARTICIPATION`;

  return (
    <>
      <PageHeader
        back={{ href: "/dashboard/members", label: "Membros" }}
        title={m.name}
        subtitle={`${m.chapter.name} · ${memberTitleLabel(m.title)} · desde ${calendarDateBR(m.startedOn)}`}
        actions={
          <>
            <Pill tone={active ? "green" : "grey"}>{active ? "Ativo" : `Alumni desde ${calendarDateBR(m.endedOn)}`}</Pill>
            {m.mentor && !active ? <Pill tone="green">Mentor</Pill> : null}
            {canManageContent(user) && (
              <Link className="dash-btn dash-btn-ghost" href={certificate}>
                Emitir certificado de participação
              </Link>
            )}
          </>
        }
      />
      <div className="dash-stack">
        {m.user && (
          <p className="dash-alert dash-alert-warn" role="status">
            Tem conta no painel: {m.user.name} ({m.user.active ? "ativa" : "desativada"}). {active ? "Ao encerrar o mandato, o administrador desativa o acesso." : "Peça ao administrador para conferir se o acesso foi desativado."}
          </p>
        )}
        <section className="dash-card">
          <h2>Dados e mandato</h2>
          <MemberForm
            initial={{
              id: m.id,
              chapterId: m.chapterId,
              name: m.name,
              email: m.email,
              title: m.title,
              startedOn: iso(m.startedOn),
              endsOn: iso(m.endsOn),
              mentor: m.mentor,
              notes: m.notes ?? "",
              userId: m.userId ?? "",
            }}
            chapters={chapters}
            accounts={accounts}
            cancelHref="/dashboard/members"
          />
        </section>
        <section className="dash-card">
          <h2>{active ? "Quem pode assumir" : "Quem pode ocupar esta vaga"}</h2>
          <p className="dash-sub">
            Banco de talentos do diretório{m.skills.length ? `, com mais competências em comum com ${m.name.split(" ")[0]} (${m.skills.map(skillLabel).join(", ")})` : ""}.
          </p>
          {successors.length === 0 ? (
            <p>Ninguém no banco de talentos deste diretório agora. Candidaturas marcadas como “Banco de talentos” aparecem aqui.</p>
          ) : (
            <ul className="dash-list">
              {successors.map((s) => (
                <li key={s.id}>
                  <Link href={`/dashboard/applications/${s.id}`}>{s.name}</Link>
                  <span className="dash-sub">
                    {" "}
                    {[s.course, s.hoursPerWeek ? `${s.hoursPerWeek} h/semana` : null, s.match ? `${s.match} em comum` : null].filter(Boolean).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="dash-card">
          <h2>{active ? "Encerrar mandato" : "Alumni"}</h2>
          <MemberActions id={m.id} active={active} />
        </section>
      </div>
    </>
  );
}
