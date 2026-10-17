"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ConfirmButton, SubmitButton } from "@/components/dashboard/client";
import { fieldError, valueOf } from "@/lib/form-state";
import { Field, FormAlert, FormSelect, statusLabel } from "@/components/dashboard/ui";
import { savePost } from "@/modules/posts/actions";
import { POST_KINDS } from "@/modules/posts/config";
import { ImageUpload } from "@/modules/uploads/ui/image-upload";

export type PostValues = {
  id?: string;
  type: "ARTICLE" | "NEWS";
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  authorName: string;
  coverUrl: string;
  frontId: string;
  chapterId: string;
  status: string;
};

type Option = { id: string; name: string };

export function PostForm({
  initial,
  fronts,
  chapters,
  statuses,
  storageReady,
  deleteAction,
}: {
  initial: PostValues;
  fronts: Option[];
  chapters: Option[];
  statuses: string[];
  storageReady: boolean;
  deleteAction?: () => Promise<void>;
}) {
  const [state, action] = useActionState(savePost, {});
  const kind = POST_KINDS[initial.type];
  return (
    <>
      <form action={action} className="dash-form" noValidate>
        {initial.id && <input type="hidden" name="id" value={initial.id} />}
        <input type="hidden" name="type" value={initial.type} />
        <FormAlert state={state} />
        <Field label="Título" name="title" state={state}>
          <input id="title" name="title" defaultValue={valueOf(state, "title", initial.title)} className="dash-input" required maxLength={140} />
        </Field>
        <Field label="Resumo" name="excerpt" state={state} hint="Uma ou duas frases. Aparece na lista e ao compartilhar. Até 300 caracteres.">
          <textarea id="excerpt" name="excerpt" defaultValue={valueOf(state, "excerpt", initial.excerpt)} className="dash-textarea" required maxLength={300} />
        </Field>
        <Field label="Texto" name="body" state={state} hint="Em Markdown: ## Subtítulo, **negrito**, *itálico*, [link](https://…), > citação.">
          <textarea id="body" name="body" defaultValue={valueOf(state, "body", initial.body)} className="dash-textarea dash-textarea-lg" required />
        </Field>
        <ImageUpload name="coverUrl" scope="posts" label="Imagem de capa (opcional)" initialUrl={initial.coverUrl} enabled={storageReady} serverError={fieldError(state, "coverUrl")} />
        <div className="dash-grid-2">
          <Field label="Nome de quem assina" name="authorName" state={state}>
            <input id="authorName" name="authorName" defaultValue={valueOf(state, "authorName", initial.authorName)} className="dash-input" required />
          </Field>
          <Field label={kind.needsFront ? "Frente" : "Frente (opcional)"} name="frontId" state={state}>
            <FormSelect name="frontId" state={state} saved={initial.frontId}>
              <option value="">{kind.needsFront ? "Escolha…" : "Nenhuma"}</option>
              {fronts.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </FormSelect>
          </Field>
          <Field label="Diretório (opcional)" name="chapterId" state={state}>
            <FormSelect name="chapterId" state={state} saved={initial.chapterId}>
              <option value="">Nenhum</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </FormSelect>
          </Field>
          <Field label="Situação" name="status" state={state}>
            <FormSelect name="status" state={state} saved={initial.status}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </FormSelect>
          </Field>
          <Field label="Endereço (slug)" name="slug" state={state} hint={`${kind.publicPath}/…  Deixe em branco para gerar a partir do título.`} wide>
            <input id="slug" name="slug" defaultValue={valueOf(state, "slug", initial.slug)} className="dash-input" />
          </Field>
        </div>
        <div className="dash-form-actions">
          <SubmitButton>{initial.id ? "Salvar alterações" : `Criar ${kind.singular}`}</SubmitButton>
          <Link href={kind.path} className="dash-btn dash-btn-ghost">
            Cancelar
          </Link>
        </div>
      </form>
      {deleteAction && (
        <form action={deleteAction} className="dash-form-actions">
          <ConfirmButton message={`Excluir ${kind.singular}? Isso não pode ser desfeito.`}>Excluir {kind.singular}</ConfirmButton>
        </form>
      )}
    </>
  );
}
