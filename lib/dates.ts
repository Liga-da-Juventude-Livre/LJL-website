// The Liga is in Brazil (no daylight saving since 2019), so form dates are read and shown as Brasília time (UTC-3).
export function parseBrasiliaDateTime(value: string): Date {
  return new Date(`${value.length === 16 ? `${value}:00` : value}-03:00`);
}

/** "2026-10-17" → "17 de outubro de 2026". */
export function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

/** The calendar day of an instant in Brasília, as "YYYY-MM-DD". */
export const brasiliaDay = (d: Date) => new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(d);
