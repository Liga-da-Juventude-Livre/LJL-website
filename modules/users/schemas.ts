import { z } from "zod";
import { MIN_PASSWORD } from "@/modules/auth/password";
import { checkbox, optionalText, text } from "@/lib/forms";

const password = z.string().min(MIN_PASSWORD, `Use pelo menos ${MIN_PASSWORD} caracteres.`).max(200);

export const userSchema = z.object({
  id: optionalText(40),
  name: text(2, 100),
  email: z.string().trim().toLowerCase().pipe(z.email("E-mail inválido.")),
  role: z.enum(["ADMIN", "EDITOR", "AUTHOR"]),
  chapterId: optionalText(40),
  active: checkbox,
  // New account: required. Existing account: optional, and setting it resets the password.
  password: z
    .string()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(password.optional())
    .optional(),
});
