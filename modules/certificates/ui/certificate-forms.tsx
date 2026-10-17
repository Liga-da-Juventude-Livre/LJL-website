"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/dashboard/client";
import { Field, FormAlert, FormSelect } from "@/components/dashboard/ui";
import { valueOf } from "@/lib/form-state";
import { revokeCertificate, updateCertificate } from "@/modules/certificates/actions";

export type CertificateValues = {
  recipientName: string;
  recipientEmail: string;
  kind: string;
  title: string;
  hours: string;
  completedOn: string;
};

/** Corrections after issuing (a typo in the name, say). The code and the QR stay the same. */
export function EditCertificateForm({ id, initial }: { id: string; initial: CertificateValues }) {
  const [state, action] = useActionState(updateCertificate.bind(null, id), {});
  return (
    <form action={action} className="dash-form" noValidate>
      <FormAlert state={state} />
      <div className="dash-grid-2">
        <Field label="Nome" name="recipientName" state={state}>
          <input id="recipientName" name="recipientName" defaultValue={valueOf(state, "recipientName", initial.recipientName)} className="dash-input" required />
        </Field>
        <Field label="E-mail (opcional)" name="recipientEmail" state={state} hint="Só para enviar o certificado. Nunca aparece na página pública.">
          <input id="recipientEmail" name="recipientEmail" type="email" defaultValue={valueOf(state, "recipientEmail", initial.recipientEmail)} className="dash-input" />
        </Field>
        <Field label="Título" name="title" state={state} wide>
          <input id="title" name="title" defaultValue={valueOf(state, "title", initial.title)} className="dash-input" required />
        </Field>
        <Field label="Tipo" name="kind" state={state}>
          <FormSelect name="kind" state={state} saved={initial.kind}>
            <option value="COMPLETION">Concluiu</option>
            <option value="PARTICIPATION">Participou de</option>
          </FormSelect>
        </Field>
        <Field label="Carga horária (horas)" name="hours" state={state}>
          <input id="hours" name="hours" type="number" min={1} defaultValue={valueOf(state, "hours", initial.hours)} className="dash-input" required />
        </Field>
        <Field label="Data de conclusão ou participação" name="completedOn" state={state}>
          <input id="completedOn" name="completedOn" type="date" defaultValue={valueOf(state, "completedOn", initial.completedOn)} className="dash-input" required />
        </Field>
      </div>
      <div className="dash-form-actions">
        <SubmitButton>Salvar correções</SubmitButton>
      </div>
    </form>
  );
}

export function RevokeCertificateForm({ id }: { id: string }) {
  const [state, action] = useActionState(revokeCertificate.bind(null, id), {});
  return (
    <form action={action} className="dash-form" noValidate>
      <FormAlert state={state} />
      <Field label="Motivo (opcional)" name="reason" state={state} hint="Só a equipe vê. A página pública mostra apenas que o certificado foi revogado.">
        <input id="reason" name="reason" defaultValue={valueOf(state, "reason", "")} className="dash-input" maxLength={300} />
      </Field>
      <div className="dash-form-actions">
        <SubmitButton variant="danger">Revogar certificado</SubmitButton>
      </div>
    </form>
  );
}
