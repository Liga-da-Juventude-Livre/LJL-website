import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { VerifyForm } from "@/components/VerifyForm";
import { contactEmail } from "@/content/site";

export const metadata = { title: "Código não encontrado · Liga da Juventude Livre", robots: { index: false, follow: false } };

export default function VerifyNotFound() {
  return (
    <>
      <Header />
      <main id="content">
        <section className="page-hero">
          <div className="wrap">
            <p className="kicker">Verificar certificado</p>
            <h1>Não encontramos esse código.</h1>
            <p className="lede">
              Confira se digitou o código como está no certificado: LJL seguido de 12 letras e números. Se o problema continuar, escreva para {contactEmail}.
            </p>
          </div>
        </section>
        <section className="section green">
          <div className="wrap">
            <p className="kicker verify-kicker-light">Tentar de novo</p>
            <VerifyForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
