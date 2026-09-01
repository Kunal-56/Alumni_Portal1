import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Fix: suppress lockfile warning from parent directory
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
