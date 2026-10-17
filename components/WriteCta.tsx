import Link from "next/link";
import { contactEmail } from "@/content/site";
import { Words } from "./Reveal";

const n = (i: number) => ({ "--i": i }) as React.CSSProperties;

// Green closing band on the articles pages: how to send a piece.
export function WriteCta({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <section className="section green wipe-l write-cta">
      <div className="wrap write-cta-in" data-reveal>
        <div>
          <p className="kicker rise">{kicker}</p>
          <h2>
            <Words text={title} />
          </h2>
          <p className="section-sub rise" style={n(4)}>
            {text}
          </p>
        </div>
        <div className="head-ctas rise" style={n(5)}>
          <a className="btn btn-yellow" href={`mailto:${contactEmail}?subject=${encodeURIComponent("Proposta de artigo")}`}>
            Enviar uma proposta <span aria-hidden="true">→</span>
          </a>
          <Link className="btn btn-line-light" href="/library">
            Ver a biblioteca
          </Link>
        </div>
      </div>
    </section>
  );
}
