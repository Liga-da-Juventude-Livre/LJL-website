import "server-only";
import { db } from "@/lib/db";

type Activity = { userId: string; action: string; entity: string; entityId?: string; summary: string };

/** Writes one audit line. A failure here is logged but never blocks the action that triggered it. */
export async function recordActivity(a: Activity): Promise<void> {
  try {
    await db.activityLog.create({ data: a });
  } catch (error) {
    console.error("Falha ao registrar atividade", a.action, error);
  }
}
