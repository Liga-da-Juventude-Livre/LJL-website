import { z } from "zod";
import { SLUG_PATTERN } from "@/lib/slug";
import { optionalText, optionalUrl, text } from "@/lib/forms";
import { parseBrasiliaDateTime } from "@/lib/dates";

const dateTime = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `Informe ${label}.`)
    .refine((v) => !Number.isNaN(parseBrasiliaDateTime(v).getTime()), "Data inválida.")
    .transform(parseBrasiliaDateTime);

export const eventSchema = z
  .object({
    id: optionalText(40),
    title: text(3, 160),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .refine((v) => v === "" || SLUG_PATTERN.test(v), "Use só letras minúsculas, números e hífens.")
      .optional(),
    description: text(10, 3000),
    startsAt: dateTime("a data e a hora de início"),
    endsAt: z
      .string()
      .trim()
      .transform((v) => (v === "" ? undefined : parseBrasiliaDateTime(v)))
      .refine((d) => d === undefined || !Number.isNaN(d.getTime()), "Data inválida.")
      .optional(),
    location: optionalText(200),
    onlineUrl: optionalUrl,
    registrationUrl: optionalUrl,
    chapterId: optionalText(40),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  })
  .refine((d) => !d.endsAt || d.endsAt >= d.startsAt, { path: ["endsAt"], message: "O fim precisa ser depois do início." });
