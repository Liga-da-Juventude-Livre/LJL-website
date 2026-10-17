"use client";

import { useActionState } from "react";
import { ConfirmButton, SubmitButton } from "@/components/dashboard/client";
import { Field, FormAlert, FormSelect } from "@/components/dashboard/ui";
import { valueOf } from "@/lib/form-state";
import { deleteChapterRequest, updateChapterRequest } from "@/modules/chapter-requests/actions";
import { REQUEST_STATUSES } from "@/modules/chapter-requests/labels";

export function RequestForm({ id, initial }: { id: string; initial: { status: string; university: string; notes: string } }) {
  const [state, action] = useActionState(updateChapterRequest.bind(null, id), {});
  return (
    <>
      <form action={action} className="dash-form" noValidate>
        <FormAlert state={state} />
        <div className="dash-grid-2">
          <Field label="Situação" name="status" state={state}>
            <FormSelect name="status" state={state} saved={initial.status}>
              {REQUEST_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </FormSelect>
          </Field>
          <Field label="Universidade" name="university" state={state} hint="Padronize o nome (por exemplo, sempre “UFRJ”) para o contador juntar os pedidos do mesmo campus.">
            <input id="university" name="university" defaultValue={valueOf(state, "university", initial.university)} className="dash-input" required />
          </Field>
          <Field label="Notas internas" name="notes" state={state} hint="Só a equipe vê." wide>
            <textarea id="notes" name="notes" defaultValue={valueOf(state, "notes", initial.notes)} className="dash-textarea" />
          </Field>
        </div>
        <div className="dash-form-actions">
          <SubmitButton>Salvar</SubmitButton>
        </div>
      </form>
      <form action={deleteChapterRequest.bind(null, id)} className="dash-form-actions">
        <ConfirmButton message="Excluir este pedido e os dados da pessoa? Isso não pode ser desfeito.">Excluir pedido e dados</ConfirmButton>
      </form>
    </>
  );
}
