"use client";

import { useEffect, useRef, useState } from "react";
import { vision, visionKeywords } from "@/content/site";

const words = vision.split(" ");
const keys = new Set(visionKeywords);

// Words light up as the statement scrolls from the bottom of the screen to its middle; scrolling back dims them.
export function Vision() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [lit, setLit] = useState(words.length);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const start = innerHeight * 0.92;
      const end = innerHeight * 0.45 - r.height / 2;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
      setLit(Math.round(p * words.length));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => {
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p ref={ref} className="vision-text">
      {words.map((w, i) => {
        const key = keys.has(w.toLowerCase().replace(/[.,]/g, ""));
        return (
          <span key={i} className={`${i < lit ? "on" : ""}${key ? " key" : ""}`}>
            {w}{" "}
          </span>
        );
      })}
    </p>
  );
}
