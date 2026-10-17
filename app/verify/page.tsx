import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver, Words } from "@/components/Reveal";
import { VerifyForm } from "@/components/VerifyForm";
import { contactEmail } from "@/content/site";
import { normalizeCode } from "@/modules/certificates/codes";

export const metadata: Metadata = {
  title: "Verificar certificado",
  description: "Confira se um certificado da Liga da Juventude Livre é verdadeiro.",
  robots: { index: false, follow: false },
};

// hero white · how it works green · footer white
const n = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  let wrong = false;
  if (code) {
    const normalized = normalizeCode(code);
    if (normalized) redirect(`/verify/${normalized}`);
    wrong = true;
  }

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
            <p className="kicker rise">Verificar certificado</p>
            <h1>
              <Words text="Confira se um certificado é verdadeiro." />
            </h1>
            <p className="lede rise" style={n(6)}>
              Digite o código que está no certificado, ou aponte a câmera do celular para o QR code impresso nele.
            </p>
            <div className="rise" style={n(7)}>
              <VerifyForm defaultValue={wrong ? code : ""} error={wrong} />
            </div>
          </div>
        </section>
        <section className="section green wipe-l">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <p className="kicker rise">Como funciona</p>
              <h2>
                <Words text="Só quem tem o código vê o certificado." />
              </h2>
              <p className="section-sub rise" style={n(5)}>
                Cada certificado tem um código único e impossível de adivinhar. A página de verificação mostra o nome, a atividade, a carga horária e as datas,
                e nada além disso. Dúvidas? Escreva para {contactEmail}.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
