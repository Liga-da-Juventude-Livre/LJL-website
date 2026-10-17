"use client";

import { useActionState } from "react";
import { ConfirmButton, SubmitButton } from "@/components/dashboard/client";
import { Field, FormAlert, FormSelect } from "@/components/dashboard/ui";
import { valueOf } from "@/lib/form-state";
import { deleteLesson, moveLesson, saveLesson } from "@/modules/courses/actions";

export type LessonRow = {
  id: string;
  title: string;
  summary: string | null;
  body: string | null;
  bookId: string | null;
  questions: string[];
  task: string | null;
  estimatedMinutes: number | null;
};
type BookOption = { id: string; title: string; author: string };

function LessonForm({ courseId, lesson, books, uid }: { courseId: string; lesson?: LessonRow; books: BookOption[]; uid: string }) {
  const [state, action] = useActionState(saveLesson.bind(null, courseId, lesson?.id ?? ""), {});
  const id = (name: string) => `${uid}-${name}`;
  return (
    <form action={action} className="dash-form" noValidate>
      <FormAlert state={state} />
      <div className="dash-grid-2">
        <Field label="Título da aula" name="title" state={state} htmlFor={id("title")} wide>
          <input id={id("title")} name="title" defaultValue={valueOf(state, "title", lesson?.title ?? "")} className="dash-input" required />
        </Field>
        <Field label="Resumo (opcional)" name="summary" state={state} htmlFor={id("summary")} wide>
          <input id={id("summary")} name="summary" defaultValue={valueOf(state, "summary", lesson?.summary ?? "")} className="dash-input" maxLength={300} />
        </Field>
        <Field label="Livro da leitura (opcional)" name="bookId" state={state} htmlFor={id("bookId")} hint="Aparece com “Baixar grátis” quando o livro tem edição conferida.">
          <FormSelect id={id("bookId")} name="bookId" state={state} saved={lesson?.bookId ?? ""}>
            <option value="">Sem livro</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} · {b.author}
              </option>
            ))}
          </FormSelect>
        </Field>
        <Field label="Tempo estimado (minutos)" name="estimatedMinutes" state={state} htmlFor={id("minutes")}>
          <input id={id("minutes")} name="estimatedMinutes" type="number" min={1} defaultValue={valueOf(state, "estimatedMinutes", lesson?.estimatedMinutes?.toString() ?? "")} className="dash-input" />
        </Field>
        <Field label="Texto da aula (opcional)" name="body" state={state} htmlFor={id("body")} hint="Em Markdown." wide>
          <textarea id={id("body")} name="body" defaultValue={valueOf(state, "body", lesson?.body ?? "")} className="dash-textarea" />
        </Field>
        <Field label="Para debater" name="questions" state={state} htmlFor={id("questions")} hint="Uma pergunta por linha, até 10." wide>
          <textarea id={id("questions")} name="questions" defaultValue={valueOf(state, "questions", lesson?.questions.join("\n") ?? "")} className="dash-textarea" />
        </Field>
        <Field label="Tarefa da semana (opcional)" name="task" state={state} htmlFor={id("task")} wide>
          <textarea id={id("task")} name="task" defaultValue={valueOf(state, "task", lesson?.task ?? "")} className="dash-textarea" maxLength={600} />
        </Field>
      </div>
      <div className="dash-form-actions">
        <SubmitButton>{lesson ? "Salvar aula" : "Adicionar aula"}</SubmitButton>
      </div>
    </form>
  );
}

/** The lessons of one course: edit each in place, reorder, delete, and add a new one at the end. */
export function LessonsEditor({ courseId, lessons, books }: { courseId: string; lessons: LessonRow[]; books: BookOption[] }) {
  return (
    <div className="dash-stack">
      {lessons.length === 0 ? (
        <p className="dash-field-hint">Este curso ainda não tem aulas. Adicione a primeira abaixo.</p>
      ) : (
        <ol className="dash-lessons">
          {lessons.map((l, i) => (
            <li key={l.id}>
              <details className="dash-lesson">
                <summary>
                  <span className="dash-lesson-n">{i + 1}</span>
                  <span className="dash-lesson-t">{l.title}</span>
                  <span className="dash-lesson-m">{l.bookId ? "com leitura" : "só texto"}</span>
                </summary>
                <div className="dash-lesson-body">
                  <LessonForm courseId={courseId} lesson={l} books={books} uid={`lesson-${l.id}`} />
                  <div className="dash-form-actions">
                    <form action={moveLesson.bind(null, l.id, "up")} className="dash-inline-form">
                      <button type="submit" className="dash-btn dash-btn-ghost dash-btn-sm" disabled={i === 0} aria-label="Mover aula para cima">
                        ↑ Subir
                      </button>
                    </form>
                    <form action={moveLesson.bind(null, l.id, "down")} className="dash-inline-form">
                      <button type="submit" className="dash-btn dash-btn-ghost dash-btn-sm" disabled={i === lessons.length - 1} aria-label="Mover aula para baixo">
                        ↓ Descer
                      </button>
                    </form>
                    <span className="dash-spacer" />
                    <form action={deleteLesson.bind(null, l.id)} className="dash-inline-form">
                      <ConfirmButton message="Remover esta aula?">Remover aula</ConfirmButton>
                    </form>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ol>
      )}
      <div>
        <h3 className="dash-subhead">Nova aula</h3>
        <LessonForm courseId={courseId} books={books} uid="lesson-new" />
      </div>
    </div>
  );
}
