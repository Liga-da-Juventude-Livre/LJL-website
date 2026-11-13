import Link from "next/link";
import { formatDate } from "@/lib/dates";
import { display } from "@/lib/fonts";
import type { PublicArticle } from "@/modules/posts/public";

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter((_, i, all) => i === 0 || i === all.length - 1)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

/** Home section with the newest article in front and the next ones beside it. Renders nothing without articles. */
export function HomeArticles({ articles }: { articles: PublicArticle[] }) {
  if (articles.length === 0) return null;
  const [main, ...rest] = articles;
  return (
    <section className={`section green wipe-l home-articles ${display.variable}`} id="articles">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <p className="kicker rise">Artigos</p>
          <h2 className="rise">O que a Liga está escrevendo.</h2>
          <p className="section-sub rise">Artigos de opinião dos nossos membros sobre universidade, política e liberdade.</p>
        </div>
        <div className="ha-grid" data-reveal>
          <Link className="ha-main rise" href={`/articles/${main.slug}`}>
            {main.front && <span className="ha-kicker">{main.front}</span>}
            <h3>{main.title}</h3>
            {main.excerpt && <p className="ha-dek">{main.excerpt}</p>}
            <span className="ha-author">
              {main.authorPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element -- photo served by the Liga's panel
                <img src={main.authorPhoto} alt="" width={48} height={48} />
              ) : (
                <i aria-hidden="true">{initials(main.author)}</i>
              )}
              <span>
                <b>{main.author}</b>
                <small>{main.authorRole || `${formatDate(main.date)} · ${main.minutes} min de leitura`}</small>
              </span>
            </span>
            <span className="ha-cta">
              Ler artigo <span aria-hidden="true">→</span>
            </span>
          </Link>
          {rest.length > 0 && (
            <ul className="ha-list">
              {rest.slice(0, 3).map((a, i) => (
                <li key={a.slug} className="rise" style={{ "--i": i + 1 } as React.CSSProperties}>
                  <Link href={`/articles/${a.slug}`}>
                    {a.front && <span className="ha-kicker">{a.front}</span>}
                    <b>{a.title}</b>
                    <small>
                      {a.author} · {formatDate(a.date)}
                    </small>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="head-ctas ha-ctas rise">
          <Link className="btn btn-yellow" href="/articles">
            Ver todos os artigos <span aria-hidden="true">→</span>
          </Link>
          <Link className="btn btn-line-light" href="/join?skills=writing&interests=content#candidatura">
            Quero escrever para a Liga
          </Link>
        </div>
      </div>
    </section>
  );
}
