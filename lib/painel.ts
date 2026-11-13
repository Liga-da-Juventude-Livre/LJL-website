import "server-only";

// The Liga's internal panel (members, recruitment, articles written and reviewed by members). The public site shows
// the panel's published articles next to its own and forwards every /join application to the panel's recruitment
// funnel. Everything here fails soft: if the panel is unreachable, the site keeps working with its own data.
export const PAINEL_URL = (process.env.PAINEL_URL || "https://ligadajuventudelivre-gestao.netlify.app").replace(/\/$/, "");

export async function painelGet<T>(path: string, revalidate = 120): Promise<T | null> {
  try {
    const res = await fetch(`${PAINEL_URL}/api/${path}`, { next: { revalidate }, signal: AbortSignal.timeout(4000) });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function painelPost(path: string, body: unknown): Promise<void> {
  try {
    await fetch(`${PAINEL_URL}/api/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    // the application is already saved in this site's database; the panel copy is a convenience
  }
}
