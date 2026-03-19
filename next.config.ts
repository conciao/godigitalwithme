import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Cloudflare Pages requires this */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['jose'],
};

export default nextConfig;
