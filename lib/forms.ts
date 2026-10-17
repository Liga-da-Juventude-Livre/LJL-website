import { z } from "zod";
import { isUploadedImageUrl } from "./media";

export type { FormState } from "./form-state";
import type { FormState } from "./form-state";

export function formToObject(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string") out[k] = v;
  return out;
}

const NEVER_ECHO = new Set(["password", "current", "next", "confirm"]);
const echo = (raw: Record<string, string>) => Object.fromEntries(Object.entries(raw).filter(([k]) => !NEVER_ECHO.has(k)));

/** Validation failed: show the field errors and hand back what was typed. */
export function invalid(error: z.ZodError, raw: Record<string, string>): FormState {
  return { error: "Corrija os campos destacados.", fieldErrors: z.flattenError(error).fieldErrors, values: echo(raw) };
}

/** Any other refusal (permission, duplicate…), optionally pinned to a field, also handing back what was typed. */
export function failure(raw: Record<string, string>, error: string, fieldErrors?: Record<string, string[]>): FormState {
  return { error, fieldErrors, values: echo(raw) };
}

// zod helpers for HTML form values (everything arrives as a string, empty means "not filled").
export const text = (min = 1, max = 200) => {
  const base = z.string().trim().min(1, "Preencha este campo.");
  return (min > 1 ? base.min(min, `Mínimo de ${min} caracteres.`) : base).max(max, `Máximo de ${max} caracteres.`);
};

/** Address of an uploaded image (see lib/media.ts). Empty means "no image"; anything else than one of our Blob addresses is refused. */
export const uploadedImage = (scope: "posts" | "books") =>
  z
    .string()
    .trim()
    .refine((v) => v === "" || isUploadedImageUrl(v, scope), "Imagem inválida. Envie de novo.")
    .transform((v) => (v === "" ? null : v))
    .optional();

export const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max, `Máximo de ${max} caracteres.`)
    .transform((v) => (v === "" ? undefined : v))
    .optional();

export const optionalUrl = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .pipe(z.url({ protocol: /^https$/, error: "Use um endereço completo, começando com https://" }).optional())
  .optional();

export const checkbox = z.preprocess((v) => v === "on" || v === "true", z.boolean());

export const intField = (min: number, max: number, label = "número") =>
  z.coerce.number({ error: `Informe um ${label}.` }).int(`Informe um ${label} inteiro.`).min(min, `Mínimo ${min}.`).max(max, `Máximo ${max}.`);

export const optionalInt = (min: number, max: number, label = "número") =>
  z
    .string()
    .trim()
    .transform((v) => (v === "" ? undefined : Number(v)))
    .pipe(z.number({ error: `Informe um ${label}.` }).int(`Informe um ${label} inteiro.`).min(min, `Mínimo ${min}.`).max(max, `Máximo ${max}.`).optional())
    .optional();

export const optionalDate = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : new Date(v)))
  .refine((d) => d === undefined || !Number.isNaN(d.getTime()), "Data inválida.")
  .optional();
