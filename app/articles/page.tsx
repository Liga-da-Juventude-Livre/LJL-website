import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver, Words } from "@/components/Reveal";
import { WriteCta } from "@/components/WriteCta";
import { formatDate } from "@/lib/dates";
import { listPublishedArticles } from "@/modules/posts/public";

export const metadata: Metadata = {
  title: "Artigos · Liga da Juventude Livre",
  description: "Artigos escritos por estudantes da Liga da Juventude Livre sobre economia, instituições, educação, direito e filosofia.",
};

// Published articles come from the database on each request.
export const dynamic = "force-dynamic";

// list white · write band green · footer white
const n = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default async function ArticlesPage() {
  const articles = await listPublishedArticles();

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
            <p className="kicker rise">Artigos</p>
            <h1>
              <Words text="Ideias para uma geração livre." />
            </h1>
            <p className="lede rise" style={n(4)}>
              Textos escritos por estudantes sobre economia, instituições, educação, direito, filosofia e
              empreendedorismo.
            </p>
          </div>
        </section>

        {articles.length > 0 && (
          <section className="section articles-sec">
            <div className="wrap">
              <ol className="art-list" data-reveal>
                {articles.map((a, i) => (
                  <li key={a.slug} className="rise" style={n(i)}>
                    <Link className="art-row" href={`/articles/${a.slug}`}>
                      <p className="art-meta">
                        <time dateTime={a.date}>{formatDate(a.date)}</time>
                        {a.front && <span>{a.front}</span>}
                      </p>
                      <div>
                        <h2>{a.title}</h2>
                        {a.excerpt && <p className="art-ex">{a.excerpt}</p>}
                        <p className="art-by">
                          {a.author} · {a.minutes} min de leitura
                        </p>
                      </div>
                      <span className="art-arrow" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {articles.length === 0 ? (
          <WriteCta
            kicker="Em breve"
            title="Os primeiros artigos estão sendo escritos."
            text="Quer estar entre os primeiros a publicar? Mande sua proposta com um resumo de poucas linhas. Enquanto isso, a biblioteca tem leituras para começar."
          />
        ) : (
          <WriteCta
            kicker="Escreva com a gente"
            title="Tem uma ideia de artigo?"
            text="Mande sua proposta com um resumo de poucas linhas."
          />
        )}
      </main>

      <Footer />
    </>
  );
}
