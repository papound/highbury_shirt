import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import HomeV3 from "@/components/storefront/home-v3";

export const metadata: Metadata = {
  title: "Home V3 (Design Preview) – Highbury International",
  description: "Highbury International – เสื้อเชิ้ตคุณภาพพรีเมียม สไตล์ Modern DTC Apparel",
};

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, status: "ACTIVE" },
    include: {
      images: { where: { variantId: null }, orderBy: { sortOrder: "asc" }, take: 1 },
      variants: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export default async function HomeV3Page() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return <HomeV3 featuredProducts={featuredProducts} categories={categories} />;
}
