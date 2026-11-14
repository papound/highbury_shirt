import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import HomeV3 from "@/components/storefront/home-v3";

export const metadata: Metadata = {
  title: "Highbury International – เสื้อเชิ้ตคุณภาพพรีเมียม สไตล์และสรีระคนเอเชีย",
  description:
    "เสื้อเชิ้ตดีไซน์ทันสมัยสำหรับทั้งผู้ชายและผู้หญิงยุคใหม่ คัตติ้งเนี้ยบ ทรงสวย พอดีตัว พร้อมเนื้อผ้าระบายอากาศได้ดีเยี่ยม ตอบโจทย์ทุกวันทำงานและทุกโอกาสของคุณ",
  alternates: {
    canonical: "./",
  },
};

async function getFeaturedProducts() {
  // Query representative products across all active shirt categories
  const categories = await prisma.category.findMany({
    where: { isActive: true, slug: { not: "" } },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        where: { status: "ACTIVE" },
        take: 1,
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
          category: true,
        },
      },
    },
  });

  const categoryProducts = categories.flatMap((c) => c.products);

  if (categoryProducts.length < 6) {
    const existingIds = categoryProducts.map((p) => p.id);
    const extra = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        id: { notIn: existingIds },
        category: { slug: { not: "" } },
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: true,
      },
      take: 6 - categoryProducts.length,
    });
    return [...categoryProducts, ...extra];
  }

  return categoryProducts;
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return <HomeV3 featuredProducts={featuredProducts} categories={categories} />;
}
