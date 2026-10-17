import { z } from "zod";
import { MIN_PASSWORD } from "./password";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1),
});

export const changePasswordSchema = z
  .object({
    current: z.string().min(1, "Informe a senha atual."),
    next: z.string().min(MIN_PASSWORD, `Use pelo menos ${MIN_PASSWORD} caracteres.`).max(200),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, { path: ["confirm"], message: "As senhas não conferem." })
  .refine((d) => d.next !== d.current, { path: ["next"], message: "A nova senha precisa ser diferente da atual." });
