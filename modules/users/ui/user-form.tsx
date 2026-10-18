"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "@/components/dashboard/client";
import { valueOf, checkedOf } from "@/lib/form-state";
import { Field, FormAlert, FormSelect } from "@/components/dashboard/ui";
import { saveUser } from "@/modules/users/actions";

export type UserValues = {
  id?: string;
  name: string;
  email: string;
  role: string;
  chapterId: string;
  active: boolean;
};

export const emptyUser: UserValues = { name: "", email: "", role: "AUTHOR", chapterId: "", active: true };

export function UserForm({ initial, chapters }: { initial: UserValues; chapters: { id: string; name: string }[] }) {
  const [state, action] = useActionState(saveUser, {});
  const editing = !!initial.id;
  return (
    <form action={action} className="dash-form" noValidate>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <FormAlert state={state} />
      <div className="dash-grid-2">
        <Field label="Nome" name="name" state={state}>
          <input id="name" name="name" defaultValue={valueOf(state, "name", initial.name)} className="dash-input" required />
        </Field>
        <Field label="E-mail" name="email" state={state}>
          <input id="email" name="email" type="email" defaultValue={valueOf(state, "email", initial.email)} className="dash-input" required />
        </Field>
        <Field label="Perfil" name="role" state={state} hint="Autor escreve e envia para revisão. Coordenação também cuida das candidaturas do próprio diretório (escolha o diretório ao lado). Editor publica e cuida de todo o conteúdo. Administrador também gerencia pessoas.">
          <FormSelect name="role" state={state} saved={initial.role}>
            <option value="AUTHOR">Autor</option>
            <option value="COORDINATOR">Coordenação de diretório</option>
            <option value="EDITOR">Editor</option>
            <option value="ADMIN">Administrador</option>
          </FormSelect>
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
        <Field
          label={editing ? "Nova senha provisória (opcional)" : "Senha provisória"}
          name="password"
          state={state}
          hint={editing ? "Preencha só para redefinir. A pessoa será desconectada e escolherá outra senha ao entrar." : "Pelo menos 10 caracteres. A pessoa escolhe a definitiva no primeiro acesso."}
        >
          <input id="password" name="password" type="text" autoComplete="off" defaultValue="" className="dash-input" required={!editing} />
        </Field>
        <div className="dash-field">
          <span className="dash-label">Acesso</span>
          <label className="dash-check">
            <input type="checkbox" name="active" defaultChecked={checkedOf(state, "active", initial.active)} />
            <span>Conta ativa</span>
          </label>
        </div>
      </div>
      <div className="dash-form-actions">
        <SubmitButton>{editing ? "Salvar alterações" : "Criar conta"}</SubmitButton>
        <Link href="/dashboard/users" className="dash-btn dash-btn-ghost">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
