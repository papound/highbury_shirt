/**
 * Seed database from prisma/seed-data.json
 * Uses: prisma db push (no migrations)
 * Supports both SQLite (dev) and PostgreSQL (prod)
 *
 * Re-export data: npx tsx prisma/export-seed.ts
 * Run seed:       npx tsx prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import path from "path";

// ─── Adapter selection ────────────────────────────────────────────────────────
const DATABASE_URL = process.env.DATABASE_URL ?? "file:./dev.db";

function createClient(): PrismaClient {
  if (
    DATABASE_URL.startsWith("postgresql://") ||
    DATABASE_URL.startsWith("postgres://")
  ) {
    const adapter = new PrismaPg({ connectionString: DATABASE_URL });
    return new PrismaClient({ adapter });
  }

  const resolvedUrl = DATABASE_URL.startsWith("file:")
    ? `file:${path.resolve(process.cwd(), DATABASE_URL.replace("file:", "").replace(/^\.\//, ""))}`
    : DATABASE_URL;

  const adapter = new PrismaLibSql({ url: resolvedUrl });
  return new PrismaClient({ adapter });
}

const prisma = createClient();

// ─── Load seed data ───────────────────────────────────────────────────────────
const dataPath = path.resolve(process.cwd(), "prisma/seed-data.json");
const {
  users,
  categories,
  products,
  productVariants,
  productImages,
  promotions,
  siteSettings,
} = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function main() {
  const isPostgres =
    DATABASE_URL.startsWith("postgresql://") ||
    DATABASE_URL.startsWith("postgres://");

  console.log("🌱 Seeding database from seed-data.json...");
  console.log(`   Database: ${isPostgres ? "PostgreSQL" : "SQLite"}`);

  // 1. Categories
  console.log(`\n[1/6] Categories (${categories.length})`);
  for (const row of categories) {
    await prisma.category.upsert({
      where: { id: row.id },
      update: row,
      create: row,
    });
  }

  // 2. Users
  console.log(`[2/6] Users (${users.length})`);
  for (const row of users) {
    await prisma.user.upsert({
      where: { id: row.id },
      update: row,
      create: row,
    });
  }

  // 3. Products
  const BATCH = 100;
  console.log(`[3/6] Products (${products.length})`);
  for (let i = 0; i < products.length; i += BATCH) {
    await Promise.all(
      products
        .slice(i, i + BATCH)
        .map((row: Record<string, unknown>) =>
          prisma.product.upsert({ where: { id: row.id as string }, update: row, create: row })
        )
    );
    process.stdout.write(`\r  ${Math.min(i + BATCH, products.length)}/${products.length}`);
  }
  console.log();

  // 4. ProductVariants
  console.log(`[4/6] ProductVariants (${productVariants.length})`);
  for (let i = 0; i < productVariants.length; i += BATCH) {
    await Promise.all(
      productVariants
        .slice(i, i + BATCH)
        .map((row: Record<string, unknown>) =>
          prisma.productVariant.upsert({ where: { id: row.id as string }, update: row, create: row })
        )
    );
    process.stdout.write(`\r  ${Math.min(i + BATCH, productVariants.length)}/${productVariants.length}`);
  }
  console.log();

  // 5. ProductImages
  console.log(`[5/6] ProductImages (${productImages.length})`);
  for (const row of productImages) {
    await prisma.productImage.upsert({
      where: { id: row.id },
      update: row,
      create: row,
    });
  }

  // 6. SiteSettings
  console.log(`[6/6] SiteSettings (${siteSettings.length})`);
  for (const row of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { id: row.id },
      update: row,
      create: row,
    });
  }

  // Promotions (if any)
  if (promotions?.length) {
    for (const row of promotions) {
      await prisma.promotion.upsert({
        where: { id: row.id },
        update: row,
        create: row,
      });
    }
  }

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());


