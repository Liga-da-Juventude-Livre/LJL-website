import type { MetadataRoute } from "next";

// Lets a phone offer "add to home screen" with the Liga's icon and colours. No offline mode is promised.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Liga da Juventude Livre",
    short_name: "Liga",
    description: "Movimento estudantil apartidário pela liberdade econômica, pelo Estado de Direito e pela livre circulação de ideias.",
    lang: "pt-BR",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#006332",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
