import Link from "next/link";
import { Empty, LinkButton, PageHeader, Pill, dateBR } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { listChapters } from "@/modules/chapters/queries";

export const metadata = { title: "Diretórios" };

export default async function ChaptersPage() {
  await requireRole("ADMIN", "EDITOR");
  const chapters = await listChapters();
  return (
    <>
      <PageHeader
        title="Diretórios"
        subtitle="Os diretórios da Liga nas universidades."
        actions={<LinkButton href="/dashboard/chapters/new">Novo diretório</LinkButton>}
      />
      {chapters.length === 0 ? (
        <Empty title="Nenhum diretório ainda">Crie o primeiro.</Empty>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Diretório</th>
                <th>Cidade</th>
                <th>Fundação</th>
                <th>Pessoas</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((c) => (
                <tr key={c.id}>
                  <td>
                    <p className="dash-title">
                      <Link href={`/dashboard/chapters/${c.id}`}>{c.name}</Link>
                    </p>
                    <p className="dash-sub">{c.university}</p>
                  </td>
                  <td>
                    {c.city}
                    {c.state ? `, ${c.state}` : ""}
                  </td>
                  <td>{dateBR(c.foundedAt)}</td>
                  <td>{c._count.users}</td>
                  <td>{c.active ? <Pill tone="green">Ativo</Pill> : <Pill>Inativo</Pill>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
