export const KINDS = [
  { value: "TRACK", label: "Trilha de leitura", plural: "Trilhas de leitura" },
  { value: "COURSE", label: "Curso", plural: "Cursos" },
] as const;

export const kindLabel = (v: string) => KINDS.find((k) => k.value === v)?.label ?? v;

export const COURSE_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
