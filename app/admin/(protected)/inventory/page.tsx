import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import AdminInventoryClient from "@/components/admin/inventory-client";
import InventoryTransferDialog from "@/components/admin/inventory-transfer-dialog";
import InventoryWithdrawDialog from "@/components/admin/inventory-withdraw-dialog";
import InventoryImportDialog from "@/components/admin/inventory-import-dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cache } from "react";

const PAGE_SIZE = 50;

type Props = { searchParams: Promise<{ page?: string; q?: string; sku?: string; color?: string; size?: string; categoryId?: string; minQty?: string; maxQty?: string }> };

export default async function AdminInventoryPage({ searchParams }: Props) {
  const session = await auth();
  const role = session?.user?.role ?? "";
  const params = await searchParams;
  const { page: pageParam, q, sku, color, size, categoryId, minQty, maxQty } = params;
  const page = Math.max(1, parseInt(pageParam ?? "1"));
  const search = q?.trim() ?? "";

  // ดึง category, สี, ไซส์ ทั้งหมด
  const [categories, allVariants] = await Promise.all([
    prisma.category.findMany({ orderBy: { nameTh: "asc" } }),
    prisma.productVariant.findMany({ select: { color: true, size: true }, distinct: ["color", "size"] }),
  ]);
  const allColors = [...new Set(allVariants.map((v) => v.color))].sort();
  const allSizes = [...new Set(allVariants.map((v) => v.size))].sort();

  // Build where
  const where: any = {};
  if (search) {
    where.OR = [
      { variant: { product: { nameTh: { contains: search } } } },
      { variant: { color: { contains: search } } },
      { variant: { size: { contains: search } } },
      { variant: { sku: { contains: search } } },
      { warehouse: { name: { contains: search } } },
    ];
  }
  if (sku) where["variant"] = { ...(where["variant"] || {}), sku: { contains: sku } };
  if (color) where["variant"] = { ...(where["variant"] || {}), color: { contains: color } };
  if (size) where["variant"] = { ...(where["variant"] || {}), size: { contains: size } };
  if (categoryId) {
    where["variant"] = {
      ...(where["variant"] || {}),
      product: { ...(where["variant"]?.product || {}), categoryId },
    };
  }
  if (minQty || maxQty) {
    where.quantity = {};
    if (minQty) where.quantity.gte = parseInt(minQty);
    if (maxQty) where.quantity.lte = parseInt(maxQty);
  }

  const [total, inventory, warehouses, allInventory] = await Promise.all([
    prisma.inventory.count({ where }),
    prisma.inventory.findMany({
      where,
      include: {
        variant: { include: { product: true } },
        warehouse: true,
      },
      orderBy: [{ warehouse: { name: "asc" } }, { variant: { product: { nameTh: "asc" } } }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.warehouse.findMany({ orderBy: { name: "asc" } }),
    prisma.inventory.findMany({
      include: {
        variant: { include: { product: true } },
        warehouse: true,
      },
      orderBy: [{ warehouse: { name: "asc" } }, { variant: { product: { nameTh: "asc" } } }],
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (sku) params.set("sku", sku);
    if (color) params.set("color", color);
    if (size) params.set("size", size);
    if (categoryId) params.set("categoryId", categoryId);
    if (minQty) params.set("minQty", minQty);
    if (maxQty) params.set("maxQty", maxQty);
    params.set("page", String(p));
    return `/admin/inventory?${params}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">คลังสินค้า</h1>
          <p className="text-muted-foreground text-sm">{total} รายการ</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <InventoryImportDialog />
          <InventoryTransferDialog warehouses={warehouses} inventory={inventory} />
          {role === "SUPERADMIN" && (
            <InventoryWithdrawDialog warehouses={warehouses} inventory={allInventory} />
          )}
        </div>
      </div>


      {/* Filters */}
      <form method="GET" action="/admin/inventory" className="flex flex-wrap gap-2 items-end mb-2">
        <div>
          <label className="block text-xs mb-1">ค้นหา</label>
          <input
            key={`q-${search}`}
            name="q"
            defaultValue={search}
            placeholder="ชื่อสินค้า, คลัง..."
            className="h-9 rounded-md border border-input bg-white px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">SKU</label>
          <input key={`sku-${sku}`} name="sku" defaultValue={sku} className="h-9 rounded-md border border-input bg-white px-3 text-sm shadow-sm" />
        </div>
        <div>
          <label className="block text-xs mb-1">สี</label>
          <select key={`color-${color}`} name="color" defaultValue={color || ""} className="h-9 rounded-md border border-input bg-white px-3 text-sm shadow-sm">
            <option value="">ทั้งหมด</option>
            {allColors.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">ไซส์</label>
          <select key={`size-${size}`} name="size" defaultValue={size || ""} className="h-9 rounded-md border border-input bg-white px-3 text-sm shadow-sm">
            <option value="">ทั้งหมด</option>
            {allSizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">หมวดหมู่</label>
          <select key={`cat-${categoryId}`} name="categoryId" defaultValue={categoryId || ""} className="h-9 rounded-md border border-input bg-white px-3 text-sm shadow-sm">
            <option value="">ทั้งหมด</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nameTh}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">จำนวน (ต่ำสุด)</label>
          <input key={`minQty-${minQty}`} name="minQty" type="number" defaultValue={minQty} className="h-9 w-20 rounded-md border border-input bg-white px-3 text-sm shadow-sm" />
        </div>
        <div>
          <label className="block text-xs mb-1">จำนวน (สูงสุด)</label>
          <input key={`maxQty-${maxQty}`} name="maxQty" type="number" defaultValue={maxQty} className="h-9 w-20 rounded-md border border-input bg-white px-3 text-sm shadow-sm" />
        </div>
        <Button type="submit" size="sm" variant="outline" className="shadow-sm">ค้นหา</Button>
        <Button asChild size="sm" variant="ghost">
          <Link href="/admin/inventory">ล้าง</Link>
        </Button>
      </form>

      <AdminInventoryClient inventory={inventory} warehouses={warehouses} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            แสดง {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} จาก {total} รายการ
          </p>
          <div className="flex items-center gap-1">
            <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page <= 1}>
              <Link href={pageUrl(page - 1)}><ChevronLeft className="w-4 h-4" /></Link>
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
                  <span key={`e-${i}`} className="px-1 text-muted-foreground text-xs">…</span>
                ) : (
                  <Button
                    key={p}
                    asChild
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 p-0 text-xs ${
                      p === page ? "bg-blue-600 hover:bg-blue-700 border-blue-600" : ""
                    }`}
                  >
                    <Link href={pageUrl(p as number)}>{p}</Link>
                  </Button>
                )
              )}
            <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page >= totalPages}>
              <Link href={pageUrl(page + 1)}><ChevronRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
