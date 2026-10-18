"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import type { FormState } from "@/lib/form-state";
import { failure, formToObject, invalid } from "@/lib/forms";
import { contactEmail } from "@/content/site";
import { applicationSchema } from "./schemas";

// The second place where the public writes to the database, so it is as strict as the chapter-request form:
// every field validated and capped, a honeypot, rate limits per IP and per e-mail, and no e-mail is sent from here.
const THANKS = "Candidatura recebida. A coordenação do diretório vai conversar com você pelo e-mail que informou. Enquanto isso, a trilha de leitura em /courses é um bom começo.";
const PER_IP_PER_HOUR = 5;
const PER_EMAIL_PER_DAY = 3;

async function hashedIp(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${process.env.IP_HASH_SALT ?? "ljl"}:${ip}`).digest("hex");
}

export async function submitApplication(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = formToObject(formData);
  if (raw.website) return { ok: THANKS }; // honeypot filled: act as if it worked, store nothing
  raw.skills = formData.getAll("skills").filter((v) => typeof v === "string").join(",");
  raw.interests = formData.getAll("interests").filter((v) => typeof v === "string").join(",");

  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const { chapterId, ...data } = parsed.data;

  if (data.skills.length === 0 && data.interests.length === 0 && !data.message) {
    return failure(raw, "Corrija os campos destacados.", { skills: ["Marque pelo menos uma competência, um interesse ou escreva uma mensagem."] });
  }

  let chapter: string | null = null;
  if (chapterId) {
    const found = await db.chapter.findFirst({ where: { id: chapterId, active: true }, select: { id: true } });
    if (!found) return failure(raw, "Corrija os campos destacados.", { chapterId: ["Escolha um diretório da lista."] });
    chapter = found.id;
  }

  const ipHash = await hashedIp();
  const [fromIp, fromEmail] = await Promise.all([
    db.application.count({ where: { ipHash, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } } }),
    db.application.count({ where: { email: data.email, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
  ]);
  if (fromIp >= PER_IP_PER_HOUR || fromEmail >= PER_EMAIL_PER_DAY) {
    return failure(raw, `Recebemos candidaturas demais em pouco tempo. Tente de novo mais tarde ou escreva para ${contactEmail}.`);
  }

  const fields = {
    name: data.name,
    course: data.course ?? null,
    period: data.period ?? null,
    skills: data.skills,
    interests: data.interests,
    hoursPerWeek: data.hoursPerWeek ?? null,
    portfolioUrl: data.portfolioUrl ?? null,
    message: data.message ?? null,
  };
  // Applying again to the same chapter refreshes the earlier application instead of duplicating it (the answer is
  // the same either way, so this does not reveal whether an e-mail is already in the pool).
  const existing = await db.application.findFirst({ where: { email: data.email, chapterId: chapter }, select: { id: true } });
  if (existing) {
    await db.application.update({ where: { id: existing.id }, data: { ...fields, consentAt: new Date(), ipHash } });
  } else {
    await db.application.create({ data: { ...fields, email: data.email, chapterId: chapter, consentAt: new Date(), ipHash } });
  }
  return { ok: THANKS };
}
