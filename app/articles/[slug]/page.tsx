import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver } from "@/components/Reveal";
import { WriteCta } from "@/components/WriteCta";
import { formatDate } from "@/lib/dates";
import { getPublishedArticle } from "@/modules/posts/public";

type Props = { params: Promise<{ slug: string }> };

// Magazine face for the reading page, the same one the Liga's panel and Instagram posts use.
const display = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter((_, i, all) => i === 0 || i === all.length - 1)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getPublishedArticle((await params).slug).catch(() => null);
  return a
    ? { title: a.title, description: a.excerpt || undefined, openGraph: a.coverUrl ? { images: [a.coverUrl] } : undefined }
    : {};
}

// article white · write band green · footer white
export default async function ArticlePage({ params }: Props) {
  const a = await getPublishedArticle((await params).slug);
  if (!a) notFound();

  return (
    <>
      <a className="skip" href="#content">
        Pular para o conteúdo
      </a>
      <Header />
      <RevealObserver />

      <main id="content">
        <article className={`article article-mag ${display.variable}`} data-reveal>
          <div className="article-col">
            <Link className="article-back rise" href="/articles">
              ← Todos os artigos
            </Link>
            {a.front && <p className="kicker rise">{a.front}</p>}
            <h1 className="rise">{a.title}</h1>
            {a.excerpt && <p className="article-dek rise">{a.excerpt}</p>}
            <div className="article-byline rise">
              {a.authorPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element -- photo served by the Liga's panel
                <img className="byline-photo" src={a.authorPhoto} alt="" width={56} height={56} />
              ) : (
                <span className="byline-photo byline-initials" aria-hidden="true">
                  {initials(a.author)}
                </span>
              )}
              <div>
                <b>{a.author}</b>
                {a.authorRole && <span>{a.authorRole}</span>}
                <small>
                  <time dateTime={a.date}>{formatDate(a.date)}</time> · {a.minutes} min de leitura
                </small>
              </div>
            </div>
            {a.coverUrl && (
              <div className="article-cover rise">
                <Image src={a.coverUrl} alt="" fill sizes="(max-width: 720px) 100vw, 680px" priority />
              </div>
            )}
            <div className="prose rise" dangerouslySetInnerHTML={{ __html: a.html }} />
          </div>
        </article>

        <WriteCta kicker="Escreva com a gente" title="Tem uma ideia de artigo?" text="Mande sua proposta com um resumo de poucas linhas." />
      </main>

      <Footer />
    </>
  );
}
