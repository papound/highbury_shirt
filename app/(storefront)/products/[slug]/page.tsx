import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getProductPlaceholderImage } from "@/lib/placeholders";
import ProductView from "@/components/storefront/product-view";
import JsonLd from "@/components/shared/json-ld";
import {
  getBaseUrl,
  generateProductSchema,
  generateBreadcrumbSchema,
  siteConfig,
} from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, status: "ACTIVE" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { include: { images: { orderBy: { sortOrder: "asc" } } } },
      category: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/products/${product.slug}`;
  const title = product.nameTh || product.name;
  const description =
    product.descTh ??
    product.description ??
    `${title} เสื้อเชิ้ตสำเร็จรูปคุณภาพสูงจาก Highbury International คัตติ้งเนี้ยบ ทรงสวย พอดีตัว`;

  const primaryImage = product.images?.[0]?.url || siteConfig.defaultOgImage;
  const ogImageUrl = primaryImage.startsWith("http") ? primaryImage : `${baseUrl}${primaryImage}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Highbury International`,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 800,
          height: 1000,
          alt: title,
        },
      ],
      locale: siteConfig.locale,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Highbury International`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  // Get total stock per variant for display
  const variantStock = await prisma.inventory.groupBy({
    by: ["variantId"],
    _sum: { quantity: true },
    where: { variantId: { in: product.variants.map((v) => v.id) } },
  });
  const stockMap = Object.fromEntries(
    variantStock.map((v) => [v.variantId, v._sum.quantity ?? 0])
  );

  const productData = {
    ...product,
    variants: product.variants.map((v) => ({
      ...v,
      stock: stockMap[v.id] ?? 0,
    })),
  };

  const productJsonLd = generateProductSchema({
    name: product.name,
    nameTh: product.nameTh,
    slug: product.slug,
    description: product.description,
    descTh: product.descTh,
    images: product.images,
    variants: productData.variants,
    categoryName: product.category?.nameTh,
  });

  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: "หน้าแรก", url: "/" },
    { name: "สินค้าทั้งหมด", url: "/products" },
    {
      name: product.category?.nameTh || "หมวดหมู่",
      url: `/products?category=${product.category?.slug}`,
    },
    { name: product.nameTh, url: `/products/${product.slug}` },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">หน้าแรก</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground">สินค้า</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-foreground">
          {product.category.nameTh}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.nameTh}</span>
      </nav>

      <ProductView
        product={productData}
        placeholderImage={getProductPlaceholderImage(product.slug)}
      />
    </div>
  );
}
