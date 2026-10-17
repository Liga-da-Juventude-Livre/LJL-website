import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uploaded images are served from the project's Vercel Blob store.
  images: { remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] },
  // The certificate PDF reads these font files at run time; make sure they ship with the serverless function.
  outputFileTracingIncludes: { "/verify/[code]/pdf": ["./assets/fonts/*.woff"] },
  async headers() {
    return [
      {
        // Certificates are looked up by code and never indexed.
        source: "/verify/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        // The dashboard is never cached, framed or indexed.
        source: "/dashboard/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "same-origin" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
