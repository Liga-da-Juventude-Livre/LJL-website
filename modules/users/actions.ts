"use server";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { isUniqueViolation } from "@/lib/db-errors";
import type { FormState } from "@/lib/form-state";
import { redirectWithNotice } from "@/lib/flash";
import { failure, formToObject, invalid } from "@/lib/forms";
import { recordActivity } from "@/modules/activity/record";
import { requireRole } from "@/modules/auth/dal";
import { hashPassword } from "@/modules/auth/password";
import { userSchema } from "./schemas";

export async function saveUser(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireRole("ADMIN");
  const raw = formToObject(formData);
  const parsed = userSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const pinned = (field: string, message: string) => failure(raw, "Corrija os campos destacados.", { [field]: [message] });
  const { id, password, chapterId, ...data } = parsed.data;

  if (data.role === "COORDINATOR" && !chapterId) return pinned("chapterId", "Escolha o diretório que esta pessoa coordena.");
  if (!id && !password) return pinned("password", "Defina uma senha provisória.");

  if (id) {
    const current = await db.user.findUnique({ where: { id }, select: { role: true, active: true } });
    if (!current) notFound();
    // Never lock the team out: keep at least one active administrator, and an admin cannot demote or disable themselves.
    const losesAdmin = current.role === "ADMIN" && current.active && (data.role !== "ADMIN" || !data.active);
    if (losesAdmin) {
      if (id === me.id) return failure(raw, "Você não pode remover o próprio acesso de administrador. Peça a outro administrador.");
      const admins = await db.user.count({ where: { role: "ADMIN", active: true } });
      if (admins <= 1) return failure(raw, "É preciso manter pelo menos um administrador ativo.");
    }
  }

  try {
    if (id) {
      await db.user.update({
        where: { id },
        data: {
          ...data,
          chapterId: chapterId ?? null,
          ...(password ? { passwordHash: await hashPassword(password), mustChangePassword: true, failedLogins: 0, lockedUntil: null } : {}),
        },
      });
      // A disabled account or a reset password must stop working immediately.
      if (!data.active || password) await db.session.deleteMany({ where: { userId: id } });
    } else {
      await db.user.create({
        data: { ...data, chapterId: chapterId ?? null, passwordHash: await hashPassword(password!), mustChangePassword: true },
      });
    }
  } catch (error) {
    if (isUniqueViolation(error)) return pinned("email", "Já existe uma conta com esse e-mail.");
    throw error;
  }

  await recordActivity({
    userId: me.id,
    action: id ? (password ? "user.reset" : "user.update") : "user.create",
    entity: "User",
    entityId: id,
    summary: `${id ? (password ? "Redefiniu a senha de" : "Editou") : "Criou a conta de"} ${data.name}`,
  });
  redirectWithNotice("/dashboard/users", id ? (password ? "Senha provisória definida. A pessoa foi desconectada." : "Conta atualizada.") : "Conta criada.");
}

/** Permanently removes an account. What the person wrote stays (their name remains as the byline); only the login goes.
 *  Refused for yourself and for the last active administrator. */
export async function deleteUser(id: string): Promise<void> {
  const me = await requireRole("ADMIN");
  if (id === me.id) redirectWithNotice(`/dashboard/users/${id}`, "Você não pode excluir a própria conta.");
  const target = await db.user.findUnique({ where: { id }, select: { id: true, name: true, role: true, active: true } });
  if (!target) notFound();
  if (target.role === "ADMIN" && target.active) {
    const admins = await db.user.count({ where: { role: "ADMIN", active: true } });
    if (admins <= 1) redirectWithNotice(`/dashboard/users/${id}`, "É preciso manter pelo menos um administrador ativo.");
  }
  await db.user.delete({ where: { id } }); // sessions go with it; content, certificates and logs keep their records
  await recordActivity({ userId: me.id, action: "user.delete", entity: "User", summary: `Excluiu a conta de ${target.name}` });
  redirectWithNotice("/dashboard/users", "Conta excluída.");
}

/** Switches an account off or on from the list, without opening the form. Same safeguards as editing. */
export async function setUserActive(id: string, active: boolean): Promise<void> {
  const me = await requireRole("ADMIN");
  const target = await db.user.findUnique({ where: { id }, select: { name: true, role: true, active: true } });
  if (!target) notFound();
  if (!active) {
    if (id === me.id) redirectWithNotice("/dashboard/users", "Você não pode desativar a própria conta.");
    if (target.role === "ADMIN" && target.active && (await db.user.count({ where: { role: "ADMIN", active: true } })) <= 1) {
      redirectWithNotice("/dashboard/users", "É preciso manter pelo menos um administrador ativo.");
    }
  }
  await db.user.update({ where: { id }, data: { active } });
  if (!active) await db.session.deleteMany({ where: { userId: id } });
  await recordActivity({ userId: me.id, action: active ? "user.activate" : "user.deactivate", entity: "User", entityId: id, summary: `${active ? "Reativou" : "Desativou"} a conta de ${target.name}` });
  redirectWithNotice("/dashboard/users", active ? "Conta reativada." : "Conta desativada.");
}
