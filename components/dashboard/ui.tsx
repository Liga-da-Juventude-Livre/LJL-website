import Link from "next/link";
import type { ReactNode } from "react";
import { fieldError, valueOf, type FormState } from "@/lib/form-state";
import { Icon } from "./icons";

// Presentational pieces shared by every dashboard module. No hooks, no server-only imports,
// so they work in both server pages and client forms.

export function PageHeader({ title, subtitle, actions, back }: { title: string; subtitle?: string; actions?: ReactNode; back?: { href: string; label: string } }) {
  return (
    <header className="dash-head">
      <div className="dash-head-text">
        {back && (
          <Link href={back.href} className="dash-back">
            <Icon name="arrowLeft" size={16} />
            {back.label}
          </Link>
        )}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="dash-head-actions">{actions}</div>}
    </header>
  );
}

/** A GET search form: submitting reloads the page with ?q=…, keeping the other filters in `keep`. */
export function SearchBox({ q, placeholder, keep = {} }: { q?: string; placeholder: string; keep?: Record<string, string | undefined> }) {
  return (
    <form className="dash-search" role="search">
      {Object.entries(keep).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <label className="sr-only" htmlFor="q">
        {placeholder}
      </label>
      <span className="dash-search-icon">
        <Icon name="search" size={18} />
      </span>
      <input id="q" name="q" defaultValue={q ?? ""} className="dash-input" placeholder={placeholder} autoComplete="off" />
      <button type="submit" className="dash-btn dash-btn-ghost">
        Buscar
      </button>
    </form>
  );
}

/** Previous/next links for a paged list; `hrefFor(page)` builds the address keeping the current filters. */
export function Pager({ page, pageCount, total, hrefFor }: { page: number; pageCount: number; total: number; hrefFor: (page: number) => string }) {
  if (pageCount <= 1) return null;
  return (
    <nav className="dash-pager" aria-label="Paginação">
      <span>
        Página {page} de {pageCount} · {total} {total === 1 ? "item" : "itens"}
      </span>
      <div>
        {page > 1 && (
          <Link className="dash-btn dash-btn-ghost dash-btn-sm" href={hrefFor(page - 1)}>
            ← Anterior
          </Link>
        )}
        {page < pageCount && (
          <Link className="dash-btn dash-btn-ghost dash-btn-sm" href={hrefFor(page + 1)}>
            Próxima →
          </Link>
        )}
      </div>
    </nav>
  );
}

export function LinkButton({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "ghost" }) {
  return (
    <Link href={href} className={`dash-btn dash-btn-${variant}`}>
      {children}
    </Link>
  );
}

export function Field({
  label,
  name,
  state,
  hint,
  children,
  wide,
  htmlFor,
  showAll,
}: {
  label: string;
  name: string;
  state?: FormState;
  hint?: string;
  children: ReactNode;
  wide?: boolean;
  /** The control's id, when the page holds several forms and ids must differ (defaults to `name`). */
  htmlFor?: string;
  /** Show every error for this field as a list (for fields that can have several, like one problem per line). */
  showAll?: boolean;
}) {
  const error = state ? fieldError(state, name) : undefined;
  const all = showAll ? (state?.fieldErrors?.[name] ?? []) : [];
  return (
    <div className={`dash-field${wide ? " dash-field-wide" : ""}`}>
      <label htmlFor={htmlFor ?? name}>{label}</label>
      {children}
      {showAll && all.length > 0 ? (
        <ul className="dash-field-errors" id={`${name}-error`}>
          {all.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : error ? (
        <p className="dash-field-error" id={`${name}-error`}>
          {error}
        </p>
      ) : (
        hint && <p className="dash-field-hint">{hint}</p>
      )}
    </div>
  );
}

/** A <select> that keeps what was chosen after a failed submit. React only applies defaultValue to a select when it
 *  mounts, so it is keyed by its current value to remount (and re-apply it) whenever that value changes. */
export function FormSelect({
  name,
  state,
  saved,
  required,
  children,
  id,
  onChange,
}: {
  name: string;
  state: FormState;
  saved: string;
  required?: boolean;
  children: ReactNode;
  id?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}) {
  const value = valueOf(state, name, saved);
  return (
    <select key={value} id={id ?? name} name={name} defaultValue={value} className="dash-select" required={required} onChange={onChange}>
      {children}
    </select>
  );
}

export function FormAlert({ state }: { state: FormState }) {
  if (state.error) return <p className="dash-alert dash-alert-error" role="alert">{state.error}</p>;
  if (state.ok) return <p className="dash-alert dash-alert-ok" role="status">{state.ok}</p>;
  return null;
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="dash-empty">
      <p className="dash-empty-title">{title}</p>
      {children && <p>{children}</p>}
    </div>
  );
}

const STATUS: Record<string, { label: string; tone: string }> = {
  DRAFT: { label: "Rascunho", tone: "grey" },
  IN_REVIEW: { label: "Em revisão", tone: "yellow" },
  PUBLISHED: { label: "Publicado", tone: "green" },
  ARCHIVED: { label: "Arquivado", tone: "ink" },
};
export const statusLabel = (s: string) => STATUS[s]?.label ?? s;

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, tone: "grey" };
  return <span className={`dash-badge dash-badge-${s.tone}`}>{s.label}</span>;
}

export function Pill({ children, tone = "grey" }: { children: ReactNode; tone?: "grey" | "green" | "yellow" | "ink" }) {
  return <span className={`dash-badge dash-badge-${tone}`}>{children}</span>;
}

export const dateBR = (d: Date | null | undefined) =>
  d ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" }).format(d) : "—";

/** A calendar date stored as UTC midnight (a day, not an instant): format it in UTC or it shows up a day early in Brazil. */
export const calendarDateBR = (d: Date | null | undefined) =>
  d ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(d) : "—";

export const dateTimeBR = (d: Date | null | undefined) =>
  d
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(d)
    : "—";

/** Value for <input type="datetime-local"> in Brasília time. */
export const toLocalInput = (d: Date | null | undefined) => {
  if (!d) return "";
  const parts = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" }).format(d);
  return parts.replace(" ", "T");
};
