import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getProductPlaceholderImage } from "@/lib/placeholders";
import ProductView from "@/components/storefront/product-view";

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

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.nameTh,
    description: product.descTh ?? product.description,
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

  return (
    <div className="container mx-auto px-4 py-8">
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
