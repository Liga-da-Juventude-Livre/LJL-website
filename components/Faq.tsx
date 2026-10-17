"use client";

import { useState } from "react";
import { faq } from "@/content/site";

// One answer open at a time; it opens by animating its row height, with a yellow rule marking the open question.
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ol className="faq-list" data-reveal>
      {faq.map((f, i) => {
        const on = open === i;
        return (
          <li key={f.q} className={`faq-item rise${on ? " on" : ""}`} style={{ "--i": i } as React.CSSProperties}>
            <h3>
              <button
                type="button"
                className="faq-q"
                aria-expanded={on}
                aria-controls={`answer-${i}`}
                id={`question-${i}`}
                onClick={() => setOpen(on ? null : i)}
              >
                <span className="faq-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="faq-text">{f.q}</span>
                <span className="faq-icon" aria-hidden="true" />
              </button>
            </h3>
            <div className="faq-a" id={`answer-${i}`} role="region" aria-labelledby={`question-${i}`}>
              <div>
                <p>{f.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
