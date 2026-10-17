import "server-only";
import { headers } from "next/headers";

/** The public origin of the site, used in links that leave the page (the QR code on a certificate, mailto bodies).
 *  Set SITE_URL in production; without it the request's own host is used, which is fine for local development. */
export async function siteUrl(): Promise<string> {
  const fromEnv = process.env.SITE_URL?.trim().replace(/\/+$/, "");
  if (fromEnv) return fromEnv;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
