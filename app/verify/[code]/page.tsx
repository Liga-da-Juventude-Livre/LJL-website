import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver, Words } from "@/components/Reveal";
import { contactEmail } from "@/content/site";
import { normalizeCode } from "@/modules/certificates/codes";
import { getCertificateByCode } from "@/modules/certificates/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verificar certificado",
  robots: { index: false, follow: false },
};

// hero white · details green · footer white
const n = (i: number) => ({ "--i": i }) as React.CSSProperties;
const longDate = (d: Date, timeZone: string) => new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone }).format(d);

export default async function VerifyCodePage({ params }: { params: Promise<{ code: string }> }) {
  const raw = (await params).code;
  const code = normalizeCode(decodeURIComponent(raw));
  if (!code) notFound();
  if (raw !== code) redirect(`/verify/${code}`); // lower case or without dashes: show the canonical address
  const cert = await getCertificateByCode(code);
  if (!cert) notFound();

  const revoked = !!cert.revokedAt;
  const hours = `${cert.hours} ${cert.hours === 1 ? "hora" : "horas"}`;
  const verb = cert.kind === "COMPLETION" ? "Concluiu" : "Participou de";

  return (
    <>
      <a className="skip" href="#content">
        Pular para o conteúdo
      </a>
      <Header />
      <RevealObserver />
      <main id="content">
        <section className="page-hero" data-reveal>
          <div className="wrap">
            <p className={`kicker rise verify-status${revoked ? " is-revoked" : ""}`}>{revoked ? "Certificado revogado" : "Certificado válido"}</p>
            {revoked ? (
              <>
                <h1>
                  <Words text="Este certificado foi revogado." />
                </h1>
                <p className="lede rise" style={n(6)}>
                  Ele deixou de valer em {longDate(cert.revokedAt!, "America/Sao_Paulo")}. Se você acha que houve um engano, escreva para {contactEmail}.
                </p>
              </>
            ) : (
              <>
                <h1>
                  <Words text={cert.recipientName} />
                </h1>
                <p className="lede rise" style={n(6)}>
                  {verb} <b>{cert.title}</b>, com carga horária de {hours}, em {longDate(cert.completedOn, "UTC")}.
                </p>
              </>
            )}
          </div>
        </section>

        <section className="section green wipe-l">
          <div className="wrap verify-grid" data-reveal>
            <div className="section-head">
              <p className="kicker rise">Dados do certificado</p>
              <h2>
                <Words text={revoked ? "Código conferido." : "Autêntico e emitido pela Liga."} />
              </h2>
              <p className="section-sub rise" style={n(5)}>
                {revoked
                  ? "Este código existe, mas o certificado foi invalidado pela Liga."
                  : "Este código existe nos registros da Liga da Juventude Livre. O documento comprova a participação na atividade indicada; o aproveitamento como atividade complementar depende das regras de cada instituição de ensino."}
              </p>
              {!revoked && (
                <div className="head-ctas rise" style={n(6)}>
                  <a className="btn btn-yellow" href={`/verify/${cert.code}/pdf`} target="_blank" rel="noopener">
                    Baixar PDF <span aria-hidden="true">↓</span>
                  </a>
                  <Link className="btn btn-line-light" href="/verify">
                    Verificar outro
                  </Link>
                </div>
              )}
            </div>
            <dl className="verify-facts rise" style={n(3)}>
              {!revoked && (
                <>
                  <div>
                    <dt>Nome</dt>
                    <dd>{cert.recipientName}</dd>
                  </div>
                  <div>
                    <dt>Atividade</dt>
                    <dd>{cert.title}</dd>
                  </div>
                  <div>
                    <dt>Carga horária</dt>
                    <dd>{hours}</dd>
                  </div>
                  <div>
                    <dt>{cert.kind === "COMPLETION" ? "Concluído em" : "Participação em"}</dt>
                    <dd>{longDate(cert.completedOn, "UTC")}</dd>
                  </div>
                </>
              )}
              <div>
                <dt>Emitido em</dt>
                <dd>{longDate(cert.issuedAt, "America/Sao_Paulo")}</dd>
              </div>
              <div>
                <dt>Código</dt>
                <dd className="verify-code">{cert.code}</dd>
              </div>
              {revoked && (
                <div>
                  <dt>Situação</dt>
                  <dd>Revogado</dd>
                </div>
              )}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
