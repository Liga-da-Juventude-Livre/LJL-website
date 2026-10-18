"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { checkedOf, fieldError, valueOf, type FormState } from "@/lib/form-state";
import { submitChapterRequest } from "@/modules/chapter-requests/public-actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-green" disabled={pending}>
      {pending ? "Enviando…" : "Enviar pedido"}
    </button>
  );
}

function Field({ label, name, state, hint, children }: { label: string; name: string; state: FormState; hint?: string; children: React.ReactNode }) {
  const error = fieldError(state, name);
  return (
    <div className="interest-field">
      <label htmlFor={name}>{label}</label>
      {children}
      {error ? <p className="interest-error">{error}</p> : hint && <p className="interest-hint">{hint}</p>}
    </div>
  );
}

export function InterestForm({ contactEmail }: { contactEmail: string }) {
  const [state, action] = useActionState(submitChapterRequest, {});

  if (state.ok) {
    return (
      <div className="interest-done" role="status">
        <h3>Pedido recebido</h3>
        <p>{state.ok}</p>
      </div>
    );
  }

  return (
    <form action={action} className="interest-form" noValidate>
      {state.error && (
        <p className="interest-alert" role="alert">
          {state.error}
        </p>
      )}
      <Field label="Seu nome" name="name" state={state}>
        <input id="name" name="name" autoComplete="name" required maxLength={100} defaultValue={valueOf(state, "name", "")} className="interest-input" />
      </Field>
      <Field label="E-mail" name="email" state={state}>
        <input id="email" name="email" type="email" autoComplete="email" required maxLength={200} defaultValue={valueOf(state, "email", "")} className="interest-input" />
      </Field>
      <Field label="Universidade" name="university" state={state}>
        <input id="university" name="university" autoComplete="off" required maxLength={120} defaultValue={valueOf(state, "university", "")} className="interest-input" />
      </Field>
      <Field label="Curso (opcional)" name="course" state={state}>
        <input id="course" name="course" autoComplete="off" maxLength={120} defaultValue={valueOf(state, "course", "")} className="interest-input" />
      </Field>
      <Field label="Mensagem (opcional)" name="message" state={state} hint="Conte em poucas linhas como está o interesse na sua universidade.">
        <textarea id="message" name="message" maxLength={1000} defaultValue={valueOf(state, "message", "")} className="interest-input interest-textarea" />
      </Field>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div className="interest-honey" aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="interest-field">
        <label className="interest-check">
          <input type="checkbox" name="consent" defaultChecked={checkedOf(state, "consent", false)} />
          <span>Concordo que a Liga use meu nome e e-mail para responder a este pedido.</span>
        </label>
        {fieldError(state, "consent") && <p className="interest-error">{fieldError(state, "consent")}</p>}
        <p className="interest-hint">
          Os dados ficam só com a equipe da Liga. Você pode pedir a exclusão a qualquer momento escrevendo para {contactEmail}. Veja a <Link href="/privacy">política de privacidade</Link>.
        </p>
      </div>
      <Submit />
    </form>
  );
}
