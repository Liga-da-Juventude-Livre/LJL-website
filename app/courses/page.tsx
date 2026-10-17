import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver, Words } from "@/components/Reveal";
import { levelLabel } from "@/modules/books/labels";
import { KINDS } from "@/modules/courses/labels";
import { listPublishedCourses } from "@/modules/courses/queries";

export const metadata: Metadata = {
  title: "Cursos e trilhas · Liga da Juventude Livre",
  description: "Trilhas de leitura e cursos da Liga da Juventude Livre, para estudar no seu ritmo ou em grupo, sem precisar de cadastro.",
};

// Reads the database on each request; if it is unreachable the page shows its empty state instead of failing.
export const dynamic = "force-dynamic";

// hero white · list green · footer white
const n = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default async function CoursesPage() {
  let courses: Awaited<ReturnType<typeof listPublishedCourses>> = [];
  try {
    courses = await listPublishedCourses();
  } catch {
    // no database: fall through to the empty state
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
            <p className="kicker rise">Cursos e trilhas</p>
            <h1>
              <Words text="Estude liberdade no seu ritmo." />
            </h1>
            <p className="lede rise" style={n(5)}>
              Trilhas de leitura guiadas e cursos curtos, com perguntas para debater e uma tarefa por semana. Não precisa de cadastro: o seu
              progresso fica salvo no seu navegador. Dá para fazer sozinho ou em grupo.
            </p>
            <div className="hero-ctas rise" style={n(6)}>
              <Link className="btn btn-line" href="/chapters">
                Fazer em grupo, no seu diretório
              </Link>
            </div>
          </div>
        </section>

        <section className="section green wipe-l">
          <div className="wrap">
            {courses.length === 0 ? (
              <div className="section-head" data-reveal>
                <p className="kicker rise">Em breve</p>
                <h2>
                  <Words text="As primeiras trilhas estão sendo preparadas." />
                </h2>
                <p className="section-sub rise" style={n(5)}>
                  Enquanto isso, a biblioteca tem as leituras para começar, e dá para baixar vários livros de graça.
                </p>
                <div className="head-ctas rise" style={n(6)}>
                  <Link className="btn btn-yellow" href="/library">
                    Ver a biblioteca <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ) : (
              KINDS.map((kind) => {
                const group = courses.filter((c) => c.kind === kind.value);
                if (group.length === 0) return null;
                return (
                  <div key={kind.value} className="course-group" data-reveal>
                    <div className="section-head">
                      <p className="kicker rise">{kind.plural}</p>
                    </div>
                    <ul className="course-grid">
                      {group.map((c, i) => (
                        <li key={c.id} className="rise" style={n(i)}>
                          <Link href={`/courses/${c.slug}`} className="course-card">
                            <p className="course-card-meta">
                              {levelLabel(c.level)}
                              {c.front ? ` · ${c.front.name}` : ""}
                            </p>
                            <h2>{c.title}</h2>
                            <p className="course-card-summary">{c.summary}</p>
                            <p className="course-card-foot">
                              <span>
                                {c._count.lessons} {c._count.lessons === 1 ? "aula" : "aulas"}
                                {c.durationWeeks ? ` · ${c.durationWeeks} ${c.durationWeeks === 1 ? "semana" : "semanas"}` : ""}
                              </span>
                              <span aria-hidden="true">→</span>
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
