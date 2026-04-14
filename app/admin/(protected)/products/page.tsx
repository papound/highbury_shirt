import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Package, ImageIcon } from "lucide-react";
import AdminProductImportDialog from "@/components/admin/product-import-dialog";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      variants: { include: { inventory: true } },
      images: { take: 1, orderBy: { sortOrder: "asc" } },
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="w-8 h-8 text-blue-600" />
            สินค้า
          </h1>
          <p className="text-muted-foreground mt-1">จัดการรายการสินค้า หมวดหมู่ และสถานะทั้งหมด ({products.length} รายการ)</p>
        </div>
        <div className="flex items-center gap-2">
          <AdminProductImportDialog />
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มสินค้า
            </Link>
          </Button>
        </div>
      </div>

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
                        <p className="text-sm font-medium">ยังไม่มีสินค้า</p>
                        <p className="text-xs text-muted-foreground mt-1">เริ่มเพิ่มสินค้าชิ้นแรกของคุณเพื่อเปิดการขาย</p>
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
                                <img
                                  src={product.images[0].url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
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
        </CardContent>
      </Card>
    </div>
  );
}
