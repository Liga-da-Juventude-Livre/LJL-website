export const REQUEST_STATUSES = [
  { value: "NEW", label: "Novo", tone: "yellow" },
  { value: "CONTACTED", label: "Em contato", tone: "green" },
  { value: "STARTED", label: "Diretório iniciado", tone: "green" },
  { value: "ARCHIVED", label: "Arquivado", tone: "grey" },
] as const;

export const requestStatus = (value: string) => REQUEST_STATUSES.find((s) => s.value === value) ?? REQUEST_STATUSES[0];
