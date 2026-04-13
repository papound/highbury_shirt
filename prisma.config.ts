import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";

const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const resolvedUrl = rawUrl.startsWith("file:")
  ? `file:${path.resolve(process.cwd(), rawUrl.replace("file:", "").replace(/^\.\//, ""))}`
  : rawUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: resolvedUrl,
  },
});
