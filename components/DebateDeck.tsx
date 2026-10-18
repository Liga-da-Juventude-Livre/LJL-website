"use client";

import { useState } from "react";
import { fronts } from "@/content/site";

// A deck of the debate questions from the six fronts. The button draws a different one at random (never the
// same twice in a row); each draw re-mounts the top card so it deals in. The first card is fixed so the
// server and the browser render the same thing.
export function DebateDeck() {
  const [i, setI] = useState(0);
  const [draw, setDraw] = useState(0);
  const f = fronts[i];

  const next = () => {
    let j = i;
    while (j === i) j = Math.floor(Math.random() * fronts.length);
    setI(j);
    setDraw((d) => d + 1);
  };

  return (
    <div className="deck" data-reveal>
      <div className="deck-stack rise">
        <span className="deck-back deck-back-2" aria-hidden="true" />
        <span className="deck-back deck-back-1" aria-hidden="true" />
        <figure key={draw} className={`deck-card${draw ? " deal" : ""}`} aria-live="polite">
          <figcaption className="deck-tag">
            {String(i + 1).padStart(2, "0")} · {f.title}
          </figcaption>
          <blockquote className="deck-q">{f.question}</blockquote>
          <p className="deck-note">{f.text}</p>
        </figure>
      </div>
      <button type="button" className="btn btn-yellow rise" style={{ "--i": 2 } as React.CSSProperties} onClick={next}>
        Sortear outra pergunta <span aria-hidden="true">↻</span>
      </button>
    </div>
  );
}
