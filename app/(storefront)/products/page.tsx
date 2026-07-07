import Image from "next/image";
import Link from "next/link";
import { PaginationJump } from "@/components/storefront/pagination-jump";
import { Shirt } from "lucide-react";
import prisma from "@/lib/prisma";
import { getProductPlaceholderImage, getColorHex } from "@/lib/placeholders";
import { Prisma } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
        images: { where: { isPrimary: true, variantId: null }, take: 1 },
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
                {(() => {
                  const filtered = categories.filter(
                    (cat) => cat.slug !== "mens-shirts" && cat.slug !== "womens-shirts"
                  );
                  const othersIndex = filtered.findIndex(
                    (cat) => cat.nameTh === "อื่นๆ" || cat.slug.toLowerCase().includes("other")
                  );
                  if (othersIndex !== -1) {
                    const othersCat = filtered[othersIndex];
                    filtered.splice(othersIndex, 1);
                    filtered.push(othersCat);
                  }
                  return filtered.map((cat) => (
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
                  ));
                })()}
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
                      className="group overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/20 hover:shadow-md transition-all duration-300 rounded-xl hover:-translate-y-0.5 flex flex-col h-full"
                    >
                      <CardContent className="p-0 flex-1 flex flex-col">
                        <Link href={`/products/${product.slug}`} className="flex-1 flex flex-col">
                          <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden bg-muted/20">
                            {primaryImage ? (
                              <Image
                                src={primaryImage.url}
                                alt={primaryImage.altText ?? product.nameTh}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                            ) : (
                              <Image
                                src={getProductPlaceholderImage(product.slug)}
                                alt={product.nameTh}
                                fill
                                className="object-contain p-2 bg-[#FAF6EE] dark:bg-[#1f2125] group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                            )}
                            {product.isFeatured && (
                              <Badge className="absolute top-2 left-2 text-xs">
                                แนะนำ
                              </Badge>
                            )}
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-between">
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                {product.category.nameTh}
                              </p>
                              <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {product.nameTh}
                              </h3>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {colors.slice(0, 4).map((c) => {
                                const isOthers = c.trim().toLowerCase() === "others";
                                const bgHex = getColorHex(c);
                                return (
                                  <span
                                    key={c}
                                    className="inline-flex items-center gap-1.5 text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 px-2 py-0.5 rounded-full font-medium text-slate-600 dark:text-slate-300 shadow-sm"
                                  >
                                    <span
                                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                                      style={{
                                        backgroundColor: isOthers ? undefined : bgHex,
                                        backgroundImage: isOthers
                                          ? "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
                                          : undefined
                                      }}
                                    />
                                    {c}
                                  </span>
                                );
                              })}
                              {colors.length > 4 && (
                                <span className="text-[10px] text-muted-foreground self-center pl-0.5">
                                  +{colors.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                      <CardFooter className="p-3 pt-0 flex items-center justify-between">
                        <span className="font-bold text-blue-600 dark:text-blue-400 text-base">
                          {minPrice === maxPrice
                            ? `฿${minPrice.toLocaleString()}`
                            : `฿${minPrice.toLocaleString()}+`}
                        </span>
                        <Button 
                          size="sm" 
                          asChild
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm hover:shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 border-0 cursor-pointer"
                        >
                          <Link href={`/products/${product.slug}`}>เลือกสินค้า</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex flex-col items-center gap-4">
                  {/* Button row */}
                  <div className="flex items-center gap-1 flex-wrap justify-center">
                    {/* First */}
                    <Link
                      href={`/products?${new URLSearchParams({ ...sp, page: "1" })}`}
                      aria-disabled={page === 1}
                      title="หน้าแรก"
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm border transition-all ${
                        page === 1
                          ? "pointer-events-none opacity-30 border-input bg-background text-muted-foreground"
                          : "border-input bg-background text-foreground hover:bg-muted/80 shadow-sm"
                      }`}
                    >
                      «
                    </Link>

                    {/* Prev */}
                    <Link
                      href={`/products?${new URLSearchParams({ ...sp, page: String(page - 1) })}`}
                      aria-disabled={page === 1}
                      title="หน้าก่อนหน้า"
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm border transition-all ${
                        page === 1
                          ? "pointer-events-none opacity-30 border-input bg-background text-muted-foreground"
                          : "border-input bg-background text-foreground hover:bg-muted/80 shadow-sm"
                      }`}
                    >
                      ‹
                    </Link>

                    {/* Ellipsis pages */}
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
                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm border font-medium transition-all ${
                              page === p
                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                : "border-input bg-background text-foreground hover:bg-muted/80 shadow-sm"
                            }`}
                          >
                            {p}
                          </Link>
                        )
                      );
                    })()}

                    {/* Next */}
                    <Link
                      href={`/products?${new URLSearchParams({ ...sp, page: String(page + 1) })}`}
                      aria-disabled={page === totalPages}
                      title="หน้าถัดไป"
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm border transition-all ${
                        page === totalPages
                          ? "pointer-events-none opacity-30 border-input bg-background text-muted-foreground"
                          : "border-input bg-background text-foreground hover:bg-muted/80 shadow-sm"
                      }`}
                    >
                      ›
                    </Link>

                    {/* Last */}
                    <Link
                      href={`/products?${new URLSearchParams({ ...sp, page: String(totalPages) })}`}
                      aria-disabled={page === totalPages}
                      title="หน้าสุดท้าย"
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm border transition-all ${
                        page === totalPages
                          ? "pointer-events-none opacity-30 border-input bg-background text-muted-foreground"
                          : "border-input bg-background text-foreground hover:bg-muted/80 shadow-sm"
                      }`}
                    >
                      »
                    </Link>
                  </div>

                  {/* Page info + Jump */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      หน้า <span className="font-semibold text-foreground">{page}</span> จาก <span className="font-semibold text-foreground">{totalPages}</span>
                    </span>
                    <PaginationJump
                      currentPage={page}
                      totalPages={totalPages}
                      searchParams={sp as Record<string, string | undefined>}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
