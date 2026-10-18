import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver, Words } from "@/components/Reveal";
import { contactEmail } from "@/content/site";
import { INTERESTS, SKILLS } from "@/content/talent";
import { listChapterChoices } from "@/modules/applications/queries";
import { JoinForm } from "@/modules/applications/ui/join-form";

export const metadata: Metadata = {
  title: "Entre na Liga",
  description: "Candidate-se para ajudar a Liga da Juventude Livre: conte o que você sabe fazer e o que quer fazer, e a coordenação do diretório conversa com você.",
};

// Reads the list of chapters, so it renders per request (and still works without a database).
export const dynamic = "force-dynamic";

// hero white · steps and form green · footer white
const n = (i: number) => ({ "--i": i }) as React.CSSProperties;

const steps = [
  { title: "Você se candidata", text: "Conta o que sabe fazer, o que quer fazer e quanto tempo tem. Leva uns cinco minutos." },
  { title: "A coordenação conversa", text: "Alguém do diretório responde pelo e-mail que você informou." },
  { title: "Você entra no banco de talentos", text: "Quando surge uma vaga ou uma tarefa, a coordenação chama quem tem as competências certas. Enquanto espera, faça a trilha de leitura em Cursos." },
  { title: "Você contribui e cresce", text: "Uma primeira tarefa pequena, depois mais responsabilidade, com certificado de participação. Quem quer, chega a membro do diretório; quem sai continua como alumni." },
];

// Links can pre-tick options, e.g. /join?skills=writing&interests=content from "Escreva com a gente". Unknown values are ignored.
const only = (raw: string | string[] | undefined, allowed: readonly { value: string }[]) =>
  (Array.isArray(raw) ? raw.join(",") : (raw ?? "")).split(",").filter((v) => allowed.some((a) => a.value === v));

export default async function JoinPage({ searchParams }: { searchParams: Promise<{ skills?: string | string[]; interests?: string | string[] }> }) {
  const q = await searchParams;
  const preset = { skills: only(q.skills, SKILLS), interests: only(q.interests, INTERESTS) };
  let chapters: { id: string; name: string }[] = [];
  try {
    chapters = await listChapterChoices();
  } catch {
    // Database not reachable: the form still works for "no chapter near me" (the action will report its own error).
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
            <p className="kicker rise">Entre na Liga</p>
            <h1>
              <Words text="Venha ajudar a construir a Liga." />
            </h1>
            <p className="lede rise" style={n(5)}>
              Escrever, desenhar, editar vídeo, organizar encontros, estudar junto. A Liga cresce com quem se candidata, e as vagas de cada
              diretório são preenchidas a partir deste banco de talentos.
            </p>
            <div className="hero-ctas rise" style={n(6)}>
              <a className="btn btn-green" href="#candidatura">
                Quero me candidatar <span aria-hidden="true">→</span>
              </a>
              <Link className="btn btn-line" href="/chapters">
                Abrir um diretório
              </Link>
            </div>
          </div>
        </section>

        <section className="section green wipe-l" id="candidatura">
          <div className="wrap interest-grid" data-reveal>
            <div className="section-head">
              <p className="kicker rise">Como funciona</p>
              <h2>
                <Words text="Da candidatura à contribuição." />
              </h2>
              <ol className="join-steps rise" style={n(4)}>
                {steps.map((s, i) => (
                  <li key={s.title}>
                    <span className="kit-n">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="interest-card rise" style={n(3)}>
              <h2 className="interest-title">Candidatura</h2>
              <JoinForm chapters={chapters} contactEmail={contactEmail} preset={preset} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
