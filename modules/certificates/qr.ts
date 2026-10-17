import "server-only";
import QRCode from "qrcode";

/** The verification QR as inline SVG, for the dashboard. The input is always our own URL, so the markup is trusted. */
export const qrSvg = (url: string) =>
  QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#191617", light: "#ffffff" } });
