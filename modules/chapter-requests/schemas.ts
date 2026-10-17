import { z } from "zod";
import { optionalText, text } from "@/lib/forms";

/** The public form. `website` is a honeypot: real people never see it, bots fill it. */
export const requestSchema = z.object({
  name: text(2, 100),
  email: z.string().trim().toLowerCase().pipe(z.email("E-mail inválido.")),
  university: text(2, 120),
  course: optionalText(120),
  message: optionalText(1000),
  consent: z.literal("on", { error: "Marque para podermos responder ao seu pedido." }),
});

/** What the team can change on a request. */
export const requestUpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "STARTED", "ARCHIVED"]),
  university: text(2, 120),
  notes: optionalText(2000),
});
