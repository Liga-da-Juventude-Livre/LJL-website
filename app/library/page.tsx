import type { Metadata } from "next";
import { BookCover } from "@/components/BookCover";
import { CoverFan } from "@/components/CoverFan";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Library } from "@/components/Library";
import { RevealObserver, Words } from "@/components/Reveal";
import { getPublicBooks } from "@/modules/books/public";

export const metadata: Metadata = {
  title: "Biblioteca · Liga da Juventude Livre",
  description: "Livros recomendados pela Liga da Juventude Livre para entender a liberdade, e edições gratuitas para baixar.",
};

// Reads the library from the database on each request, so what the team edits in the dashboard shows up right away.
export const dynamic = "force-dynamic";

// hero white · start green · all white · downloads green · footer white
const n = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default async function LibraryPage() {
  const books = await getPublicBooks();
  const start = books.filter((b) => b.featured);
  const downloads = books.filter((b) => b.downloads.length > 0);

  return (
    <>
      <a className="skip" href="#content">
        Pular para o conteúdo
      </a>
      <Header />
      <RevealObserver />

      <main id="content">
        <section className="page-hero" data-reveal>
          <div className="wrap page-hero-grid">
            <div>
            <p className="kicker rise">Biblioteca</p>
            <h1>
              <Words text="Livros para entender a liberdade." />
            </h1>
            <p className="lede rise" style={n(4)}>
              As leituras que recomendamos para estudar economia, instituições, direito e filosofia, do primeiro livro ao
              tratado completo. Alguns têm edição gratuita e autorizada para baixar.
            </p>
            <div className="hero-ctas rise" style={n(5)}>
              <a className="btn btn-green" href="#recommendations">
                Ver as {books.length} recomendações
              </a>
              <a className="btn btn-line" href="#downloads">
                {downloads.length} livros para baixar
              </a>
            </div>
            </div>
            <CoverFan books={books} />
          </div>
        </section>

        <section className="section green wipe-l" aria-label="Por onde começar">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <p className="kicker rise">Por onde começar</p>
              <h2>
                <Words text="Leituras curtas para o primeiro mês." />
              </h2>
            </div>
            <ol className="start" data-reveal>
              {start.map((b, i) => (
                <li key={b.slug} className="start-item rise" style={n(i)}>
                  <BookCover book={b} size="lg" />
                  <div>
                    <p className="start-n">{String(i + 1).padStart(2, "0")}</p>
                    <h3>{b.title}</h3>
                    <p className="start-author">
                      {b.author}, {b.year}
                    </p>
                    <p className="start-note">{b.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" id="recommendations">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <p className="kicker rise">Recomendações</p>
              <h2>
                <Words text="Todas as leituras, por frente." />
              </h2>
            </div>
            <Library books={books} />
          </div>
        </section>

        <section className="section green wipe-l" id="downloads">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <p className="kicker rise">Para baixar</p>
              <h2>
                <Words text="Edições gratuitas e autorizadas." />
              </h2>
              <p className="section-sub rise" style={n(4)}>
                Os links levam ao site de quem publica cada edição, que a oferece de graça. Nenhum arquivo pirata.
              </p>
            </div>
            <ul className="dl-list" data-reveal>
              {downloads.map((b, i) => (
                <li key={b.slug} className="dl-item rise" style={n(i)}>
                  <BookCover book={b} size="sm" />
                  <div className="dl-body">
                    <h3>{b.title}</h3>
                    <p className="dl-author">
                      {b.author}, {b.year}
                    </p>
                    <p className="dl-src">
                      {b.downloads[0].language} · {b.downloads[0].source}
                      {b.downloads[0].edition !== b.title && <> · edição: {b.downloads[0].edition}</>}
                    </p>
                  </div>
                  <a className="btn btn-yellow dl-btn" href={b.downloads[0].url} target="_blank" rel="noopener noreferrer">
                    Baixar <span aria-hidden="true">↗</span>
                    <span className="sr-only"> {b.title} (abre em nova aba)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
