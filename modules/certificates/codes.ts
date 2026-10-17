import { randomInt } from "node:crypto";

// LJL-XXXX-XXXX-XXXX: 12 random characters from an alphabet without look-alikes (no 0/O, 1/I), about 60 bits.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCode(): string {
  const group = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return `LJL-${group()}-${group()}-${group()}`;
}

/** Accepts the code however a person types it (lower case, no dashes, spaces) and returns the canonical form, or null. */
export function normalizeCode(input: string): string | null {
  let c = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (c.length === 15 && c.startsWith("LJL")) c = c.slice(3);
  if (c.length !== 12 || [...c].some((ch) => !ALPHABET.includes(ch))) return null;
  return `LJL-${c.slice(0, 4)}-${c.slice(4, 8)}-${c.slice(8)}`;
}
