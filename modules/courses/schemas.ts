import { z } from "zod";
import { SLUG_PATTERN } from "@/lib/slug";
import { checkbox, optionalInt, optionalText, text, intField } from "@/lib/forms";

export const courseSchema = z
  .object({
  id: optionalText(40),
  title: text(3, 120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => v === "" || SLUG_PATTERN.test(v), "Use só letras minúsculas, números e hífens.")
    .optional(),
  summary: text(10, 300),
  description: optionalText(20000),
  kind: z.enum(["TRACK", "COURSE"]),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  frontId: optionalText(40),
  durationWeeks: optionalInt(1, 104, "número de semanas"),
  workloadHours: optionalInt(1, 2000, "número de horas"),
  issuesCertificate: checkbox,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  sortOrder: intField(0, 999, "número"),
}).refine((d) => !d.issuesCertificate || d.workloadHours !== undefined, {
  path: ["workloadHours"],
  message: "Informe a carga horária para poder emitir certificado.",
});

export const lessonSchema = z.object({
  title: text(3, 140),
  summary: optionalText(300),
  body: optionalText(30000),
  bookId: optionalText(40),
  // One question per line in the form.
  questions: z
    .string()
    .default("")
    .transform((v) => v.split("\n").map((q) => q.trim()).filter(Boolean))
    .pipe(z.array(z.string().max(300, "Cada pergunta pode ter até 300 caracteres.")).max(10, "No máximo 10 perguntas.")),
  task: optionalText(600),
  estimatedMinutes: optionalInt(1, 1000, "tempo em minutos"),
});
