"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ConfirmButton, SubmitButton } from "@/components/dashboard/client";
import { Field, FormAlert, FormSelect, statusLabel } from "@/components/dashboard/ui";
import { checkedOf, valueOf } from "@/lib/form-state";
import { saveCourse } from "@/modules/courses/actions";
import { COURSE_STATUSES, KINDS } from "@/modules/courses/labels";
import { LEVELS } from "@/modules/books/labels";

export type CourseValues = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  kind: string;
  level: string;
  frontId: string;
  durationWeeks: string;
  workloadHours: string;
  issuesCertificate: boolean;
  status: string;
  sortOrder: string;
};

export const emptyCourse: CourseValues = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  kind: "TRACK",
  level: "BEGINNER",
  frontId: "",
  durationWeeks: "",
  workloadHours: "",
  issuesCertificate: false,
  status: "DRAFT",
  sortOrder: "0",
};

export function CourseForm({
  initial,
  fronts,
  deleteAction,
}: {
  initial: CourseValues;
  fronts: { id: string; name: string }[];
  deleteAction?: () => Promise<void>;
}) {
  const [state, action] = useActionState(saveCourse, {});
  return (
    <>
      <form action={action} className="dash-form" noValidate>
        {initial.id && <input type="hidden" name="id" value={initial.id} />}
        <FormAlert state={state} />
        <div className="dash-grid-2">
          <Field label="Título" name="title" state={state} wide>
            <input id="title" name="title" defaultValue={valueOf(state, "title", initial.title)} className="dash-input" required />
          </Field>
          <Field label="Resumo" name="summary" state={state} hint="Uma ou duas frases, até 300 caracteres. Aparece na lista." wide>
            <textarea id="summary" name="summary" defaultValue={valueOf(state, "summary", initial.summary)} className="dash-textarea" required maxLength={300} />
          </Field>
          <Field label="Tipo" name="kind" state={state}>
            <FormSelect name="kind" state={state} saved={initial.kind}>
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </FormSelect>
          </Field>
          <Field label="Nível" name="level" state={state}>
            <FormSelect name="level" state={state} saved={initial.level}>
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </FormSelect>
          </Field>
          <Field label="Frente (opcional)" name="frontId" state={state}>
            <FormSelect name="frontId" state={state} saved={initial.frontId}>
              <option value="">Nenhuma</option>
              {fronts.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </FormSelect>
          </Field>
          <Field label="Situação" name="status" state={state} hint="Só o que está Publicado aparece no site.">
            <FormSelect name="status" state={state} saved={initial.status}>
              {COURSE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </FormSelect>
          </Field>
          <Field label="Duração (semanas)" name="durationWeeks" state={state}>
            <input id="durationWeeks" name="durationWeeks" type="number" min={1} defaultValue={valueOf(state, "durationWeeks", initial.durationWeeks)} className="dash-input" />
          </Field>
          <Field label="Carga horária estimada (horas)" name="workloadHours" state={state} hint="Estimativa honesta de leitura e estudo. É o número que um certificado futuro vai informar.">
            <input id="workloadHours" name="workloadHours" type="number" min={1} defaultValue={valueOf(state, "workloadHours", initial.workloadHours)} className="dash-input" />
          </Field>
          <div className="dash-field dash-field-wide">
            <span className="dash-label">Certificado</span>
            <label className="dash-check">
              <input type="checkbox" name="issuesCertificate" defaultChecked={checkedOf(state, "issuesCertificate", initial.issuesCertificate)} />
              <span>A Liga emite certificado para quem concluir (a equipe confere e emite pelo painel)</span>
            </label>
            <p className="dash-field-hint">Exige a carga horária acima. Quando marcado, a página do curso avisa quem terminar todas as aulas como pedir o certificado.</p>
          </div>
          <Field label="Apresentação (opcional)" name="description" state={state} hint="Em Markdown. Aparece no topo da página do curso." wide>
            <textarea id="description" name="description" defaultValue={valueOf(state, "description", initial.description)} className="dash-textarea" />
          </Field>
          <Field label="Ordem na lista" name="sortOrder" state={state} hint="Menor número aparece primeiro.">
            <input id="sortOrder" name="sortOrder" type="number" defaultValue={valueOf(state, "sortOrder", initial.sortOrder)} className="dash-input" />
          </Field>
          <Field label="Endereço (slug)" name="slug" state={state} hint="Deixe em branco para gerar a partir do título.">
            <input id="slug" name="slug" defaultValue={valueOf(state, "slug", initial.slug)} className="dash-input" />
          </Field>
        </div>
        <div className="dash-form-actions">
          <SubmitButton>{initial.id ? "Salvar alterações" : "Criar e adicionar aulas"}</SubmitButton>
          <Link href="/dashboard/courses" className="dash-btn dash-btn-ghost">
            Cancelar
          </Link>
        </div>
      </form>
      {deleteAction && (
        <form action={deleteAction} className="dash-form-actions">
          <ConfirmButton message="Excluir este curso e todas as aulas dele? Isso não pode ser desfeito.">Excluir curso</ConfirmButton>
        </form>
      )}
    </>
  );
}
