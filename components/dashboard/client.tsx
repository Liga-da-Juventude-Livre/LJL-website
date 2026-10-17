"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

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

/** A submit button that asks first. Put it inside a <form action={serverAction}>. */
export function ConfirmButton({ message, children, variant = "danger" }: { message: string; children: ReactNode; variant?: "ghost" | "danger" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`dash-btn dash-btn-${variant} dash-btn-sm`}
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {pending ? "Aguarde…" : children}
    </button>
  );
}
