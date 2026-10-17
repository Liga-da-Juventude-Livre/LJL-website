"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { BookCover } from "./BookCover";

export type LessonView = {
  id: string;
  title: string;
  summary: string | null;
  minutes: number | null;
  /** Already sanitised on the server (lib/markdown.ts). */
  html: string | null;
  questions: string[];
  task: string | null;
  book: { slug: string; title: string; author: string; year: number; coverUrl: string | null; free: { url: string; language: string; source: string }[] } | null;
};

// Progress lives only in this browser (localStorage): there are no student accounts and nothing is sent anywhere.
// useSyncExternalStore keeps server and first client render identical (nothing done yet) and then follows the storage.
const EVENT = "ljl-progress";
const subscribe = (callback: () => void) => {
  addEventListener("storage", callback);
  addEventListener(EVENT, callback);
  return () => {
    removeEventListener("storage", callback);
    removeEventListener(EVENT, callback);
  };
};
const read = (key: string) => {
  try {
    return localStorage.getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
};
const write = (key: string, ids: string[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Storage blocked (private mode): the checkbox simply will not stick.
  }
  dispatchEvent(new Event(EVENT));
};

export function CourseLessons({ slug, lessons, certificate }: { slug: string; lessons: LessonView[]; certificate?: { hours: number; email: string } | null }) {
  const key = `ljl-progress:${slug}`;
  const raw = useSyncExternalStore(subscribe, () => read(key), () => "[]");
  const done = useMemo(() => {
    try {
      const parsed: unknown = JSON.parse(raw);
      return new Set(Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : []);
    } catch {
      return new Set<string>();
    }
  }, [raw]);

  const count = lessons.filter((l) => done.has(l.id)).length;
  const pct = lessons.length ? Math.round((count / lessons.length) * 100) : 0;
  const toggle = (id: string) => write(key, done.has(id) ? [...done].filter((x) => x !== id) : [...done, id]);

  return (
    <div className="course-lessons">
      <div className="course-progress">
        <div className="course-bar" role="progressbar" aria-valuemin={0} aria-valuemax={lessons.length} aria-valuenow={count} aria-label="Aulas concluídas">
          <i style={{ width: `${pct}%` }} />
        </div>
        <p>
          <b>
            {count} de {lessons.length}
          </b>{" "}
          aulas concluídas. Seu progresso fica salvo só neste navegador.
          {count > 0 && (
            <>
              {" "}
              <button type="button" className="course-reset" onClick={() => write(key, [])}>
                Limpar progresso
              </button>
            </>
          )}
        </p>
      </div>

      {certificate && lessons.length > 0 && count === lessons.length && (
        <div className="course-finished" role="status">
          <p>
            <b>Você terminou!</b> A Liga emite certificado de {certificate.hours} {certificate.hours === 1 ? "hora" : "horas"} para quem conclui. Escreva para{" "}
            <a href={`mailto:${certificate.email}?subject=${encodeURIComponent("Certificado de conclusão")}`}>{certificate.email}</a> com o seu nome completo e conte em
            poucas linhas o que achou. A equipe confere e emite.
          </p>
        </div>
      )}

      <ol className="lessons">
        {lessons.map((l, i) => {
          const isDone = done.has(l.id);
          return (
            <li key={l.id} className={`lesson rise${isDone ? " is-done" : ""}`} style={{ "--i": i } as React.CSSProperties}>
              <details open={i === 0}>
                <summary>
                  <span className="lesson-n">{isDone ? "✓" : i + 1}</span>
                  <span className="lesson-t">{l.title}</span>
                  {l.minutes && <span className="lesson-meta">{l.minutes} min</span>}
                </summary>
                <div className="lesson-body">
                  {l.summary && <p className="lesson-summary">{l.summary}</p>}
                  {l.book && (
                    <div className="lesson-book">
                      <BookCover book={l.book} size="sm" />
                      <div>
                      <p className="lesson-label">Leitura</p>
                      <p className="lesson-book-title">
                        {l.book.title} <span>· {l.book.author}, {l.book.year}</span>
                      </p>
                      <p className="lesson-book-links">
                        <Link href={`/library#book-${l.book.slug}`}>Ver na biblioteca</Link>
                        {l.book.free.map((f) => (
                          <a key={f.url} href={f.url} target="_blank" rel="noopener noreferrer">
                            Baixar grátis ({f.source}, {f.language}) ↗
                          </a>
                        ))}
                      </p>
                      </div>
                    </div>
                  )}
                  {l.html && <div className="prose lesson-prose" dangerouslySetInnerHTML={{ __html: l.html }} />}
                  {l.questions.length > 0 && (
                    <div>
                      <p className="lesson-label">Para debater</p>
                      <ol className="lesson-questions">
                        {l.questions.map((q) => (
                          <li key={q}>{q}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {l.task && (
                    <div className="lesson-task">
                      <p className="lesson-label">Tarefa da semana</p>
                      <p>{l.task}</p>
                    </div>
                  )}
                  <button type="button" className={`btn ${isDone ? "btn-line" : "btn-green"} lesson-done`} onClick={() => toggle(l.id)} aria-pressed={isDone}>
                    {isDone ? "Desmarcar como concluída" : "Marcar como concluída"}
                  </button>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
