"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LogoMark } from "@/components/Logo";
import { Icon, type IconName } from "./icons";

export type NavItem = { href: string; label: string; icon: IconName; badge?: number };
export type NavGroup = { title?: string; items: NavItem[] };

// The sidebar. On wide screens it is fixed at the left; on narrow ones it becomes a top bar with a menu button that
// slides the same menu in from the left. `footer` is the signed-in user's block, rendered by the server.
export function Sidebar({ groups, footer }: { groups: NavGroup[]; footer: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer when the page changes (adjusting state while rendering, as React recommends, instead of in an effect).
  const [seen, setSeen] = useState(pathname);
  if (seen !== pathname) {
    setSeen(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="dash-topbar">
        <Link href="/dashboard" className="dash-brand" aria-label="Painel da Liga">
          <LogoMark size={28} />
          <span>
            Painel <b>da Liga</b>
          </span>
        </Link>
        <button type="button" className="dash-menu-btn" aria-expanded={open} aria-controls="dash-side" onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? "close" : "menu"} />
          <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
        </button>
      </div>
      {open && <div className="dash-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      <aside id="dash-side" className={`dash-side${open ? " open" : ""}`}>
        <Link href="/dashboard" className="dash-brand dash-brand-side" aria-label="Painel da Liga">
          <LogoMark size={30} />
          <span>
            Painel <b>da Liga</b>
          </span>
        </Link>
        <nav className="dash-nav" aria-label="Painel">
          {groups.map((g, i) => (
            <div key={g.title ?? i} className="dash-nav-group">
              {g.title && <p className="dash-nav-title">{g.title}</p>}
              {g.items.map((item) => {
                const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                    {item.badge ? <span className="dash-nav-badge">{item.badge > 99 ? "99+" : item.badge}</span> : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        {footer}
      </aside>
    </>
  );
}
