import { redirect } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { getSessionUser } from "@/modules/auth/dal";
import { LoginForm } from "@/modules/auth/ui/login-form";

export const metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getSessionUser()) redirect("/dashboard");
  const { next } = await searchParams;
  return (
    <div className="dash dash-login">
      <div className="dash-login-card">
        <LogoMark size={52} />
        <h1>Painel da Liga</h1>
        <p>Acesso restrito a quem escreve e cuida do conteúdo.</p>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
