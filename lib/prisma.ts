import "@/lib/logger";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaPg } from "@prisma/adapter-pg";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveSqliteUrl(raw: string): string {
  const relativePath = raw.replace("file:", "").replace(/^\.\//,"");
  return `file:${path.resolve(process.cwd(), relativePath)}`;
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";

  // When building in CI/Docker without a live DB connection, use a safe no-op proxy
  if (url.includes("placeholder")) {
    const createDummyHandler = (): any => {
      const fn = () => Promise.resolve([]);
      return new Proxy(fn, {
        get: (_target, prop) => {
          if (prop === "then") return undefined;
          if (prop === "$connect" || prop === "$disconnect") return () => Promise.resolve();
          return createDummyHandler();
        },
        apply: () => Promise.resolve([]),
      });
    };
    return new Proxy({} as PrismaClient, {
      get: (_target, prop) => {
        if (prop === "$connect" || prop === "$disconnect") return () => Promise.resolve();
        return createDummyHandler();
      },
    });
  }

  if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
    const adapter = new PrismaPg({ connectionString: url });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  // SQLite / libsql (file: or libsql:)
  const resolvedUrl = url.startsWith("file:") ? resolveSqliteUrl(url) : url;
  const adapter = new PrismaLibSql({ url: resolvedUrl });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
