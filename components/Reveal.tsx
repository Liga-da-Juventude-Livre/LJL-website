"use client";

import { useEffect } from "react";

// Adds `is-in` to every [data-reveal] group and every .wipe-l/.wipe-r section once it scrolls into view.
// The animations themselves live in globals.css under "entrance"; without JS or with reduced motion nothing is hidden.
export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal], .wipe-l, .wipe-r");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

// Splits a title into words that rise out of their own line box, one after another.
export function Words({ text, from = 0, hl = false }: { text: string; from?: number; hl?: boolean }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="w">
            <span className={hl ? "hl" : undefined} style={{ "--i": from + i } as React.CSSProperties}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}
