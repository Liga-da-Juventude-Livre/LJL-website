"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "@/components/dashboard/client";
import { Field, FormAlert, FormSelect } from "@/components/dashboard/ui";
import { MEMBER_TITLES } from "@/content/talent";
import { checkedOf, valueOf } from "@/lib/form-state";
import { saveMember } from "@/modules/members/actions";

export type MemberValues = {
  id?: string;
  chapterId: string;
  name: string;
  email: string;
  title: string;
  startedOn: string;
  endsOn: string;
  mentor: boolean;
  notes: string;
  applicationId?: string;
  userId: string;
};

/** `chapters` is empty for a coordinator (their diretório is fixed); `accounts` is empty unless an administrator is editing. */
export function MemberForm({
  initial,
  chapters,
  accounts,
  cancelHref,
}: {
  initial: MemberValues;
  chapters: { id: string; name: string }[];
  accounts: { id: string; name: string }[];
  cancelHref: string;
}) {
  const [state, action] = useActionState(saveMember, {});
  return (
    <form action={action} className="dash-form" noValidate>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      {initial.applicationId && <input type="hidden" name="applicationId" value={initial.applicationId} />}
      <FormAlert state={state} />
      <div className="dash-grid-2">
        <Field label="Nome" name="name" state={state}>
          <input id="name" name="name" defaultValue={valueOf(state, "name", initial.name)} className="dash-input" required />
        </Field>
        <Field label="E-mail" name="email" state={state}>
          <input id="email" name="email" type="email" defaultValue={valueOf(state, "email", initial.email)} className="dash-input" required />
        </Field>
        {chapters.length > 0 && (
          <Field label="Diretório" name="chapterId" state={state}>
            <FormSelect name="chapterId" state={state} saved={initial.chapterId}>
              <option value="">Escolha…</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </FormSelect>
          </Field>
        )}
        <Field label="Função" name="title" state={state}>
          <FormSelect name="title" state={state} saved={initial.title}>
            {MEMBER_TITLES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </FormSelect>
        </Field>
        <Field label="Início do mandato" name="startedOn" state={state}>
          <input id="startedOn" name="startedOn" type="date" defaultValue={valueOf(state, "startedOn", initial.startedOn)} className="dash-input" required />
        </Field>
        <Field label="Fim previsto do mandato (opcional)" name="endsOn" state={state} hint="Por exemplo, o fim do semestre. A Liga avisa quando estiver chegando, para abrir a vaga a tempo.">
          <input id="endsOn" name="endsOn" type="date" defaultValue={valueOf(state, "endsOn", initial.endsOn)} className="dash-input" />
        </Field>
        {accounts.length > 0 && (
          <Field label="Conta no painel (opcional)" name="userId" state={state} hint="Quando o mandato for encerrado, esta conta é desativada.">
            <FormSelect name="userId" state={state} saved={initial.userId}>
              <option value="">Sem conta</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </FormSelect>
          </Field>
        )}
        <div className="dash-field">
          <span className="dash-label">Mentoria</span>
          <label className="dash-check">
            <input type="checkbox" name="mentor" defaultChecked={checkedOf(state, "mentor", initial.mentor)} />
            <span>Disponível para mentorar quem chega</span>
          </label>
        </div>
        <Field label="Notas internas" name="notes" state={state} hint="Só a coordenação e a equipe veem." wide>
          <textarea id="notes" name="notes" defaultValue={valueOf(state, "notes", initial.notes)} className="dash-textarea" />
        </Field>
      </div>
      <div className="dash-form-actions">
        <SubmitButton>Salvar</SubmitButton>
        <Link href={cancelHref} className="dash-btn dash-btn-ghost">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
