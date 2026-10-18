import { z } from "zod";
import { INTERESTS, SKILLS } from "@/content/talent";
import { optionalInt, optionalText, optionalUrl, text } from "@/lib/forms";

// Multi-select values travel as one comma-separated string (see the actions), so a failed submit can echo them back.
const picks = (allowed: readonly { value: string }[]) =>
  z
    .string()
    .transform((v) => v.split(",").map((x) => x.trim()).filter(Boolean))
    .pipe(z.array(z.string()).max(allowed.length))
    .refine((list) => list.every((v) => allowed.some((a) => a.value === v)), "Opção inválida.")
    .transform((list) => [...new Set(list)]);

/** The public form. `website` is a honeypot: real people never see it, bots fill it. */
export const applicationSchema = z.object({
  name: text(2, 100),
  email: z.string().trim().toLowerCase().pipe(z.email("E-mail inválido.")),
  /** A chapter id, or empty for "none near me". Checked against active chapters in the action. */
  chapterId: optionalText(40),
  course: optionalText(120),
  period: optionalText(60),
  skills: picks(SKILLS),
  interests: picks(INTERESTS),
  hoursPerWeek: optionalInt(1, 40, "número de horas"),
  portfolioUrl: optionalUrl,
  message: optionalText(1500),
  consent: z.literal("on", { error: "Marque para podermos responder à sua candidatura." }),
});

/** What staff can change on an application. */
export const applicationUpdateSchema = z.object({
  status: z.enum(["NEW", "TALKING", "POOL", "INVITED", "MEMBER", "DECLINED", "WITHDREW"]),
  notes: optionalText(2000),
});
