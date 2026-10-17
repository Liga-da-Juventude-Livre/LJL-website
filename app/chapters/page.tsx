import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver, Words } from "@/components/Reveal";
import { agenda, kitSteps } from "@/content/chapter-kit";
import { contactEmail, firstChapter } from "@/content/site";
import { getPublicChapterInfo } from "@/modules/chapter-requests/queries";
import { InterestForm } from "@/modules/chapter-requests/ui/interest-form";

export const metadata: Metadata = {
  title: "Diretórios · Liga da Juventude Livre",
  description: "Abra um diretório da Liga da Juventude Livre na sua universidade: passo a passo, roteiro do primeiro encontro e formulário de interesse.",
};

// Reads who is already in and who has asked, so it renders per request (and still works without a database).
export const dynamic = "force-dynamic";

// hero white · steps green · first meeting white · where we are + form green · footer white
const n = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default async function ChaptersPage() {
  let info: Awaited<ReturnType<typeof getPublicChapterInfo>> = {
    chapters: [{ id: "first", name: `Diretório ${firstChapter.university}`, university: firstChapter.university, city: firstChapter.city, state: null }],
    interest: [],
  };
  try {
    info = await getPublicChapterInfo();
  } catch {
    // Database not reachable: show the page with the first chapter only, rather than failing the whole page.
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
            <p className="kicker rise">Diretórios</p>
            <h1>
              <Words text="Abra um diretório na sua universidade." />
            </h1>
            <p className="lede rise" style={n(5)}>
              Um diretório é um grupo de estudantes que se encontra para estudar, debater e escrever sobre liberdade. Aqui está o caminho para
              começar o seu.
            </p>
            <div className="hero-ctas rise" style={n(6)}>
              <a className="btn btn-green" href="#interest">
                Quero abrir o meu <span aria-hidden="true">→</span>
              </a>
              <a className="btn btn-line" href="#steps">
                Ver o passo a passo
              </a>
            </div>
          </div>
        </section>

        <section className="section green wipe-l" id="steps">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <p className="kicker rise">Passo a passo</p>
              <h2>
                <Words text="Cinco passos para começar." />
              </h2>
            </div>
            <ol className="kit-steps" data-reveal>
              {kitSteps.map((s, i) => (
                <li key={s.title} className="rise" style={n(i)}>
                  <span className="kit-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" id="first-meeting">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <p className="kicker rise">Primeiro encontro</p>
              <h2>
                <Words text="Um roteiro de 90 minutos." />
              </h2>
              <p className="section-sub rise" style={n(4)}>
                É uma sugestão. Ajuste ao seu grupo.
              </p>
            </div>
            <ol className="agenda" data-reveal>
              {agenda.map((a, i) => (
                <li key={a.title} className="rise" style={n(i)}>
                  <p className="agenda-time">{a.time}</p>
                  <div>
                    <h3>{a.title}</h3>
                    <p>{a.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section green wipe-l" id="interest">
          <div className="wrap interest-grid" data-reveal>
            <div className="section-head">
              <p className="kicker rise">Onde estamos</p>
              <h2>
                <Words text="Quem já está e quem quer chegar." />
              </h2>
              <div className="where rise" style={n(5)}>
                <h3>Diretórios ativos</h3>
                <ul>
                  {info.chapters.map((c) => (
                    <li key={c.id}>
                      <b>{c.university}</b>
                      <span>
                        {c.city}
                        {c.state ? `, ${c.state}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
                <h3>Interesse confirmado</h3>
                {info.interest.length > 0 ? (
                  <ul>
                    {info.interest.map((u) => (
                      <li key={u.name}>
                        <b>{u.name}</b>
                        <span>{u.count === 1 ? "1 estudante" : `${u.count} estudantes`}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="where-empty">Ainda não há pedidos confirmados. A sua universidade pode ser a primeira.</p>
                )}
                <p className="where-note">Só entram na lista os pedidos que a equipe já respondeu.</p>
              </div>
            </div>
            <div className="interest-card rise" style={n(3)}>
              <h2 className="interest-title">Quero abrir um diretório</h2>
              <InterestForm contactEmail={contactEmail} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
