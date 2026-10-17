import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="content">
        <section className="page-hero">
          <div className="wrap">
            <p className="kicker">Erro 404</p>
            <h1>Essa página não existe.</h1>
            <p className="lede">O endereço pode ter mudado ou ter sido digitado errado. Estes caminhos costumam ajudar.</p>
            <div className="hero-ctas">
              <Link className="btn btn-green" href="/">
                Ir para o início
              </Link>
              <Link className="btn btn-line" href="/library">
                Ver a biblioteca
              </Link>
            </div>
          </div>
        </section>
        <section className="section green">
          <div className="wrap">
            <p className="kicker">Procurando outra coisa?</p>
            <p className="head-ctas" style={{ marginTop: 16 }}>
              <Link className="btn btn-yellow" href="/courses">
                Cursos e trilhas
              </Link>
              <Link className="btn btn-line-light" href="/chapters">
                Abrir um diretório
              </Link>
              <Link className="btn btn-line-light" href="/articles">
                Artigos
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
