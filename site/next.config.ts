import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* a separate build folder when asked, so a production check can run beside the dev server */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
