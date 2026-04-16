import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Shirt } from "lucide-react";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import AddToCartButton from "@/components/storefront/add-to-cart-button";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, status: "ACTIVE" },
    include: {
      images: { where: { variantId: null }, orderBy: { sortOrder: "asc" } },
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

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];

  // Get total stock per variant for display
  const variantStock = await prisma.inventory.groupBy({
    by: ["variantId"],
    _sum: { quantity: true },
    where: { variantId: { in: product.variants.map((v) => v.id) } },
  });
  const stockMap = Object.fromEntries(
    variantStock.map((v) => [v.variantId, v._sum.quantity ?? 0])
  );

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText ?? product.nameTh}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-3">
                <Shirt className="w-20 h-20 text-slate-300" strokeWidth={1} />
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="w-16 h-16 relative rounded-md overflow-hidden shrink-0 border-2 border-muted cursor-pointer hover:border-primary"
                >
                  <Image
                    src={img.url}
                    alt={img.altText ?? ""}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info + Add to Cart */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{product.category.nameTh}</p>
            <h1 className="text-2xl md:text-3xl font-bold">{product.nameTh}</h1>
            {product.name !== product.nameTh && (
              <p className="text-muted-foreground">{product.name}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">SKU by variant</Badge>
            {product.status === "ACTIVE" ? (
              <Badge className="bg-green-100 text-green-700">มีสินค้า</Badge>
            ) : (
              <Badge variant="destructive">หมด</Badge>
            )}
          </div>

          {product.descTh && (
            <p className="text-muted-foreground leading-relaxed">{product.descTh}</p>
          )}

          {/* Add to Cart Form */}
          <AddToCartButton
            product={{
              id: product.id,
              nameTh: product.nameTh,
              name: product.name,
              slug: product.slug,
              imageUrl: primaryImage?.url ?? "",
              variants: product.variants.map((v) => ({
                id: v.id,
                color: v.color,
                colorHex: v.colorHex,
                size: v.size,
                sku: v.sku,
                price: v.price,
                stock: stockMap[v.id] ?? 0,
              })),
            }}
          />

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t">
            <Card>
              <CardContent className="p-3 text-sm">
                <p className="font-medium">🚚 จัดส่งทั่วประเทศ</p>
                <p className="text-muted-foreground text-xs">ค่าส่ง ฿50</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-sm">
                <p className="font-medium">💳 PromptPay</p>
                <p className="text-muted-foreground text-xs">ชำระสะดวก รวดเร็ว</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
