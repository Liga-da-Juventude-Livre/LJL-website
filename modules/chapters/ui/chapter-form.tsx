"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ConfirmButton, SubmitButton } from "@/components/dashboard/client";
import { valueOf, checkedOf } from "@/lib/form-state";
import { Field, FormAlert } from "@/components/dashboard/ui";
import { saveChapter } from "@/modules/chapters/actions";

export type ChapterValues = {
  id?: string;
  name: string;
  slug: string;
  university: string;
  city: string;
  state: string;
  description: string;
  contactEmail: string;
  foundedAt: string;
  active: boolean;
};

export const emptyChapter: ChapterValues = {
  name: "",
  slug: "",
  university: "",
  city: "",
  state: "",
  description: "",
  contactEmail: "",
  foundedAt: "",
  active: true,
};

export function ChapterForm({ initial, deleteAction }: { initial: ChapterValues; deleteAction?: () => Promise<void> }) {
  const [state, action] = useActionState(saveChapter, {});
  return (
    <>
      <form action={action} className="dash-form" noValidate>
        {initial.id && <input type="hidden" name="id" value={initial.id} />}
        <FormAlert state={state} />
        <div className="dash-grid-2">
          <Field label="Nome do diretório" name="name" state={state}>
            <input id="name" name="name" defaultValue={valueOf(state, "name", initial.name)} className="dash-input" placeholder="Diretório PUC-Rio" required />
          </Field>
          <Field label="Universidade" name="university" state={state}>
            <input id="university" name="university" defaultValue={valueOf(state, "university", initial.university)} className="dash-input" placeholder="PUC-Rio" required />
          </Field>
          <Field label="Cidade" name="city" state={state}>
            <input id="city" name="city" defaultValue={valueOf(state, "city", initial.city)} className="dash-input" required />
          </Field>
          <Field label="Estado (sigla)" name="state" state={state}>
            <input id="state" name="state" defaultValue={valueOf(state, "state", initial.state)} className="dash-input" maxLength={2} placeholder="RJ" />
          </Field>
          <Field label="E-mail do diretório" name="contactEmail" state={state}>
            <input id="contactEmail" name="contactEmail" type="email" defaultValue={valueOf(state, "contactEmail", initial.contactEmail)} className="dash-input" />
          </Field>
          <Field label="Data de fundação" name="foundedAt" state={state}>
            <input id="foundedAt" name="foundedAt" type="date" defaultValue={valueOf(state, "foundedAt", initial.foundedAt)} className="dash-input" />
          </Field>
          <Field label="Descrição" name="description" state={state} wide>
            <textarea id="description" name="description" defaultValue={valueOf(state, "description", initial.description)} className="dash-textarea" />
          </Field>
          <Field label="Endereço (slug)" name="slug" state={state} hint="Deixe em branco para gerar a partir do nome.">
            <input id="slug" name="slug" defaultValue={valueOf(state, "slug", initial.slug)} className="dash-input" />
          </Field>
          <div className="dash-field">
            <span className="dash-label">Situação</span>
            <label className="dash-check">
              <input type="checkbox" name="active" defaultChecked={checkedOf(state, "active", initial.active)} />
              <span>Diretório ativo</span>
            </label>
          </div>
        </div>
        <div className="dash-form-actions">
          <SubmitButton>{initial.id ? "Salvar alterações" : "Criar diretório"}</SubmitButton>
          <Link href="/dashboard/chapters" className="dash-btn dash-btn-ghost">
            Cancelar
          </Link>
        </div>
      </form>
      {deleteAction && (
        <form action={deleteAction} className="dash-form-actions">
          <ConfirmButton message="Excluir este diretório? Posts, eventos e pessoas continuam, só perdem o vínculo.">Excluir diretório</ConfirmButton>
        </form>
      )}
    </>
  );
}
