import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton, SubmitButton } from "@/components/dashboard/client";
import { PageHeader, Pill, calendarDateBR, dateTimeBR } from "@/components/dashboard/ui";
import { siteUrl } from "@/lib/site-url";
import { requireRole } from "@/modules/auth/dal";
import { deleteCertificate, restoreCertificate } from "@/modules/certificates/actions";
import { getCertificate } from "@/modules/certificates/queries";
import { qrSvg } from "@/modules/certificates/qr";
import { EditCertificateForm, RevokeCertificateForm } from "@/modules/certificates/ui/certificate-forms";

export const metadata = { title: "Certificado" };

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN", "EDITOR");
  const cert = await getCertificate((await params).id);
  if (!cert) notFound();
  const verifyUrl = `${await siteUrl()}/verify/${cert.code}`;
  const qr = await qrSvg(verifyUrl);
  const revoked = !!cert.revokedAt;
  const first = cert.recipientName.split(" ")[0];
  const mail = cert.recipientEmail
    ? `mailto:${cert.recipientEmail}?subject=${encodeURIComponent("Seu certificado da Liga da Juventude Livre")}&body=${encodeURIComponent(
        `Olá, ${first}!\n\nSeu certificado está disponível neste endereço:\n${verifyUrl}\n\nNessa página você baixa o PDF, e qualquer pessoa pode conferir a autenticidade com o código ${cert.code}.\n\nLiga da Juventude Livre`,
      )}`
    : null;

  return (
    <>
      <PageHeader
        title={cert.recipientName}
        subtitle={`${cert.title} · ${cert.hours} h`}
        actions={
          <>
            {revoked ? <Pill tone="ink">Revogado</Pill> : <Pill tone="green">Válido</Pill>}
            {!revoked && (
              <a className="dash-btn dash-btn-primary" href={`/verify/${cert.code}/pdf`} target="_blank" rel="noopener">
                Baixar PDF
              </a>
            )}
            <Link className="dash-btn dash-btn-ghost" href={`/verify/${cert.code}`} target="_blank">
              Ver página pública ↗
            </Link>
            {mail && !revoked && (
              <a className="dash-btn dash-btn-ghost" href={mail}>
                Enviar por e-mail
              </a>
            )}
          </>
        }
      />
      <div className="dash-stack">
        <section className="dash-card dash-cert-verify">
          <div>
            <h2>Verificação</h2>
            <dl className="dash-facts">
              <div>
                <dt>Código</dt>
                <dd className="dash-code">{cert.code}</dd>
              </div>
              <div>
                <dt>Emitido em</dt>
                <dd>{dateTimeBR(cert.issuedAt)}</dd>
              </div>
              <div>
                <dt>Concluído em</dt>
                <dd>{calendarDateBR(cert.completedOn)}</dd>
              </div>
              {revoked && (
                <div className="dash-facts-wide">
                  <dt>Revogado em {dateTimeBR(cert.revokedAt)}</dt>
                  <dd>{cert.revokedReason ?? "Sem motivo informado."}</dd>
                </div>
              )}
              <div className="dash-facts-wide">
                <dt>Endereço de verificação</dt>
                <dd>
                  <a href={verifyUrl} target="_blank" rel="noopener noreferrer">
                    {verifyUrl}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <div className="dash-qr" dangerouslySetInnerHTML={{ __html: qr }} aria-label="QR code do endereço de verificação" role="img" />
        </section>

        <section className="dash-card">
          <h2>Corrigir dados</h2>
          <EditCertificateForm
            id={cert.id}
            initial={{
              recipientName: cert.recipientName,
              recipientEmail: cert.recipientEmail ?? "",
              kind: cert.kind,
              title: cert.title,
              hours: String(cert.hours),
              completedOn: cert.completedOn.toISOString().slice(0, 10),
            }}
          />
        </section>

        <section className="dash-card">
          <h2>{revoked ? "Reativar" : "Revogar"}</h2>
          {revoked ? (
            <form action={restoreCertificate.bind(null, cert.id)} className="dash-form-actions">
              <SubmitButton>Reativar certificado</SubmitButton>
            </form>
          ) : (
            <RevokeCertificateForm id={cert.id} />
          )}
          <h2>Excluir</h2>
          <p className="dash-field-hint">Excluir apaga o registro e os dados da pessoa, e a página de verificação deixa de existir. Para só invalidar, use Revogar.</p>
          <form action={deleteCertificate.bind(null, cert.id)} className="dash-form-actions">
            <ConfirmButton message="Excluir este certificado e os dados da pessoa? Isso não pode ser desfeito.">Excluir certificado e dados</ConfirmButton>
          </form>
        </section>
      </div>
    </>
  );
}
