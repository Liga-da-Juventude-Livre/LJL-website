"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ConfirmButton, SubmitButton } from "@/components/dashboard/client";
import { fieldError, valueOf, checkedOf } from "@/lib/form-state";
import { Field, FormAlert, FormSelect } from "@/components/dashboard/ui";
import { saveBook } from "@/modules/books/actions";
import { LEVELS } from "@/modules/books/labels";
import { ImageUpload } from "@/modules/uploads/ui/image-upload";

export type BookValues = {
  id?: string;
  title: string;
  slug: string;
  author: string;
  year: string;
  level: string;
  note: string;
  frontId: string;
  featured: boolean;
  published: boolean;
  sortOrder: string;
  coverUrl: string;
};

export const emptyBook: BookValues = {
  title: "",
  slug: "",
  author: "",
  year: "",
  level: "BEGINNER",
  note: "",
  frontId: "",
  featured: false,
  published: true,
  sortOrder: "0",
  coverUrl: "",
};

export function BookForm({
  initial,
  fronts,
  storageReady,
  deleteAction,
}: {
  initial: BookValues;
  fronts: { id: string; name: string }[];
  storageReady: boolean;
  deleteAction?: () => Promise<void>;
}) {
  const [state, action] = useActionState(saveBook, {});
  return (
    <>
      <form action={action} className="dash-form" noValidate>
        {initial.id && <input type="hidden" name="id" value={initial.id} />}
        <FormAlert state={state} />
        <ImageUpload name="coverUrl" scope="books" label="Capa do livro" initialUrl={initial.coverUrl} enabled={storageReady} serverError={fieldError(state, "coverUrl")} />
        <div className="dash-grid-2">
          <Field label="Título" name="title" state={state}>
            <input id="title" name="title" defaultValue={valueOf(state, "title", initial.title)} className="dash-input" required />
          </Field>
          <Field label="Autor" name="author" state={state}>
            <input id="author" name="author" defaultValue={valueOf(state, "author", initial.author)} className="dash-input" required />
          </Field>
          <Field label="Ano de publicação" name="year" state={state}>
            <input id="year" name="year" type="number" defaultValue={valueOf(state, "year", initial.year)} className="dash-input" required />
          </Field>
          <Field label="Frente" name="frontId" state={state}>
            <FormSelect name="frontId" state={state} saved={initial.frontId} required>
              <option value="">Escolha…</option>
              {fronts.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
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
          <Field label="Ordem na lista" name="sortOrder" state={state} hint="Menor número aparece primeiro.">
            <input id="sortOrder" name="sortOrder" type="number" defaultValue={valueOf(state, "sortOrder", initial.sortOrder)} className="dash-input" />
          </Field>
          <Field label="Por que recomendamos" name="note" state={state} hint="Uma ou duas frases, até 400 caracteres." wide>
            <textarea id="note" name="note" defaultValue={valueOf(state, "note", initial.note)} className="dash-textarea" required maxLength={400} />
          </Field>
          <Field label="Endereço (slug)" name="slug" state={state} hint="Deixe em branco para gerar a partir do título.">
            <input id="slug" name="slug" defaultValue={valueOf(state, "slug", initial.slug)} className="dash-input" />
          </Field>
          <div className="dash-field">
            <span className="dash-label">Exibição</span>
            <label className="dash-check">
              <input type="checkbox" name="published" defaultChecked={checkedOf(state, "published", initial.published)} />
              <span>Publicado na biblioteca</span>
            </label>
            <label className="dash-check">
              <input type="checkbox" name="featured" defaultChecked={checkedOf(state, "featured", initial.featured)} />
              <span>Aparece em “Por onde começar”</span>
            </label>
          </div>
        </div>
        <div className="dash-form-actions">
          <SubmitButton>{initial.id ? "Salvar alterações" : "Cadastrar livro"}</SubmitButton>
          <Link href="/dashboard/books" className="dash-btn dash-btn-ghost">
            Cancelar
          </Link>
        </div>
      </form>
      {deleteAction && (
        <form action={deleteAction} className="dash-form-actions">
          <ConfirmButton message="Excluir este livro e as edições gratuitas cadastradas?">Excluir livro</ConfirmButton>
        </form>
      )}
    </>
  );
}
