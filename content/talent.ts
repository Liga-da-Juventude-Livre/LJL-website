// What a volunteer can offer and what they want to do. The `value` is stored in the database, so never rename one:
// change the label instead, or add a new value.

export const SKILLS = [
  { value: "writing", label: "Escrita e redação" },
  { value: "design", label: "Design gráfico" },
  { value: "video", label: "Vídeo e edição" },
  { value: "social", label: "Redes sociais" },
  { value: "events", label: "Organização de eventos" },
  { value: "research", label: "Pesquisa e dados" },
  { value: "code", label: "Programação e sites" },
  { value: "translation", label: "Tradução" },
  { value: "fundraising", label: "Parcerias e captação" },
  { value: "speaking", label: "Oratória e debate" },
  { value: "teaching", label: "Ensino e monitoria" },
  { value: "law", label: "Direito" },
] as const;

export const INTERESTS = [
  { value: "content", label: "Produzir conteúdo" },
  { value: "study", label: "Estudar e debater" },
  { value: "events", label: "Organizar eventos" },
  { value: "represent", label: "Representar a Liga na universidade" },
  { value: "partnerships", label: "Buscar parcerias" },
  { value: "other", label: "Outra forma de ajudar" },
] as const;

/** A member's role in the diretório. Stored on the membership. */
export const MEMBER_TITLES = [
  { value: "coordination", label: "Coordenação" },
  { value: "content", label: "Conteúdo e redação" },
  { value: "design", label: "Design" },
  { value: "video", label: "Vídeo" },
  { value: "social", label: "Redes sociais" },
  { value: "events", label: "Eventos" },
  { value: "research", label: "Pesquisa e estudos" },
  { value: "partnerships", label: "Parcerias" },
  { value: "member", label: "Membro" },
] as const;

export const memberTitleLabel = (value: string) => MEMBER_TITLES.find((t) => t.value === value)?.label ?? value;
export const skillLabel = (value: string) => SKILLS.find((s) => s.value === value)?.label ?? value;
export const interestLabel = (value: string) => INTERESTS.find((s) => s.value === value)?.label ?? value;
