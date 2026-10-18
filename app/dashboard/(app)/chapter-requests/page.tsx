import Link from "next/link";
import { ExportLink } from "@/components/dashboard/ExportLink";
import { Empty, PageHeader, Pill, dateBR } from "@/components/dashboard/ui";
import type { RequestStatus } from "@/generated/prisma/client";
import { requireRole } from "@/modules/auth/dal";
import { REQUEST_STATUSES, requestStatus } from "@/modules/chapter-requests/labels";
import { countRequestsByStatus, listRequests } from "@/modules/chapter-requests/queries";

export const metadata = { title: "Pedidos de diretório" };

export default async function ChapterRequestsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireRole("ADMIN", "EDITOR");
  const { status } = await searchParams;
  const filter = REQUEST_STATUSES.find((s) => s.value === status)?.value as RequestStatus | undefined;
  const [requests, counts] = await Promise.all([listRequests(filter), countRequestsByStatus()]);
  const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);

  return (
    <>
      <PageHeader title="Pedidos de diretório" subtitle="Estudantes que pediram para abrir um diretório. Só entram no contador público os que você já respondeu." actions={<ExportLink kind="chapter-requests" />} />
      <nav className="dash-filters" aria-label="Filtrar por situação">
        <Link href="/dashboard/chapter-requests" aria-current={!filter}>
          Todos ({total})
        </Link>
        {REQUEST_STATUSES.map((s) => (
          <Link key={s.value} href={`/dashboard/chapter-requests?status=${s.value}`} aria-current={filter === s.value}>
            {s.label} ({counts[s.value] ?? 0})
          </Link>
        ))}
      </nav>
      {requests.length === 0 ? (
        <Empty title="Nenhum pedido aqui">{filter ? "Tente outro filtro." : "Quando alguém preencher o formulário em /chapters, o pedido aparece aqui."}</Empty>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Universidade</th>
                <th>Recebido</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => {
                const s = requestStatus(r.status);
                return (
                  <tr key={r.id}>
                    <td>
                      <p className="dash-title">
                        <Link href={`/dashboard/chapter-requests/${r.id}`}>{r.name}</Link>
                      </p>
                      <p className="dash-sub">{r.email}</p>
                    </td>
                    <td>
                      {r.university}
                      {r.course && <p className="dash-sub">{r.course}</p>}
                    </td>
                    <td>{dateBR(r.createdAt)}</td>
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
    </>
  );
}
