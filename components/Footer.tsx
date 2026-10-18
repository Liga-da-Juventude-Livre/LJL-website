import Link from "next/link";
import { contactEmail, firstChapter } from "@/content/site";
import { LogoMark } from "./Logo";

const n = (i: number) => ({ "--i": i }) as React.CSSProperties;

const columns = [
  {
    title: "A Liga",
    links: [
      { href: "/#vision", label: "Visão" },
      { href: "/#fronts", label: "Frentes" },
      { href: "/#history", label: "História" },
      { href: "/join", label: "Entre na Liga" },
      { href: "/chapters", label: "Abra um diretório" },
      { href: "/#get-involved", label: "Participe" },
      { href: "/#faq", label: "Perguntas" },
    ],
  },
  {
    title: "Conteúdo",
    links: [
      { href: "/library", label: "Biblioteca" },
      { href: "/courses", label: "Cursos e trilhas" },
      { href: "/verify", label: "Verificar certificado" },
      { href: "/privacy", label: "Privacidade" },
      { href: "/library#downloads", label: "Livros para baixar" },
      { href: "/articles", label: "Artigos" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap" data-reveal>
        <div className="footer-top">
          <div className="footer-brand rise">
            <LogoMark size={40} />
            <p>
              Movimento estudantil apartidário pela liberdade econômica, pelo Estado de Direito e pela livre circulação
              de ideias.
            </p>
          </div>
          <div className="footer-cols">
            {columns.map((col, i) => (
              <div key={col.title} className="rise" style={n(i + 1)}>
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="rise" style={n(3)}>
              <h4>Diretórios</h4>
              <ul>
                <li>{firstChapter.university}</li>
              </ul>
              <h4 className="footer-h4-gap">Contato</h4>
              <ul>
                <li>
                  <a className="footer-email" href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="legal">© 2026 Liga da Juventude Livre.</p>
      </div>
    </footer>
  );
}
