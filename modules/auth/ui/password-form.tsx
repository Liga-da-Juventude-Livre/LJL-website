"use client";

import { useActionState } from "react";
import { changePassword } from "@/modules/auth/actions";
import { SubmitButton } from "@/components/dashboard/client";
import { Field, FormAlert } from "@/components/dashboard/ui";

export function PasswordForm({ required }: { required?: boolean }) {
  const [state, action] = useActionState(changePassword, {});
  return (
    <form action={action} className="dash-form" noValidate>
      {required && <input type="hidden" name="required" value="1" />}
      <FormAlert state={state} />
      <Field label="Senha atual" name="current" state={state}>
        <input id="current" name="current" type="password" autoComplete="current-password" required className="dash-input" />
      </Field>
      <Field label="Nova senha" name="next" state={state} hint="Pelo menos 10 caracteres.">
        <input id="next" name="next" type="password" autoComplete="new-password" required className="dash-input" />
      </Field>
      <Field label="Repita a nova senha" name="confirm" state={state}>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" required className="dash-input" />
      </Field>
      <div>
        <SubmitButton pendingLabel="Salvando…">Trocar senha</SubmitButton>
      </div>
    </form>
  );
}
