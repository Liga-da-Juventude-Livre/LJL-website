import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/modules/auth/actions";
import { canManageContent, canManageUsers, roleLabel } from "@/modules/auth/permissions";
import type { SessionUser } from "@/modules/auth/dal";
import { LogoMark } from "@/components/Logo";
import { NavLinks, type NavItem } from "./NavLinks";

// The menu follows the role: authors see only what they can use.
function navFor(user: SessionUser): NavItem[] {
  const items: NavItem[] = [
    { href: "/dashboard", label: "Visão geral" },
    { href: "/dashboard/articles", label: "Artigos" },
    { href: "/dashboard/news", label: "Notícias" },
  ];
  if (canManageContent(user)) {
    items.push(
      { href: "/dashboard/books", label: "Livros" },
      { href: "/dashboard/courses", label: "Cursos" },
      { href: "/dashboard/events", label: "Eventos" },
      { href: "/dashboard/certificates", label: "Certificados" },
      { href: "/dashboard/chapters", label: "Diretórios" },
      { href: "/dashboard/chapter-requests", label: "Pedidos de diretório" },
    );
  }
  if (canManageUsers(user)) items.push({ href: "/dashboard/users", label: "Usuários" });
  return items;
}

export function Shell({ user, children }: { user: SessionUser; children: ReactNode }) {
  return (
    <div className="dash dash-shell">
      <aside className="dash-side">
        <Link href="/dashboard" className="dash-brand" aria-label="Painel da Liga">
          <LogoMark size={30} />
          <span>
            Painel <b>da Liga</b>
          </span>
        </Link>
        <NavLinks items={navFor(user)} />
        <div className="dash-user">
          <Link href="/dashboard/account" className="dash-user-link">
            <span className="dash-user-name">{user.name}</span>
            <span className="dash-user-role">{roleLabel[user.role]}</span>
          </Link>
          <div className="dash-user-actions">
            <Link href="/" target="_blank">
              Ver o site ↗
            </Link>
            <form action={logout}>
              <button type="submit">Sair</button>
            </form>
          </div>
        </div>
      </aside>
      <main className="dash-main" id="content">
        {children}
      </main>
    </div>
  );
}
