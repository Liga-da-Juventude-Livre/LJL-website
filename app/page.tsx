import Link from "next/link";
import { CopyEmail } from "@/components/CopyEmail";
import { DebateDeck } from "@/components/DebateDeck";
import { Faq } from "@/components/Faq";
import { Fronts } from "@/components/Fronts";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSnake } from "@/components/HeroSnake";
import { RevealObserver, Words } from "@/components/Reveal";
import { Timeline } from "@/components/Timeline";
import { Vision } from "@/components/Vision";
import { contactEmail, firstChapter, ways } from "@/content/site";

// White and green alternate, so two neighbours never share a colour:
// hero white · band green · vision white · fronts green · participe white · faq green · gallery white · debate green · timeline white ·
// join green · footer white. Green sections paint in from the left like the logo's L.

const MOTTO = ["Liberdade", "Propriedade", "Responsabilidade"];

const n = (i: number) => ({ "--i": i }) as React.CSSProperties;

function SectionHead({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="section-head" data-reveal>
      <p className="kicker rise">{kicker}</p>
      <h2>
        <Words text={title} />
      </h2>
      {children}
    </div>
  );
}

const mailto = (subject: string) => `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;

export default function Home() {
  const site = process.env.SITE_URL?.replace(/\/+$/, "");
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Liga da Juventude Livre",
    ...(site ? { url: site, logo: `${site}/icons/icon-512.png` } : {}),
    email: contactEmail,
    description: "Movimento estudantil apartidário pela liberdade econômica, pelo Estado de Direito e pela livre circulação de ideias.",
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
      <a className="skip" href="#content">
        Pular para o conteúdo
      </a>
      <Header />
      <RevealObserver />

      <main id="content">
        <section className="hero" id="top" data-reveal>
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow rise">
                <span className="dot" aria-hidden="true" />
                Movimento estudantil apartidário
              </p>
              <h1>
                <Words text="Construindo a geração da" from={1} />{" "}
                <em>
                  <Words text="liberdade econômica." from={5} hl />
                </em>
              </h1>
              <p className="lede rise" style={n(5)}>
                Estudo, debate e formação para estudantes que querem um Brasil mais livre, próspero e responsável.
              </p>
              <div className="hero-ctas rise" style={n(6)}>
                <a className="btn btn-green" href="#get-involved">
                  Participe <span aria-hidden="true">→</span>
                </a>
                <a className="btn btn-line" href="#vision">
                  Conheça a Liga
                </a>
              </div>
            </div>
            <HeroSnake />
          </div>
        </section>

        <section className="band wipe-l" aria-label="Onde estamos">
          <div className="wrap band-in" data-reveal>
            <div>
              <p className="kicker rise">Onde estamos</p>
              <p className="band-title">
                <Words text="Primeiro diretório:" />{" "}
                <b>
                  <Words text={firstChapter.university} from={2} />
                </b>
              </p>
              <p className="band-sub rise" style={n(3)}>
                A Liga está começando no {firstChapter.city}. O próximo diretório pode ser na sua universidade.
              </p>
            </div>
            <Link className="btn btn-yellow rise" style={n(4)} href="/chapters#interest">
              Abrir um diretório <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="section vision" id="vision">
          <div className="wrap vision-grid" data-reveal>
            <p className="kicker rise">Nossa visão</p>
            <Vision />
          </div>
        </section>

        <section className="section green wipe-l" id="fronts">
          <div className="wrap fx-grid">
            <SectionHead kicker="Frentes de atuação" title="Liberdade em cada área da vida pública.">
              <p className="section-sub rise" style={n(4)}>
                Os temas que estudamos, debatemos e sobre os quais queremos escrever.
              </p>
              <div className="head-ctas rise" style={n(5)}>
                <Link className="btn btn-yellow" href="/library">
                  Ver biblioteca de livros <span aria-hidden="true">→</span>
                </Link>
                <Link className="btn btn-line-light" href="/articles">
                  Ver artigos
                </Link>
              </div>
            </SectionHead>
            <Fronts />
          </div>
        </section>

        <section className="section" id="get-involved">
          <div className="wrap">
            <SectionHead kicker="Participe" title="Três jeitos de fazer parte desde o começo." />
            <ol className="ways" data-reveal>
              {ways.map((w, i) => (
                <li key={w.title} className={`way way-${i} rise`} style={n(i)}>
                  <span className="way-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                  {w.href ? (
                    <Link className="way-link" href={w.href}>
                      {w.cta} <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <a className="way-link" href={mailto(w.title)}>
                      {w.cta} <span aria-hidden="true">→</span>
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section green wipe-l" id="faq">
          <div className="wrap faq-grid">
            <SectionHead kicker="Perguntas" title="Perguntas frequentes.">
              <div className="faq-help rise" style={n(3)}>
                <p className="faq-help-title">Não achou a resposta?</p>
                <p>Mande sua dúvida. Quem responde é alguém da Liga, não um robô.</p>
                <a className="btn btn-yellow" href={mailto("Dúvida sobre a Liga")}>
                  Escrever para a Liga <span aria-hidden="true">→</span>
                </a>
                <a className="faq-help-mail" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </div>
            </SectionHead>
            <Faq />
          </div>
        </section>

        <section className="section" id="gallery">
          <div className="wrap">
            <SectionHead kicker="Em campo" title="Estudantes que já se reuniram pela liberdade." />
            <Gallery />
          </div>
        </section>

        <section className="section green wipe-l" id="debate">
          <div className="wrap">
            <SectionHead kicker="Para o debate" title="Qual pergunta você levaria para a mesa?">
              <p className="section-sub rise" style={n(4)}>
                Cada frente de atuação tem uma pergunta que a Liga leva para a roda. Sorteie uma e comece a conversa.
              </p>
            </SectionHead>
            <DebateDeck />
          </div>
        </section>

        <Timeline />

        <section className="join wipe-l" id="join">
          <div className="wrap join-in" data-reveal>
            <div>
              <p className="kicker rise">Junte-se</p>
              <h2>
                <Words text="Faça parte da Liga desde o começo." />
              </h2>
              <p className="join-sub rise" style={n(4)}>
                Quer participar, abrir um diretório ou escrever? Mande uma mensagem e respondemos pessoalmente.
              </p>
            </div>
            <div className="join-card rise" style={n(5)}>
              <p className="join-card-label">Escreva para</p>
              <CopyEmail email={contactEmail} />
              <a className="btn btn-yellow" href={mailto("Quero fazer parte da Liga")}>
                Escrever para a Liga <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {[0, 1].map((k) => (
                <span key={k}>
                  {MOTTO.map((w) => (
                    <span key={w} className="marquee-word">
                      {w}
                      <i />
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
