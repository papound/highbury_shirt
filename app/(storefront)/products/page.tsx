import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Shirt } from "lucide-react";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchParams {
  category?: string;
  color?: string;
  size?: string;
  search?: string;
  sort?: string;
  page?: string;
}

type Props = {
  searchParams: Promise<SearchParams>;
};

const PAGE_SIZE = 24;

async function getProducts(sp: SearchParams) {
  const page = Math.max(1, Number(sp.page ?? 1));

  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
  };

  if (sp.category) where.category = { slug: sp.category };
  if (sp.search) {
    where.OR = [
      { nameTh: { contains: sp.search } },
      { name: { contains: sp.search } },
    ];
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: true,
        category: true,
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return { products, total, categories, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export const metadata = {
  title: "สินค้าทั้งหมด",
};

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { products, total, categories, page, totalPages } = await getProducts(sp);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">สินค้าทั้งหมด</h1>
      <p className="text-muted-foreground mb-6">พบสินค้า {total} รายการ</p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="space-y-5 sticky top-20">
            {/* Search */}
            <div>
              <form>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="search"
                    defaultValue={sp.search}
                    placeholder="ค้นหาสินค้า..."
                    className="pl-9"
                  />
                </div>
              </form>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-1">
                <SlidersHorizontal className="h-4 w-4" />
                หมวดหมู่
              </h3>
              <div className="space-y-1">
                <Link
                  href="/products"
                  className={`block px-2 py-1.5 rounded text-sm transition-colors ${
                    !sp.category ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                  }`}
                >
                  ทั้งหมด
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className={`block px-2 py-1.5 rounded text-sm transition-colors ${
                      sp.category === cat.slug
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {cat.nameTh}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              ไม่พบสินค้าที่ค้นหา
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => {
                  const primaryImage = product.images[0];
                  const minPrice = product.variants.length > 0 ? Math.min(...product.variants.map((v) => v.price)) : 0;
                  const maxPrice = product.variants.length > 0 ? Math.max(...product.variants.map((v) => v.price)) : 0;
                  const colors = [...new Set(product.variants.map((v) => v.color))];

                  return (
                    <Card
                      key={product.id}
                      className="group overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-0">
                        <Link href={`/products/${product.slug}`}>
                          <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden bg-gray-100">
                            {primaryImage ? (
                              <Image
                                src={primaryImage.url}
                                alt={primaryImage.altText ?? product.nameTh}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-2">
                                <Shirt className="w-12 h-12 text-slate-300" strokeWidth={1} />
                              </div>
                            )}
                            {product.isFeatured && (
                              <Badge className="absolute top-2 left-2 text-xs">
                                แนะนำ
                              </Badge>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              {product.category.nameTh}
                            </p>
                            <h3 className="font-medium text-sm leading-tight line-clamp-2">
                              {product.nameTh}
                            </h3>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {colors.slice(0, 4).map((c) => (
                                <span
                                  key={c}
                                  className="text-xs bg-secondary px-1.5 py-0.5 rounded"
                                >
                                  {c}
                                </span>
                              ))}
                              {colors.length > 4 && (
                                <span className="text-xs text-muted-foreground">
                                  +{colors.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                      <CardFooter className="p-3 pt-0 flex items-center justify-between">
                        <span className="font-semibold text-primary text-sm">
                          {minPrice === maxPrice
                            ? `฿${minPrice.toLocaleString()}`
                            : `฿${minPrice.toLocaleString()}+`}
                        </span>
                        <Button size="sm" asChild>
                          <Link href={`/products/${product.slug}`}>เลือกสินค้า</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 mt-8 flex-wrap">
                  {/* Prev */}
                  {page > 1 && (
                    <Link
                      href={`/products?${new URLSearchParams({ ...sp, page: String(page - 1) })}`}
                      className="w-9 h-9 flex items-center justify-center rounded-md text-sm border border-border hover:bg-secondary transition-colors"
                    >
                      ‹
                    </Link>
                  )}

                  {(() => {
                    const pages: (number | "...")[] = [];
                    const delta = 2;
                    const left = page - delta;
                    const right = page + delta;

                    for (let i = 1; i <= totalPages; i++) {
                      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
                        pages.push(i);
                      } else if (pages[pages.length - 1] !== "...") {
                        pages.push("...");
                      }
                    }

                    return pages.map((p, idx) =>
                      p === "..." ? (
                        <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-sm text-muted-foreground">
                          …
                        </span>
                      ) : (
                        <Link
                          key={p}
                          href={`/products?${new URLSearchParams({ ...sp, page: String(p) })}`}
                          className={`w-9 h-9 flex items-center justify-center rounded-md text-sm border transition-colors ${
                            page === p
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          {p}
                        </Link>
                      )
                    );
                  })()}

                  {/* Next */}
                  {page < totalPages && (
                    <Link
                      href={`/products?${new URLSearchParams({ ...sp, page: String(page + 1) })}`}
                      className="w-9 h-9 flex items-center justify-center rounded-md text-sm border border-border hover:bg-secondary transition-colors"
                    >
                      ›
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
