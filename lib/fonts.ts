import { Fraunces } from "next/font/google";

// Magazine face for articles (the same one the Liga's panel and Instagram posts use).
export const display = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });
