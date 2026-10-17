import { Empty, LinkButton, PageHeader } from "@/components/dashboard/ui";

export const metadata = { title: "Página não encontrada" };

// Shown inside the dashboard shell (menu and all) for a wrong address or a record that no longer exists.
export default function DashboardNotFound() {
  return (
    <>
      <PageHeader title="Página não encontrada" />
      <Empty title="Esse endereço não existe no painel.">O item pode ter sido excluído ou o link estar errado.</Empty>
      <p style={{ marginTop: 16 }}>
        <LinkButton href="/dashboard">Voltar à visão geral</LinkButton>
      </p>
    </>
  );
}
