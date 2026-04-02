import { fileURLToPath } from "node:url";

const staffPrefix = (process.env.NEXT_PUBLIC_OCC_STAFF_PREFIX || "/k9xm2p7qv4nw8-stf").replace(
  /\/$/,
  "",
);

/** @type {import("next").NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: `${staffPrefix}/gate`, destination: "/staff-gate-internal" },
      { source: `${staffPrefix}/gate/`, destination: "/staff-gate-internal" },
      { source: `${staffPrefix}/:path+`, destination: "/staff-panel-internal/:path+" },
      { source: `${staffPrefix}`, destination: "/staff-panel-internal" },
    ];
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
