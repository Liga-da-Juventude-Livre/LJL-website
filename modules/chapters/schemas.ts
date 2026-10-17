import { z } from "zod";
import { SLUG_PATTERN } from "@/lib/slug";
import { checkbox, optionalDate, optionalText, text } from "@/lib/forms";

export const chapterSchema = z.object({
  id: optionalText(40),
  name: text(3, 120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => v === "" || SLUG_PATTERN.test(v), "Use só letras minúsculas, números e hífens.")
    .optional(),
  university: text(2, 120),
  city: text(2, 80),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .refine((v) => v === "" || /^[A-Z]{2}$/.test(v), "Use a sigla com duas letras, como RJ.")
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
  description: optionalText(800),
  contactEmail: z
    .string()
    .trim()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(z.email("E-mail inválido.").optional())
    .optional(),
  foundedAt: optionalDate,
  active: checkbox,
});
