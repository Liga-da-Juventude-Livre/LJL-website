export const APPLICATION_STATUSES = [
  { value: "NEW", label: "Nova", tone: "yellow" },
  { value: "TALKING", label: "Em conversa", tone: "green" },
  { value: "POOL", label: "Banco de talentos", tone: "green" },
  { value: "INVITED", label: "Convidada(o)", tone: "green" },
  { value: "MEMBER", label: "Membro", tone: "ink" },
  { value: "DECLINED", label: "Recusada", tone: "grey" },
  { value: "WITHDREW", label: "Desistiu", tone: "grey" },
] as const;

export const applicationStatus = (value: string) => APPLICATION_STATUSES.find((s) => s.value === value) ?? APPLICATION_STATUSES[0];
