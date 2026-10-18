import { z } from "zod";
import { MEMBER_TITLES } from "@/content/talent";
import { checkbox, optionalText } from "@/lib/forms";
import { text } from "@/lib/forms";

/** A calendar date from <input type="date">, kept as UTC midnight so it never shifts a day in any time zone. */
const day = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data.")
  .transform((v) => new Date(`${v}T00:00:00Z`))
  .refine((d) => !Number.isNaN(d.getTime()), "Data inválida.");

const optionalDay = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .pipe(day.optional())
  .optional();

export const memberSchema = z.object({
  id: optionalText(40),
  chapterId: optionalText(40),
  name: text(2, 100),
  email: z.string().trim().toLowerCase().pipe(z.email("E-mail inválido.")),
  title: z.enum(MEMBER_TITLES.map((t) => t.value) as [string, ...string[]], { error: "Escolha uma função." }),
  startedOn: day,
  endsOn: optionalDay,
  mentor: checkbox,
  notes: optionalText(2000),
  applicationId: optionalText(40),
  userId: optionalText(40),
});
