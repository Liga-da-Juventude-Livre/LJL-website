"use client";

import { useState } from "react";
import { fronts } from "@/content/site";

// The six fronts as a large index. The active one fills in and opens its description and debate question
// underneath; hover, focus or a click picks it. No artwork and no auto-advance.
export function Fronts() {
  const [active, setActive] = useState(0);

  return (
    <ol className="fx-list" data-reveal>
      {fronts.map((f, i) => {
        const on = i === active;
        return (
          <li key={f.title} className={`rise${on ? " on" : ""}`} style={{ "--i": i } as React.CSSProperties}>
            <button
              type="button"
              className="fx-item"
              aria-expanded={on}
              aria-controls={`front-${i}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className="fx-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="fx-t">{f.title}</span>
            </button>
            <div className="fx-det" id={`front-${i}`}>
              <div>
                <div className="fx-det-in">
                  <p className="fx-text">{f.text}</p>
                  <div className="fx-q">
                    <p className="fx-q-label">Para o debate</p>
                    <p className="fx-q-text">{f.question}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
