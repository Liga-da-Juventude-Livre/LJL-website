"use client";

import { useEffect, useRef, useState } from "react";
import { timeline } from "@/content/site";
import { Words } from "./Reveal";

// Wide screens: the section pins under the header and vertical scroll drives the milestones sideways, a green
// line filling as it goes. Narrow screens: a vertical list whose line fills down. Either way a milestone's year
// fills in when it reaches the reading point, and the last one is the Liga itself.
export function Timeline() {
  const secRef = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const sec = secRef.current!;
    const view = viewRef.current!;
    const track = trackRef.current!;
    const wideQuery = matchMedia("(min-width: 900px)");
    let raf = 0;

    const update = () => {
      raf = 0;
      const items = Array.from(track.children) as HTMLElement[];
      if (wideQuery.matches) {
        const dist = Math.max(0, track.scrollWidth - view.clientWidth);
        const pin = innerHeight - 68;
        sec.style.height = `${pin + dist + innerHeight * 0.35}px`;
        const r = sec.getBoundingClientRect();
        const span = r.height - pin;
        const p = Math.min(1, Math.max(0, (68 - r.top) / span));
        track.style.transform = `translate3d(${-p * dist}px,0,0)`;
        const mark = view.clientWidth * 0.55;
        sec.style.setProperty("--fill", `${p * dist + mark}px`);
        let a = -1;
        items.forEach((el, i) => {
          if (el.offsetLeft - p * dist < mark) a = i;
        });
        setActive(r.top < innerHeight * 0.5 ? a : -1);
      } else {
        sec.style.height = "";
        track.style.transform = "";
        const tr = track.getBoundingClientRect();
        const mark = innerHeight * 0.62;
        sec.style.setProperty("--fill", `${Math.min(tr.height, Math.max(0, mark - tr.top))}px`);
        let a = -1;
        items.forEach((el, i) => {
          if (el.getBoundingClientRect().top < mark) a = i;
        });
        setActive(a);
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    wideQuery.addEventListener("change", on);
    document.fonts?.ready.then(on);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
      wideQuery.removeEventListener("change", on);
    };
  }, []);

  const last = timeline.length - 1;

  return (
    <section ref={secRef} className="timeline" id="history" aria-label="Linha do tempo da liberdade">
      <div className="timeline-pin">
        <div className="wrap timeline-head" data-reveal>
          <p className="kicker rise">Linha do tempo</p>
          <h2>
            <Words text="A liberdade tem história. O próximo capítulo é nosso." />
          </h2>
        </div>
        <div ref={viewRef} className="timeline-view">
          <ol ref={trackRef} className="timeline-track">
            {timeline.map((m, i) => (
              <li key={m.year} className={`tl-item${i <= active ? " on" : ""}${i === last ? " tl-last" : ""}`}>
                <span className="tl-year" aria-hidden="true">
                  {m.year}
                </span>
                <span className="tl-dot" aria-hidden="true" />
                <div className="tl-body">
                  <h3>
                    <span className="sr-only">{m.year}: </span>
                    {m.title}
                  </h3>
                  <p>{m.text}</p>
                  {i === last && (
                    <a className="tl-cta" href="#join">
                      Escreva com a gente <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
