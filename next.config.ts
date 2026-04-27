import type { NextConfig } from "next";
import { execSync } from "child_process";

function getGitRevision(): string {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GIT_REVISION: getGitRevision(),
  },
  // บอก Next.js ว่า packages เหล่านี้รันได้เฉพาะ server-side เท่านั้น
  // ป้องกัน pg / @prisma/adapter-pg ถูก bundle เข้า client bundle
  serverExternalPackages: ["pg", "@prisma/adapter-pg", "@prisma/client"],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "uploadthing.com" },
    ],
  },
};

export default nextConfig;
