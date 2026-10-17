import type { Metadata, Viewport } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sans = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  // Set SITE_URL in production (e.g. https://seu-dominio.org); without it Next resolves absolute URLs from the request.
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title: "Liga da Juventude Livre",
  description:
    "Movimento estudantil apartidário pela liberdade econômica, pelo Estado de Direito e pela livre circulação de ideias. Artigos, revista acadêmica e núcleos em universidades de todo o Brasil.",
  openGraph: {
    title: "Liga da Juventude Livre",
    description: "Construindo a geração da liberdade econômica.",
    locale: "pt_BR",
    type: "website",
    images: ["/brand/logo.png"],
  },
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
