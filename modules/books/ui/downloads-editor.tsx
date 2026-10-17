"use client";

import { useActionState } from "react";
import { ConfirmButton, SubmitButton } from "@/components/dashboard/client";
import { valueOf } from "@/lib/form-state";
import { Field, FormAlert, Pill, dateBR } from "@/components/dashboard/ui";
import { addDownload, removeDownload, verifyDownload } from "@/modules/books/actions";

export type DownloadRow = {
  id: string;
  url: string;
  language: string;
  source: string;
  edition: string;
  verifiedAt: Date | null;
};

/** Free editions of one book. Only add links the rightsholder itself offers for free; "conferido" records when someone last checked. */
export function DownloadsEditor({ bookId, downloads }: { bookId: string; downloads: DownloadRow[] }) {
  const [state, action] = useActionState(addDownload.bind(null, bookId), {});
  return (
    <div className="dash-stack">
      {downloads.length === 0 ? (
        <p className="dash-field-hint">Nenhuma edição gratuita cadastrada.</p>
      ) : (
        <div className="dash-sublist">
          {downloads.map((d) => (
            <div key={d.id} className="dash-subitem">
              <a href={d.url} target="_blank" rel="noopener noreferrer">
                {d.url}
              </a>
              <p className="dash-sub">
                {d.language} · {d.source} · {d.edition}
              </p>
              <div className="dash-actions-cell" style={{ justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                {d.verifiedAt ? <Pill tone="green">Conferido em {dateBR(d.verifiedAt)}</Pill> : <Pill tone="yellow">Não conferido</Pill>}
                <div className="dash-actions-cell">
                  <form action={verifyDownload.bind(null, d.id)} className="dash-inline-form">
                    <ConfirmButton variant="ghost" message="Você abriu o link e confirmou que a edição é gratuita e autorizada pelo editor?">
                      Marcar como conferido
                    </ConfirmButton>
                  </form>
                  <form action={removeDownload.bind(null, d.id)} className="dash-inline-form">
                    <ConfirmButton message="Remover esta edição?">Remover</ConfirmButton>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <form action={action} className="dash-form" noValidate>
        <FormAlert state={state} />
        <div className="dash-grid-2">
          <Field label="Endereço do arquivo ou da página" name="url" state={state} wide>
            <input id="url" name="url" defaultValue={valueOf(state, "url", "")} type="url" className="dash-input" placeholder="https://" required />
          </Field>
          <Field label="Idioma" name="language" state={state}>
            <input id="language" name="language" defaultValue={valueOf(state, "language", "")} className="dash-input" placeholder="Português" required />
          </Field>
          <Field label="Quem publica" name="source" state={state}>
            <input id="source" name="source" defaultValue={valueOf(state, "source", "")} className="dash-input" placeholder="Mises Institute" required />
          </Field>
          <Field label="Edição" name="edition" state={state} wide>
            <input id="edition" name="edition" defaultValue={valueOf(state, "edition", "")} className="dash-input" placeholder="Título da edição como o editor a chama" required />
          </Field>
          <label className="dash-check dash-field-wide">
            <input type="checkbox" name="verified" />
            <span>Abri o link e confirmei que é gratuito e autorizado pelo editor</span>
          </label>
        </div>
        <div>
          <SubmitButton pendingLabel="Adicionando…">Adicionar edição gratuita</SubmitButton>
        </div>
      </form>
    </div>
  );
}
