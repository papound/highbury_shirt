import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import HomeV2 from "@/components/storefront/home-v2";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home V2 (Design Preview)",
  description: "Highbury International – เสื้อเชิ้ตคุณภาพพรีเมียม",
};

async function getFeaturedProducts() {
  try {
    const rawProducts = await prisma.product.findMany({
      where: { isFeatured: true, status: "ACTIVE" },
      include: {
        images: { where: { variantId: null }, orderBy: { sortOrder: "asc" }, take: 1 },
        variants: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    const variantIds = rawProducts.flatMap((p) => p.variants.map((v) => v.id));
    const variantStock =
      variantIds.length > 0
        ? await prisma.inventory.groupBy({
            by: ["variantId"],
            _sum: { quantity: true },
            where: { variantId: { in: variantIds } },
          })
        : [];
    const stockMap = Object.fromEntries(
      variantStock.map((v) => [v.variantId, v._sum.quantity ?? 0])
    );

    return rawProducts.map((p) => ({
      ...p,
      variants: p.variants.map((v) => ({
        ...v,
        stock: stockMap[v.id] ?? 0,
      })),
    }));
  } catch (err) {
    console.error("[HomeV2Page] Error loading featured products:", err);
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (err) {
    console.error("[HomeV2Page] Error loading categories:", err);
    return [];
  }
}

export default async function HomeV2Page() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return <HomeV2 featuredProducts={featuredProducts} categories={categories} />;
}
