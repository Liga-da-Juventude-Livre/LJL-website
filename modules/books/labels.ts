export const LEVELS = [
  { value: "BEGINNER", label: "Iniciante" },
  { value: "INTERMEDIATE", label: "Intermediário" },
  { value: "ADVANCED", label: "Avançado" },
] as const;

export const levelLabel = (v: string) => LEVELS.find((l) => l.value === v)?.label ?? v;
