import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/gradient-generator',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
