import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Pencil } from "lucide-react";
import AdminProductImportButton from "@/components/admin/product-import-button";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">สินค้า</h1>
          <p className="text-muted-foreground text-sm">{products.length} รายการ</p>
        </div>
        <div className="flex items-center gap-2">
          <AdminProductImportButton />
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 mr-1" />
              เพิ่มสินค้า
            </Link>
          </Button>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">สินค้า</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">หมวดหมู่</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">ราคา</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Variants</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">สถานะ</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const totalStock = product.variants.reduce(
                  (sum, v) => sum + v.inventory.reduce((s, inv) => s + inv.quantity, 0),
                  0
                );
                return (
                  <tr key={product.id} className="border-b hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0].url}
                            alt=""
                            className="w-10 h-10 rounded object-cover border"
                          />
                        )}
                        <div>
                          <p className="font-medium">{product.nameTh}</p>
                          <p className="text-xs text-muted-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">คงเหลือ {totalStock} ชิ้น</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{product.category?.nameTh ?? "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <span>฿{product.basePrice.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-center">{product.variants.length}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={product.status === "ACTIVE" ? "default" : "secondary"}>
                        {product.status === "ACTIVE" ? "เปิดขาย" : product.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/products/${product.id}`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
