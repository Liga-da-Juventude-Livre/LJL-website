"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { FormState } from "@/lib/form-state";
import { failure, formToObject, invalid } from "@/lib/forms";
import { recordActivity } from "@/modules/activity/record";
import { requireUser } from "./dal";
import { fakeVerify, hashPassword, verifyPassword } from "./password";
import { changePasswordSchema, loginSchema } from "./schemas";
import { createSession, destroyCurrentSession, destroyOtherSessions } from "./session";

const MAX_FAILURES = 5;
const LOCK_MINUTES = 15;
// One message for every failure (unknown e-mail, wrong password, locked, disabled) so nothing leaks which e-mails exist.
const LOGIN_FAILED = "Não foi possível entrar. Confira o e-mail e a senha, ou tente de novo em alguns minutos.";

const safeNext = (next: unknown) => (typeof next === "string" && /^\/dashboard(\/|$|\?)/.test(next) ? next : "/dashboard");

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = formToObject(formData);
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return failure(raw, LOGIN_FAILED);
  const { email, password } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });
  const locked = user?.lockedUntil && user.lockedUntil > new Date();
  if (!user || !user.active || locked) {
    await fakeVerify(password);
    return failure(raw, LOGIN_FAILED);
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    const failures = user.failedLogins + 1;
    await db.user.update({
      where: { id: user.id },
      data:
        failures >= MAX_FAILURES
          ? { failedLogins: 0, lockedUntil: new Date(Date.now() + LOCK_MINUTES * 60_000) }
          : { failedLogins: failures },
    });
    return failure(raw, LOGIN_FAILED);
  }

  await db.user.update({ where: { id: user.id }, data: { failedLogins: 0, lockedUntil: null, lastLoginAt: new Date() } });
  await createSession(user.id);
  redirect(safeNext(raw.next));
}

export async function logout(): Promise<void> {
  await destroyCurrentSession();
  redirect("/dashboard/login");
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireUser({ allowMustChange: true });
  const raw = formToObject(formData);
  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);

  const user = await db.user.findUniqueOrThrow({ where: { id: me.id }, select: { passwordHash: true } });
  if (!(await verifyPassword(parsed.data.current, user.passwordHash))) {
    return failure(raw, "Corrija os campos destacados.", { current: ["Senha atual incorreta."] });
  }

  await db.user.update({
    where: { id: me.id },
    data: { passwordHash: await hashPassword(parsed.data.next), mustChangePassword: false },
  });
  await destroyOtherSessions(me.id);
  await recordActivity({ userId: me.id, action: "user.password", entity: "User", entityId: me.id, summary: "Trocou a própria senha" });
  if (formData.get("required")) redirect("/dashboard");
  return { ok: "Senha alterada. Os outros aparelhos foram desconectados." };
}
