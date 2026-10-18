"use client";

import { useActionState } from "react";
import { ConfirmButton, SubmitButton } from "@/components/dashboard/client";
import { Field, FormAlert, FormSelect } from "@/components/dashboard/ui";
import { valueOf } from "@/lib/form-state";
import { deleteApplication, updateApplication } from "@/modules/applications/actions";
import { APPLICATION_STATUSES } from "@/modules/applications/labels";

export function ApplicationForm({ id, initial }: { id: string; initial: { status: string; notes: string } }) {
  const [state, action] = useActionState(updateApplication.bind(null, id), {});
  return (
    <>
      <form action={action} className="dash-form" noValidate>
        <FormAlert state={state} />
        <div className="dash-grid-2">
          <Field label="Situação" name="status" state={state}>
            <FormSelect name="status" state={state} saved={initial.status}>
              {APPLICATION_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </FormSelect>
          </Field>
          <Field label="Notas internas" name="notes" state={state} hint="Só a coordenação e a equipe veem." wide>
            <textarea id="notes" name="notes" defaultValue={valueOf(state, "notes", initial.notes)} className="dash-textarea" />
          </Field>
        </div>
        <div className="dash-form-actions">
          <SubmitButton>Salvar</SubmitButton>
        </div>
      </form>
      <form action={deleteApplication.bind(null, id)} className="dash-form-actions">
        <ConfirmButton message="Excluir esta candidatura e os dados da pessoa? Isso não pode ser desfeito.">Excluir candidatura e dados</ConfirmButton>
      </form>
    </>
  );
}
