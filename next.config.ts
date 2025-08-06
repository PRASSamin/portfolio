import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";
import { withFrontmatter } from "./plugins/frontmatter";

const withMDX = createMDX();
const withFM = withFrontmatter({
  dir: ["content/**/*"],
  frequency: 10,
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

export default withFM(withMDX(nextConfig));
