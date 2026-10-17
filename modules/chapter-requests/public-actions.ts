"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import type { FormState } from "@/lib/form-state";
import { failure, formToObject, invalid } from "@/lib/forms";
import { slugify } from "@/lib/slug";
import { contactEmail } from "@/content/site";
import { requestSchema } from "./schemas";

// The one place where anyone on the internet can write to the database, so it is deliberately strict:
// every field validated and length-capped, a honeypot, rate limits per IP and per e-mail, and no e-mail is
// sent from here (so it cannot be used to spam third parties).
const THANKS = "Pedido recebido. Alguém da Liga vai responder pelo e-mail que você informou.";
const PER_IP_PER_HOUR = 5;
const PER_EMAIL_PER_DAY = 2;

async function hashedIp(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${process.env.IP_HASH_SALT ?? "ljl"}:${ip}`).digest("hex");
}

export async function submitChapterRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = formToObject(formData);
  if (raw.website) return { ok: THANKS }; // honeypot filled: act as if it worked, store nothing

  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error, raw);
  const { name, email, university, course, message } = parsed.data;

  const ipHash = await hashedIp();
  const [fromIp, fromEmail] = await Promise.all([
    db.chapterRequest.count({ where: { ipHash, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } } }),
    db.chapterRequest.count({ where: { email, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
  ]);
  if (fromIp >= PER_IP_PER_HOUR || fromEmail >= PER_EMAIL_PER_DAY) {
    return failure(raw, `Recebemos pedidos demais em pouco tempo. Tente de novo mais tarde ou escreva para ${contactEmail}.`);
  }

  await db.chapterRequest.create({
    data: { name, email, university, universityKey: slugify(university), course: course ?? null, message: message ?? null, consentAt: new Date(), ipHash },
  });
  return { ok: THANKS };
}
