/** Prisma's "unique constraint failed" (P2002), without importing the Prisma namespace into every action. */
export function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: unknown }).code === "P2002";
}
