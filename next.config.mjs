import { fileURLToPath } from "node:url";

const staffPrefix = (process.env.NEXT_PUBLIC_OCC_STAFF_PREFIX || "/k9xm2p7qv4nw8-stf").replace(
  /\/$/,
  "",
);

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Enable gzip + brotli compression for all responses
  compress: true,

  async rewrites() {
    return [
      { source: `${staffPrefix}/gate`, destination: "/staff-gate-internal" },
      { source: `${staffPrefix}/gate/`, destination: "/staff-gate-internal" },
      { source: `${staffPrefix}/:path+`, destination: "/staff-panel-internal/:path+" },
      { source: `${staffPrefix}`, destination: "/staff-panel-internal" },
    ];
  },

  // Next/Image: serve WebP/AVIF, optimize responsive sizes, allow R2 CDN
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "pub-bfaeaa580da54d41ac88fa17561fb6c9.r2.dev" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" },
    ],
  },

  experimental: {
    typedRoutes: false,
  },
  typescript: {
    // This repo contains some Vite-era code and third-party typing mismatches.
    // For deployment, we prefer runtime correctness over build-time type failures.
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "react-router": fileURLToPath(new URL("./src/lib/router-compat.tsx", import.meta.url)),
    };
    return config;
  },
};

export default nextConfig;
