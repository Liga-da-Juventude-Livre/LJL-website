/** What every Server Action returns to its form (useActionState). Kept free of zod so client components can import it. */
export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  ok?: string;
  /** What the user typed, sent back on failure. React 19 resets a form after its action runs, so without this a
   *  validation error would wipe a long article. Password fields are never echoed. */
  values?: Record<string, string>;
};

export const fieldError = (state: FormState, name: string) => state.fieldErrors?.[name]?.[0];

/** Text/select value: what was submitted if the last attempt failed, otherwise the saved value. */
export const valueOf = (state: FormState, name: string, saved: string) => state.values?.[name] ?? saved;

/** Checkbox value: after a failed attempt an unchecked box is simply absent from the submitted values. */
export const checkedOf = (state: FormState, name: string, saved: boolean) => (state.values ? state.values[name] === "on" : saved);
