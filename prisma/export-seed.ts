/**
 * Export current dev.db data to seed-data.json
 * Run: npx tsx prisma/export-seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import fs from "fs";
import path from "path";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const url = raw.startsWith("file:")
  ? `file:${path.resolve(process.cwd(), raw.replace("file:", "").replace(/^\.\//, ""))}`
  : raw;

const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("📦 Exporting dev.db data...");

  const [
    users,
    categories,
    products,
    productVariants,
    productImages,
    promotions,
    blogPosts,
    siteSettings,
  ] = await Promise.all([
    prisma.user.findMany(),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany(),
    prisma.productVariant.findMany(),
    prisma.productImage.findMany(),
    prisma.promotion.findMany(),
    prisma.blogPost.findMany(),
    prisma.siteSetting.findMany(),
  ]);

  const data = {
    exportedAt: new Date().toISOString(),
    users,
    categories,
    products,
    productVariants,
    productImages,
    promotions,
    blogPosts,
    siteSettings,
  };

  const outPath = path.resolve(process.cwd(), "prisma/seed-data.json");
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

  console.log("✅ Exported to prisma/seed-data.json");
  console.log(`  users:           ${users.length}`);
  console.log(`  categories:      ${categories.length}`);
  console.log(`  products:        ${products.length}`);
  console.log(`  productVariants: ${productVariants.length}`);
  console.log(`  productImages:   ${productImages.length}`);
  console.log(`  promotions:      ${promotions.length}`);
  console.log(`  blogPosts:       ${blogPosts.length}`);
  console.log(`  siteSettings:    ${siteSettings.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
