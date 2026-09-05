import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export keeps rabiussani.me on GitHub Pages working exactly as before.
  output: "export",
  // The export target has no image optimizer, so serve the files as authored.
  images: { unoptimized: true },
  // GitHub Pages serves /about as /about/index.html.
  trailingSlash: true,
};

export default nextConfig;
