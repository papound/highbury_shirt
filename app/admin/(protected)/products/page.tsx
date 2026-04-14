import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Package, ImageIcon, Download, ChevronLeft, ChevronRight } from "lucide-react";
import AdminProductImportDialog from "@/components/admin/product-import-dialog";
import ProductClearButton from "@/components/admin/product-clear-button";

const PAGE_SIZE = 20;

type Props = { searchParams: Promise<{ page?: string; q?: string }> };

export default async function AdminProductsPage({ searchParams }: Props) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1"));
  const search = q?.trim() ?? "";

  const where = search
    ? {
        OR: [
          { nameTh: { contains: search } },
          { name: { contains: search } },
          { variants: { some: { sku: { contains: search } } } },
        ],
      }
    : {};

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: true,
        variants: { include: { inventory: true } },
        images: { take: 1, orderBy: { sortOrder: "asc" } },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    params.set("page", String(p));
    return `/admin/products?${params}`;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="w-8 h-8 text-blue-600" />
            สินค้า
          </h1>
          <p className="text-muted-foreground mt-1">จัดการรายการสินค้า หมวดหมู่ และสถานะทั้งหมด ({total} รายการ)</p>
        </div>
        <div className="flex items-center gap-2">
          <ProductClearButton />
          <AdminProductImportDialog />
          <Button asChild variant="outline" className="shadow-sm">
            <a href="/api/admin/products/export" download>
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </a>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มสินค้า
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <form method="GET" action="/admin/products" className="flex gap-2 max-w-sm">
        <input
          name="q"
          defaultValue={search}
          placeholder="ค้นหาชื่อ, SKU..."
          className="flex-1 h-9 rounded-md border border-input bg-white px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        <Button type="submit" size="sm" variant="outline" className="shadow-sm">ค้นหา</Button>
        {search && (
          <Button asChild size="sm" variant="ghost">
            <Link href="/admin/products">ล้าง</Link>
          </Button>
        )}
      </form>

      <Card className="border-none shadow-sm bg-white border border-slate-100 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500">
                  <th className="text-left px-6 py-4 font-semibold">สินค้า</th>
                  <th className="text-left px-6 py-4 font-semibold hidden md:table-cell">หมวดหมู่</th>
                  <th className="text-right px-6 py-4 font-semibold">ราคา</th>
                  <th className="text-center px-6 py-4 font-semibold">Variants</th>
                  <th className="text-center px-6 py-4 font-semibold">สถานะ</th>
                  <th className="w-20 px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Package className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-sm font-medium">ไม่พบสินค้า</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {search ? `ไม่มีสินค้าที่ตรงกับ "${search}"` : "เริ่มเพิ่มสินค้าชิ้นแรกของคุณเพื่อเปิดการขาย"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const totalStock = product.variants.reduce(
                      (sum, v) => sum + v.inventory.reduce((s, inv) => s + inv.quantity, 0),
                      0
                    );
                    return (
                      <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                              {product.images[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900">{product.nameTh}</span>
                              <span className="text-xs text-slate-500 mt-0.5">{product.name}</span>
                              <span className="text-xs text-slate-400 mt-1">
                                คลัง: <span className={totalStock > 0 ? "text-emerald-600 font-medium" : "text-rose-500 font-medium"}>{totalStock}</span> ชิ้น
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium hidden md:table-cell">
                          {product.category?.nameTh ?? <span className="text-slate-400 italic">-</span>}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-900">
                          ฿{product.basePrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded-md">
                            {product.variants.length} รายการ
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            product.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : product.status === "INACTIVE"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}>
                            {product.status === "ACTIVE" ? "เปิดขาย" : product.status === "INACTIVE" ? "ปิดขาย" : "ซ่อนแล้ว"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button asChild variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Link href={`/admin/products/${product.id}`}>
                              <Pencil className="w-4 h-4 mr-1.5" />
                              <span className="text-xs font-medium">แก้ไข</span>
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
              <p className="text-xs text-slate-500">
                แสดง {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} จาก {total} รายการ
              </p>
              <div className="flex items-center gap-1">
                <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page <= 1}>
                  <Link href={pageUrl(page - 1)} aria-disabled={page <= 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && (arr[idx - 1] as number) < p - 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span key={`ellipsis-${i}`} className="px-1 text-slate-400 text-xs">…</span>
                    ) : (
                      <Button
                        key={p}
                        asChild
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 text-xs ${p === page ? "bg-blue-600 hover:bg-blue-700 border-blue-600" : ""}`}
                      >
                        <Link href={pageUrl(p as number)}>{p}</Link>
                      </Button>
                    )
                  )}
                <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page >= totalPages}>
                  <Link href={pageUrl(page + 1)} aria-disabled={page >= totalPages}>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}