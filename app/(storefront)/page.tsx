import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import HomeV2 from "@/components/storefront/home-v2";

export const metadata: Metadata = {
  title: "Highbury International – เสื้อเชิ้ตคุณภาพพรีเมียม",
  description: "เสื้อเชิ้ตดีไซน์ทันสมัยสำหรับทั้งผู้ชายและผู้หญิงยุคใหม่ คัตติ้งเนี้ยบ ทรงสวย พอดีตัว พร้อมเนื้อผ้าระบายอากาศได้ดีเยี่ยม ตอบโจทย์ทุกวันทำงานและทุกโอกาสของคุณ",
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

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return <HomeV2 featuredProducts={featuredProducts} categories={categories} />;
}
