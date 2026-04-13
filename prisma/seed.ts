import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import path from "path";

// Always use absolute file path for SQLite so it works regardless of .env loading
const dbUrl = `file:${path.resolve(process.cwd(), "dev.db")}`;
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const COLORS_MEN = [
  { color: "ขาว", colorHex: "#FFFFFF" },
  { color: "ฟ้าอ่อน", colorHex: "#87CEEB" },
  { color: "ฟ้าเข้ม", colorHex: "#1E40AF" },
  { color: "เทา", colorHex: "#9CA3AF" },
];
const COLORS_WOMEN = [
  { color: "ขาว", colorHex: "#FFFFFF" },
  { color: "ชมพู", colorHex: "#F9A8D4" },
  { color: "ฟ้าอ่อน", colorHex: "#87CEEB" },
  { color: "ม่วงอ่อน", colorHex: "#C4B5FD" },
];

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin Users ───────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const staffPassword = await bcrypt.hash("staff123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@highburyinternational.com" },
    update: {},
    create: {
      email: "admin@highburyinternational.com",
      name: "Admin",
      password: adminPassword,
      role: "SUPERADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@highburyinternational.com" },
    update: {},
    create: {
      email: "staff@highburyinternational.com",
      name: "Staff",
      password: staffPassword,
      role: "STAFF",
    },
  });

  await prisma.user.upsert({
    where: { email: "accountant@highburyinternational.com" },
    update: {},
    create: {
      email: "accountant@highburyinternational.com",
      name: "Accountant",
      password: staffPassword,
      role: "ACCOUNTANT",
    },
  });

  console.log("✅ Admin users created");

  // ── Categories ────────────────────────────────────────────────────────────
  const catMen = await prisma.category.upsert({
    where: { slug: "mens-shirts" },
    update: {},
    create: {
      name: "Men's Shirts",
      nameTh: "เสื้อเชิ้ตผู้ชาย",
      slug: "mens-shirts",
      description: "Premium ready-made shirts for men",
      sortOrder: 1,
    },
  });

  const catWomen = await prisma.category.upsert({
    where: { slug: "womens-shirts" },
    update: {},
    create: {
      name: "Women's Shirts",
      nameTh: "เสื้อเชิ้ตผู้หญิง",
      slug: "womens-shirts",
      description: "Premium ready-made shirts for women",
      sortOrder: 2,
    },
  });

  console.log("✅ Categories created");

  // ── Warehouse ─────────────────────────────────────────────────────────────
  const warehouse = await prisma.warehouse.upsert({
    where: { id: "main-warehouse" },
    update: {},
    create: {
      id: "main-warehouse",
      name: "คลังสินค้าหลัก",
      location: "กรุงเทพมหานคร",
    },
  });

  console.log("✅ Warehouse created");

  // ── Sample Products ───────────────────────────────────────────────────────
  const menProducts = [
    {
      name: "Classic Oxford Shirt",
      nameTh: "เสื้อเชิ้ตออกซ์ฟอร์ด คลาสสิค",
      slug: "mens-classic-oxford-shirt",
      basePrice: 590,
      colors: COLORS_MEN,
      imageUrl: "https://placehold.co/600x800/1e3a5f/93c5fd/png?text=Classic+Oxford+Shirt",
    },
    {
      name: "Slim Fit Business Shirt",
      nameTh: "เสื้อเชิ้ตทำงาน สลิมฟิต",
      slug: "mens-slim-fit-business-shirt",
      basePrice: 690,
      colors: COLORS_MEN,
      imageUrl: "https://placehold.co/600x800/312e81/c7d2fe/png?text=Slim+Fit+Business",
    },
  ];

  const womenProducts = [
    {
      name: "Elegant Office Shirt",
      nameTh: "เสื้อเชิ้ตสำนักงาน หรูหรา",
      slug: "womens-elegant-office-shirt",
      basePrice: 590,
      colors: COLORS_WOMEN,
      imageUrl: "https://placehold.co/600x800/881337/fecdd3/png?text=Elegant+Office+Shirt",
    },
    {
      name: "Slim Fit Women's Shirt",
      nameTh: "เสื้อเชิ้ตผู้หญิง สลิมฟิต",
      slug: "womens-slim-fit-shirt",
      basePrice: 650,
      colors: COLORS_WOMEN,
      imageUrl: "https://placehold.co/600x800/4c1d95/ddd6fe/png?text=Slim+Fit+Womens+Shirt",
    },
  ];

  let productCount = 0;

  for (const [idx, p] of [...menProducts, ...womenProducts].entries()) {
    const categoryId = idx < menProducts.length ? catMen.id : catWomen.id;
    const colors = idx < menProducts.length ? COLORS_MEN : COLORS_WOMEN;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        nameTh: p.nameTh,
        slug: p.slug,
        basePrice: p.basePrice,
        categoryId,
        isFeatured: true,
        status: "ACTIVE",
      },
    });

    // Primary image
    const existingImage = await prisma.productImage.findFirst({ where: { productId: product.id } });
    if (!existingImage) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: p.imageUrl,
          altText: p.nameTh,
          sortOrder: 0,
          isPrimary: true,
        },
      });
    }

    // Variants
    let variantIdx = 0;
    for (const color of colors) {
      for (const size of SIZES) {
        await prisma.productVariant.upsert({
          where: { sku: `${p.slug}-${color.color}-${size}` },
          update: {},
          create: {
            productId: product.id,
            color: color.color,
            colorHex: color.colorHex,
            size,
            sku: `${p.slug}-${color.color}-${size}`,
            price: p.basePrice + (["XL", "2XL", "3XL"].includes(size) ? 50 : 0),
          },
        });

        const inv = await prisma.inventory.findFirst({
          where: {
            variant: { sku: `${p.slug}-${color.color}-${size}` },
            warehouseId: warehouse.id,
          },
        });

        if (!inv) {
          const variant = await prisma.productVariant.findUnique({
            where: { sku: `${p.slug}-${color.color}-${size}` },
          });
          if (variant) {
            await prisma.inventory.create({
              data: {
                variantId: variant.id,
                warehouseId: warehouse.id,
                quantity: 50,
              },
            });
          }
        }

        variantIdx++;
      }
    }

    productCount++;
  }

  console.log(`✅ ${productCount} products with variants & inventory created`);

  // ── Promotions ────────────────────────────────────────────────────────────
  const existingPromo = await prisma.promotion.findUnique({
    where: { id: "promo-buy3get1" },
  });

  if (!existingPromo) {
    await prisma.promotion.create({
      data: {
        id: "promo-buy3get1",
        name: "ซื้อ 3 แถม 1",
        nameTh: "ซื้อ 3 แถม 1",
        type: "BUY_X_GET_Y",
        isActive: true,
        rulesJson: JSON.stringify({ buyQty: 3, getQty: 1 }),
      },
    });
  }

  console.log("✅ Promotions created");

  // ── Site Settings ─────────────────────────────────────────────────────────
  const settings = [
    { key: "promptpay_id", value: "0XX-XXX-XXXX" },
    { key: "promptpay_name", value: "HIGHBURY INTERNATIONAL" },
    { key: "shipping_fee", value: "50" },
    { key: "free_shipping_threshold", value: "1000" },
    { key: "line_notify_token", value: "" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  console.log("✅ Site settings created");
  console.log("\n🎉 Seed completed!\n");
  console.log("📋 Admin credentials:");
  console.log("   Super Admin: admin@highburyinternational.com / admin123456");
  console.log("   Staff:       staff@highburyinternational.com / staff123456");
  console.log("   Accountant:  accountant@highburyinternational.com / staff123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
