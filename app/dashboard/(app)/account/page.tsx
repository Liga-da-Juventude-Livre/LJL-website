import { PageHeader } from "@/components/dashboard/ui";
import { requireUser } from "@/modules/auth/dal";
import { roleLabel } from "@/modules/auth/permissions";
import { PasswordForm } from "@/modules/auth/ui/password-form";

export const metadata = { title: "Minha conta" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ required?: string }> }) {
  const user = await requireUser({ allowMustChange: true });
  const { required } = await searchParams;
  return (
    <>
      <PageHeader title="Minha conta" subtitle={`${user.name} · ${user.email} · ${roleLabel[user.role]}`} />
      {user.mustChangePassword && (
        <p className="dash-alert dash-alert-warn" role="status">
          Sua senha é provisória. Escolha uma nova para continuar.
        </p>
      )}
      <section className="dash-card dash-card-narrow">
        <h2>Trocar senha</h2>
        <PasswordForm required={!!required} />
      </section>
    </>
  );
}
