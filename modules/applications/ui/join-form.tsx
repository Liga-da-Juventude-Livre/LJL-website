"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Select } from "@/components/Select";
import { INTERESTS, SKILLS } from "@/content/talent";
import Link from "next/link";
import { checkedOf, fieldError, valueOf, type FormState } from "@/lib/form-state";
import { submitApplication } from "@/modules/applications/public-actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-green" disabled={pending}>
      {pending ? "Enviando…" : "Enviar candidatura"}
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

function Chips({ legend, name, options, state, hint, preset = [] }: { legend: string; name: string; options: readonly { value: string; label: string }[]; state: FormState; hint?: string; preset?: string[] }) {
  const picked = new Set(state.values ? (state.values[name] ?? "").split(",").filter(Boolean) : preset);
  const error = fieldError(state, name);
  return (
    <fieldset className="interest-field chips">
      <legend>{legend}</legend>
      <div className="chips-list">
        {options.map((o) => (
          <label key={o.value} className="chip">
            <input type="checkbox" name={name} value={o.value} defaultChecked={picked.has(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {error ? <p className="interest-error">{error}</p> : hint && <p className="interest-hint">{hint}</p>}
    </fieldset>
  );
}

export function JoinForm({ chapters, contactEmail, preset }: { chapters: { id: string; name: string }[]; contactEmail: string; preset?: { skills: string[]; interests: string[] } }) {
  const [state, action] = useActionState(submitApplication, {});

  if (state.ok) {
    return (
      <div className="interest-done" role="status">
        <h3>Candidatura recebida</h3>
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
      <Field label="Diretório" name="chapterId" state={state}>
        <Select
          id="chapterId"
          name="chapterId"
          defaultValue={valueOf(state, "chapterId", "")}
          options={[{ value: "", label: "Ainda não há diretório na minha universidade" }, ...chapters.map((c) => ({ value: c.id, label: c.name }))]}
        />
      </Field>
      <Field label="Seu nome" name="name" state={state}>
        <input id="name" name="name" autoComplete="name" required maxLength={100} defaultValue={valueOf(state, "name", "")} className="interest-input" />
      </Field>
      <Field label="E-mail" name="email" state={state}>
        <input id="email" name="email" type="email" autoComplete="email" required maxLength={200} defaultValue={valueOf(state, "email", "")} className="interest-input" />
      </Field>
      <div className="join-row">
        <Field label="Curso (opcional)" name="course" state={state}>
          <input id="course" name="course" autoComplete="off" maxLength={120} defaultValue={valueOf(state, "course", "")} className="interest-input" />
        </Field>
        <Field label="Período (opcional)" name="period" state={state}>
          <input id="period" name="period" autoComplete="off" maxLength={60} placeholder="3º período" defaultValue={valueOf(state, "period", "")} className="interest-input" />
        </Field>
      </div>
      <Chips legend="No que você é bom?" name="skills" options={SKILLS} state={state} preset={preset?.skills} hint="Marque tudo o que puder ajudar." />
      <Chips legend="O que você quer fazer na Liga?" name="interests" options={INTERESTS} state={state} preset={preset?.interests} />
      <Field label="Horas por semana (opcional)" name="hoursPerWeek" state={state} hint="Uma estimativa honesta ajuda mais do que um número grande.">
        <input id="hoursPerWeek" name="hoursPerWeek" type="number" inputMode="numeric" min={1} max={40} defaultValue={valueOf(state, "hoursPerWeek", "")} className="interest-input" />
      </Field>
      <Field label="Portfólio ou texto seu (opcional)" name="portfolioUrl" state={state} hint="Um link https:// com algo que você fez: texto, arte, vídeo, site.">
        <input id="portfolioUrl" name="portfolioUrl" type="url" autoComplete="off" maxLength={300} defaultValue={valueOf(state, "portfolioUrl", "")} className="interest-input" />
      </Field>
      <Field label="Mais alguma coisa? (opcional)" name="message" state={state} hint="Qualquer outra forma em que você possa ajudar.">
        <textarea id="message" name="message" maxLength={1500} defaultValue={valueOf(state, "message", "")} className="interest-input interest-textarea" />
      </Field>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div className="interest-honey" aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="interest-field">
        <label className="interest-check">
          <input type="checkbox" name="consent" defaultChecked={checkedOf(state, "consent", false)} />
          <span>Concordo que a Liga use estes dados para avaliar minha candidatura e entrar em contato.</span>
        </label>
        {fieldError(state, "consent") && <p className="interest-error">{fieldError(state, "consent")}</p>}
        <p className="interest-hint">
          Os dados ficam só com a coordenação do diretório e a equipe da Liga. Você pode pedir a exclusão a qualquer momento escrevendo para {contactEmail}. Veja a <Link href="/privacy">política de privacidade</Link>.
        </p>
      </div>
      <Submit />
    </form>
  );
}
