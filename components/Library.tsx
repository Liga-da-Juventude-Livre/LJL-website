"use client";

import { useState } from "react";
import { levelLabel } from "@/modules/books/labels";
import type { PublicBook } from "@/modules/books/public";
import { BookCover } from "./BookCover";

const FRONT_ORDER = ["Economia", "Instituições", "Educação", "Direito", "Filosofia", "Empreendedorismo"];
const LEVEL_RANK = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3 } as const;

// Every recommendation, filterable by front. Books with a free, checked edition link straight to it.
export function Library({ books }: { books: PublicBook[] }) {
  const [front, setFront] = useState<string | null>(null);
  const shown = front ? books.filter((b) => b.front === front) : books;
  const count = (f: string) => books.filter((b) => b.front === f).length;
  // Known fronts first, in the usual order; any other front a book may use after it.
  const fronts = [...new Set(books.map((b) => b.front))].sort((a, b) => (FRONT_ORDER.indexOf(a) + 99 * +!FRONT_ORDER.includes(a)) - (FRONT_ORDER.indexOf(b) + 99 * +!FRONT_ORDER.includes(b)));

  return (
    <>
      <div className="lib-filters" role="group" aria-label="Filtrar por frente">
        <button type="button" aria-pressed={front === null} onClick={() => setFront(null)}>
          Todas <span>{books.length}</span>
        </button>
        {fronts.map((f) => (
          <button key={f} type="button" aria-pressed={front === f} onClick={() => setFront(f)}>
            {f} <span>{count(f)}</span>
          </button>
        ))}
      </div>
      <ul className="lib-grid" key={front ?? "all"}>
        {shown.map((b, i) => {
          const free = b.downloads[0];
          return (
            <li key={b.slug} id={`book-${b.slug}`} className="book" style={{ "--i": i } as React.CSSProperties}>
              <BookCover book={b} />
              <div className="book-body">
                <p className="book-meta">
                  <span>{b.front}</span>
                  <span className={`book-level lvl-${LEVEL_RANK[b.level]}`}>{levelLabel(b.level)}</span>
                </p>
                <h3>{b.title}</h3>
                <p className="book-author">
                  {b.author}, {b.year}
                </p>
                <p className="book-note">{b.note}</p>
                {free && (
                  <a className="book-dl" href={free.url} target="_blank" rel="noopener noreferrer">
                    Baixar grátis <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (abre em nova aba, {free.source})</span>
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
