import Link from "next/link";
import { Empty, LinkButton, PageHeader, Pill, dateBR } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { countCertificates, listCertificates } from "@/modules/certificates/queries";

export const metadata = { title: "Certificados" };

export default async function CertificatesPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; issued?: string }> }) {
  await requireRole("ADMIN", "EDITOR");
  const { status, q, issued } = await searchParams;
  const filter = status === "valid" || status === "revoked" ? status : undefined;
  const [items, counts] = await Promise.all([listCertificates({ status: filter, q }), countCertificates()]);
  const href = (s?: string) => `/dashboard/certificates${s || q ? `?${new URLSearchParams({ ...(s ? { status: s } : {}), ...(q ? { q } : {}) })}` : ""}`;
  const issuedCount = Number(issued);

  return (
    <>
      <PageHeader
        title="Certificados"
        subtitle="Emitidos pela equipe. Quem tem o código confere a autenticidade em /verify."
        actions={<LinkButton href="/dashboard/certificates/new">Emitir certificados</LinkButton>}
      />
      {Number.isInteger(issuedCount) && issuedCount > 0 && (
        <p className="dash-alert dash-alert-ok" role="status" style={{ marginBottom: 18 }}>
          {issuedCount === 1 ? "1 certificado emitido." : `${issuedCount} certificados emitidos.`} Abra cada um para baixar o PDF ou enviar por e-mail.
        </p>
      )}
      <nav className="dash-filters" aria-label="Filtrar">
        <Link href={href()} aria-current={!filter}>
          Todos ({counts.all})
        </Link>
        <Link href={href("valid")} aria-current={filter === "valid"}>
          Válidos ({counts.valid})
        </Link>
        <Link href={href("revoked")} aria-current={filter === "revoked"}>
          Revogados ({counts.revoked})
        </Link>
      </nav>
      <form className="dash-search" role="search">
        {filter && <input type="hidden" name="status" value={filter} />}
        <label className="sr-only" htmlFor="q">
          Buscar por nome, título ou código
        </label>
        <input id="q" name="q" defaultValue={q ?? ""} className="dash-input" placeholder="Buscar por nome, título ou código" />
        <button type="submit" className="dash-btn dash-btn-ghost">
          Buscar
        </button>
      </form>
      {items.length === 0 ? (
        <Empty title="Nenhum certificado aqui">{q || filter ? "Tente outra busca ou filtro." : "Emita o primeiro quando alguém concluir uma trilha ou participar de um evento."}</Empty>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Atividade</th>
                <th>Emitido</th>
                <th>Código</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td>
                    <p className="dash-title">
                      <Link href={`/dashboard/certificates/${c.id}`}>{c.recipientName}</Link>
                    </p>
                    {c.recipientEmail && <p className="dash-sub">{c.recipientEmail}</p>}
                  </td>
                  <td>
                    {c.title}
                    <p className="dash-sub">{c.hours} h</p>
                  </td>
                  <td>{dateBR(c.issuedAt)}</td>
                  <td className="dash-code">{c.code}</td>
                  <td>{c.revokedAt ? <Pill tone="ink">Revogado</Pill> : <Pill tone="green">Válido</Pill>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
