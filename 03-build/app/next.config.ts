import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Run the local embedding library with native Node require instead of bundling it.
  serverExternalPackages: ["@xenova/transformers"],
};

export default nextConfig;
