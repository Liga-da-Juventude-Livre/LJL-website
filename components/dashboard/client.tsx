"use client";

import { useFormStatus } from "react-dom";
import { useRef, type ReactNode } from "react";

export function SubmitButton({
  children,
  pendingLabel = "Salvando…",
  variant = "primary",
  name,
  value,
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "ghost" | "danger";
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`dash-btn dash-btn-${variant}`} disabled={pending} name={name} value={value}>
      {pending ? pendingLabel : children}
    </button>
  );
}

/** A button that asks first, in a dialog of the site's own instead of the browser's. Put it inside a <form action={serverAction}>:
 *  confirming submits that form. */
export function ConfirmButton({
  message,
  children,
  variant = "danger",
  title = "Tem certeza?",
  confirmLabel = "Confirmar",
}: {
  message: string;
  children: ReactNode;
  variant?: "ghost" | "danger";
  title?: string;
  confirmLabel?: string;
}) {
  const { pending } = useFormStatus();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button ref={trigger} type="button" className={`dash-btn dash-btn-${variant} dash-btn-sm`} disabled={pending} onClick={() => dialog.current?.showModal()}>
        {pending ? "Aguarde…" : children}
      </button>
      <dialog
        ref={dialog}
        className="dash-dialog"
        aria-labelledby="confirm-title"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close(); // a click on the backdrop
        }}
      >
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="dash-dialog-actions">
          <button type="button" className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => dialog.current?.close()} autoFocus>
            Cancelar
          </button>
          <button
            type="button"
            className={`dash-btn dash-btn-${variant === "danger" ? "solid-danger" : "primary"} dash-btn-sm`}
            onClick={() => {
              dialog.current?.close();
              trigger.current?.form?.requestSubmit();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}
