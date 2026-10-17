import Link from "next/link";
import { Empty, LinkButton, PageHeader, StatusBadge, dateTimeBR } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { listEvents } from "@/modules/events/queries";

export const metadata = { title: "Eventos" };

export default async function EventsPage() {
  await requireRole("ADMIN", "EDITOR");
  const events = await listEvents();
  return (
    <>
      <PageHeader title="Eventos" subtitle="Debates, seminários e encontros." actions={<LinkButton href="/dashboard/events/new">Novo evento</LinkButton>} />
      {events.length === 0 ? (
        <Empty title="Nenhum evento ainda">Crie o primeiro.</Empty>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Quando</th>
                <th>Diretório</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>
                    <p className="dash-title">
                      <Link href={`/dashboard/events/${e.id}`}>{e.title}</Link>
                    </p>
                    {e.location && <p className="dash-sub">{e.location}</p>}
                  </td>
                  <td>{dateTimeBR(e.startsAt)}</td>
                  <td>{e.chapter?.name ?? "—"}</td>
                  <td>
                    <StatusBadge status={e.status} />
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
