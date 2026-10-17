"use client";

import { useActionState } from "react";
import { login } from "@/modules/auth/actions";
import { SubmitButton } from "@/components/dashboard/client";
import { valueOf } from "@/lib/form-state";
import { Field, FormAlert } from "@/components/dashboard/ui";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(login, {});
  return (
    <form action={action} className="dash-form" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      <FormAlert state={state} />
      <Field label="E-mail" name="email" state={state}>
        <input id="email" name="email" type="email" autoComplete="username" required autoFocus defaultValue={valueOf(state, "email", "")} className="dash-input" />
      </Field>
      <Field label="Senha" name="password" state={state}>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="dash-input" />
      </Field>
      <SubmitButton pendingLabel="Entrando…">Entrar</SubmitButton>
    </form>
  );
}
