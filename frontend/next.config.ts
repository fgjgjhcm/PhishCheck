import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 defaults to Turbopack for `next build` / `next dev`, which ignores this hook.
  // package.json uses `--webpack` so Vercel and local scripts still apply this config.
  webpack: (config, { dev }) => {
    if (dev) {
      // Prevents flaky missing chunks (e.g. ./883.js) and PackFileCacheStrategy ENOENT
      // rename errors when the persistent cache gets out of sync.
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
