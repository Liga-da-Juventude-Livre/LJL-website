import { z } from "zod";
import { intField, optionalText, text } from "@/lib/forms";

const MAX_PEOPLE = 200;

/** A calendar date from <input type="date">, kept as UTC midnight so it never shifts a day in any time zone. */
const day = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data.")
  .transform((v) => new Date(`${v}T00:00:00Z`))
  .refine((d) => !Number.isNaN(d.getTime()), "Data inválida.")
  .refine((d) => d.getTime() <= Date.now() + 24 * 60 * 60 * 1000, "A data não pode ser no futuro.");

const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .transform((v) => (v === "" ? undefined : v))
  .pipe(z.email("E-mail inválido.").optional())
  .optional();

export const issueSchema = z.object({
  people: z.string().trim().min(1, "Informe pelo menos uma pessoa."),
  kind: z.enum(["COMPLETION", "PARTICIPATION"]),
  title: text(3, 160),
  hours: intField(1, 2000, "número de horas"),
  completedOn: day,
  courseId: optionalText(40),
  eventId: optionalText(40),
});

export const editSchema = z.object({
  recipientName: text(2, 120),
  recipientEmail: optionalEmail,
  kind: z.enum(["COMPLETION", "PARTICIPATION"]),
  title: text(3, 160),
  hours: intField(1, 2000, "número de horas"),
  completedOn: day,
});

export const revokeSchema = z.object({ reason: optionalText(300) });

export type Person = { name: string; email?: string };

/** One person per line: "Name" or "Name, email@example.com" (comma, semicolon or tab). Returns the people and any line problems. */
export function parsePeople(source: string): { people: Person[]; problems: string[] } {
  const people: Person[] = [];
  const problems: string[] = [];
  const lines = source.split(/\r?\n/).map((l, i) => ({ text: l.trim(), n: i + 1 })).filter((l) => l.text);
  if (lines.length > MAX_PEOPLE) problems.push(`No máximo ${MAX_PEOPLE} pessoas por vez.`);
  for (const { text: line, n } of lines.slice(0, MAX_PEOPLE)) {
    const [rawName, rawEmail] = line.split(/[,;\t]/, 2).map((p) => p.trim());
    if (rawName.length < 2 || rawName.length > 120) {
      problems.push(`Linha ${n}: o nome precisa ter entre 2 e 120 caracteres.`);
      continue;
    }
    if (rawEmail) {
      const email = z.email().safeParse(rawEmail.toLowerCase());
      if (!email.success) {
        problems.push(`Linha ${n}: e-mail inválido (${rawEmail}).`);
        continue;
      }
      people.push({ name: rawName, email: email.data });
    } else {
      people.push({ name: rawName });
    }
  }
  return { people, problems };
}
