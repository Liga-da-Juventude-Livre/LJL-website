"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "@/components/dashboard/client";
import { Field, FormAlert, FormSelect } from "@/components/dashboard/ui";
import { valueOf } from "@/lib/form-state";
import { issueCertificates } from "@/modules/certificates/actions";

type CourseOption = { id: string; title: string; kind: string; workloadHours: number | null; issuesCertificate: boolean };
type EventOption = { id: string; title: string };

/** Issues one or many certificates at once. Picking a course or event fills the title, hours and kind for you. */
type Initial = { people: string; courseId: string; title: string; hours: string; kind: string };
const blank: Initial = { people: "", courseId: "", title: "", hours: "", kind: "COMPLETION" };

export function IssueForm({ courses, events, today, initial = blank }: { courses: CourseOption[]; events: EventOption[]; today: string; initial?: Initial }) {
  const [state, action] = useActionState(issueCertificates, {});

  // Fill only what the person has not typed themselves (a field we filled is marked data-auto and may be replaced).
  const fill = (form: HTMLFormElement, values: { title: string; hours?: number | null; kind: string }) => {
    const title = form.elements.namedItem("title") as HTMLInputElement;
    const hours = form.elements.namedItem("hours") as HTMLInputElement;
    const kind = form.elements.namedItem("kind") as HTMLSelectElement;
    if (!title.value || title.dataset.auto === "1") {
      title.value = values.title;
      title.dataset.auto = "1";
    }
    if (values.hours && (!hours.value || hours.dataset.auto === "1")) {
      hours.value = String(values.hours);
      hours.dataset.auto = "1";
    }
    kind.value = values.kind;
  };
  const manual = (e: React.FormEvent<HTMLInputElement>) => delete e.currentTarget.dataset.auto;

  return (
    <form action={action} className="dash-form" noValidate>
      <FormAlert state={state} />
      <Field label="Pessoas" name="people" state={state} showAll hint="Uma pessoa por linha: o nome e, se quiser, o e-mail separado por vírgula. Até 200 por vez. Todas recebem o mesmo certificado." wide>
        <textarea id="people" name="people" rows={7} defaultValue={valueOf(state, "people", initial.people)} className="dash-textarea" placeholder={"Ana Souza, ana@exemplo.com\nBruno Lima"} required />
      </Field>
      <div className="dash-grid-2">
        <Field label="Curso (opcional)" name="courseId" state={state} hint="Preenche título, carga horária e tipo.">
          <FormSelect
            name="courseId"
            state={state}
            saved={initial.courseId}
            onChange={(e) => {
              const c = courses.find((x) => x.id === e.target.value);
              if (c) fill(e.currentTarget.form!, { title: c.title, hours: c.workloadHours, kind: "COMPLETION" });
            }}
          >
            <option value="">Nenhum</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
                {c.issuesCertificate ? "" : " (não marcado para certificar)"}
              </option>
            ))}
          </FormSelect>
        </Field>
        <Field label="Evento (opcional)" name="eventId" state={state} hint="Preenche o título e marca participação.">
          <FormSelect
            name="eventId"
            state={state}
            saved=""
            onChange={(e) => {
              const ev = events.find((x) => x.id === e.target.value);
              if (ev) fill(e.currentTarget.form!, { title: ev.title, kind: "PARTICIPATION" });
            }}
          >
            <option value="">Nenhum</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </FormSelect>
        </Field>
        <Field label="Título do certificado" name="title" state={state} hint="Como vai aparecer impresso. Por exemplo: Trilha de leitura: Primeiro mês." wide>
          <input id="title" name="title" defaultValue={valueOf(state, "title", initial.title)} onInput={manual} className="dash-input" required maxLength={160} />
        </Field>
        <Field label="Tipo" name="kind" state={state}>
          <FormSelect name="kind" state={state} saved={initial.kind}>
            <option value="COMPLETION">Concluiu (curso ou trilha)</option>
            <option value="PARTICIPATION">Participou de (evento, debate, grupo de estudos)</option>
          </FormSelect>
        </Field>
        <Field label="Carga horária (horas)" name="hours" state={state} hint="Só as horas que a pessoa realmente dedicou.">
          <input id="hours" name="hours" type="number" min={1} defaultValue={valueOf(state, "hours", initial.hours)} onInput={manual} className="dash-input" required />
        </Field>
        <Field label="Data de conclusão ou participação" name="completedOn" state={state}>
          <input id="completedOn" name="completedOn" type="date" max={today} defaultValue={valueOf(state, "completedOn", today)} className="dash-input" required />
        </Field>
      </div>
      <div className="dash-form-actions">
        <SubmitButton pendingLabel="Emitindo…">Emitir certificados</SubmitButton>
        <Link href="/dashboard/certificates" className="dash-btn dash-btn-ghost">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
