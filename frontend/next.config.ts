import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
