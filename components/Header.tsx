"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { LogoMark } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const current = (href: string) => (!href.includes("#") && pathname.startsWith(href) ? "page" : undefined);

  useEffect(() => {
    const on = () => setScrolled(scrollY > 8);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="header-in">
        <Link className="brand" href="/" aria-label="Liga da Juventude Livre, início">
          <LogoMark size={30} />
          <span className="brand-name">
            Liga da <b>Juventude Livre</b>
          </span>
        </Link>
        <nav className="nav-links" aria-label="Principal">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} aria-current={current(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn-ink btn-sm header-cta" href="/#join">
          Junte-se
        </Link>
        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav aria-label="Principal (celular)">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} aria-current={current(l.href)} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link className="btn btn-yellow" href="/#join" onClick={() => setOpen(false)}>
            Junte-se à Liga
          </Link>
        </nav>
      </div>
    </header>
  );
}
