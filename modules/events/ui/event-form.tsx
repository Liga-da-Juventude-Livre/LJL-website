"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ConfirmButton, SubmitButton } from "@/components/dashboard/client";
import { valueOf } from "@/lib/form-state";
import { Field, FormAlert, FormSelect, statusLabel } from "@/components/dashboard/ui";
import { saveEvent } from "@/modules/events/actions";

export type EventValues = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
  onlineUrl: string;
  registrationUrl: string;
  chapterId: string;
  status: string;
};

export const emptyEvent: EventValues = {
  title: "",
  slug: "",
  description: "",
  startsAt: "",
  endsAt: "",
  location: "",
  onlineUrl: "",
  registrationUrl: "",
  chapterId: "",
  status: "DRAFT",
};

export function EventForm({
  initial,
  chapters,
  deleteAction,
}: {
  initial: EventValues;
  chapters: { id: string; name: string }[];
  deleteAction?: () => Promise<void>;
}) {
  const [state, action] = useActionState(saveEvent, {});
  return (
    <>
      <form action={action} className="dash-form" noValidate>
        {initial.id && <input type="hidden" name="id" value={initial.id} />}
        <FormAlert state={state} />
        <div className="dash-grid-2">
          <Field label="Título" name="title" state={state} wide>
            <input id="title" name="title" defaultValue={valueOf(state, "title", initial.title)} className="dash-input" required />
          </Field>
          <Field label="Descrição" name="description" state={state} wide>
            <textarea id="description" name="description" defaultValue={valueOf(state, "description", initial.description)} className="dash-textarea" required />
          </Field>
          <Field label="Início (horário de Brasília)" name="startsAt" state={state}>
            <input id="startsAt" name="startsAt" type="datetime-local" defaultValue={valueOf(state, "startsAt", initial.startsAt)} className="dash-input" required />
          </Field>
          <Field label="Fim (opcional)" name="endsAt" state={state}>
            <input id="endsAt" name="endsAt" type="datetime-local" defaultValue={valueOf(state, "endsAt", initial.endsAt)} className="dash-input" />
          </Field>
          <Field label="Local" name="location" state={state}>
            <input id="location" name="location" defaultValue={valueOf(state, "location", initial.location)} className="dash-input" placeholder="Prédio, sala, cidade" />
          </Field>
          <Field label="Diretório" name="chapterId" state={state}>
            <FormSelect name="chapterId" state={state} saved={initial.chapterId}>
              <option value="">Nenhum</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </FormSelect>
          </Field>
          <Field label="Link da transmissão (opcional)" name="onlineUrl" state={state}>
            <input id="onlineUrl" name="onlineUrl" type="url" defaultValue={valueOf(state, "onlineUrl", initial.onlineUrl)} className="dash-input" placeholder="https://" />
          </Field>
          <Field label="Link de inscrição (opcional)" name="registrationUrl" state={state}>
            <input id="registrationUrl" name="registrationUrl" type="url" defaultValue={valueOf(state, "registrationUrl", initial.registrationUrl)} className="dash-input" placeholder="https://" />
          </Field>
          <Field label="Situação" name="status" state={state}>
            <FormSelect name="status" state={state} saved={initial.status}>
              {["DRAFT", "PUBLISHED", "ARCHIVED"].map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </FormSelect>
          </Field>
          <Field label="Endereço (slug)" name="slug" state={state} hint="Deixe em branco para gerar a partir do título.">
            <input id="slug" name="slug" defaultValue={valueOf(state, "slug", initial.slug)} className="dash-input" />
          </Field>
        </div>
        <div className="dash-form-actions">
          <SubmitButton>{initial.id ? "Salvar alterações" : "Criar evento"}</SubmitButton>
          <Link href="/dashboard/events" className="dash-btn dash-btn-ghost">
            Cancelar
          </Link>
        </div>
      </form>
      {deleteAction && (
        <form action={deleteAction} className="dash-form-actions">
          <ConfirmButton message="Excluir este evento?">Excluir evento</ConfirmButton>
        </form>
      )}
    </>
  );
}
