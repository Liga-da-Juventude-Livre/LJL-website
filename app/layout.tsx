import type { Metadata, Viewport } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sans = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

const SITE_NAME = "Liga da Juventude Livre";
const DESCRIPTION =
  "Movimento estudantil apartidário pela liberdade econômica, pelo Estado de Direito e pela livre circulação de ideias. Artigos, revista acadêmica e núcleos em universidades de todo o Brasil.";

// Icons (favicon.ico, icon.svg, apple-icon.png), the social card (opengraph-image.png, twitter-image.png) and the web
// manifest come from the files next to this one. Pages only set their own `title`; the template adds the site name.
export const metadata: Metadata = {
  // Set SITE_URL in production (e.g. https://seu-dominio.org); without it Next resolves absolute URLs from the request.
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["liberdade econômica", "movimento estudantil", "Estado de Direito", "liberalismo", "universidades", "Brasil"],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: "Construindo a geração da liberdade econômica.",
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: "Construindo a geração da liberdade econômica." },
};

export const viewport: Viewport = { themeColor: "#006332" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${serif.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
