import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, Pill, dateTimeBR } from "@/components/dashboard/ui";
import { requireRole } from "@/modules/auth/dal";
import { requestStatus } from "@/modules/chapter-requests/labels";
import { getRequest } from "@/modules/chapter-requests/queries";
import { RequestForm } from "@/modules/chapter-requests/ui/request-form";

export const metadata = { title: "Pedido de diretório" };

export default async function ChapterRequestPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN", "EDITOR");
  const request = await getRequest((await params).id);
  if (!request) notFound();
  const s = requestStatus(request.status);
  const reply = `mailto:${request.email}?subject=${encodeURIComponent("Seu pedido de diretório na Liga da Juventude Livre")}`;

  return (
    <>
      <PageHeader
        title={request.name}
        subtitle={`${request.university} · recebido em ${dateTimeBR(request.createdAt)}`}
        actions={
          <>
            <Pill tone={s.tone}>{s.label}</Pill>
            <a className="dash-btn dash-btn-ghost" href={reply}>
              Responder por e-mail
            </a>
            {request.status === "STARTED" || request.status === "CONTACTED" ? (
              <Link className="dash-btn dash-btn-ghost" href="/dashboard/chapters/new">
                Criar o diretório
              </Link>
            ) : null}
          </>
        }
      />
      <div className="dash-stack">
        <section className="dash-card">
          <h2>O pedido</h2>
          <dl className="dash-facts">
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={reply}>{request.email}</a>
              </dd>
            </div>
            <div>
              <dt>Curso</dt>
              <dd>{request.course ?? "—"}</dd>
            </div>
            <div>
              <dt>Consentimento</dt>
              <dd>Dado em {dateTimeBR(request.consentAt)}</dd>
            </div>
            <div className="dash-facts-wide">
              <dt>Mensagem</dt>
              <dd className="dash-pre">{request.message ?? "—"}</dd>
            </div>
          </dl>
        </section>
        <section className="dash-card">
          <h2>Acompanhamento</h2>
          <RequestForm id={request.id} initial={{ status: request.status, university: request.university, notes: request.notes ?? "" }} />
        </section>
      </div>
    </>
  );
}
