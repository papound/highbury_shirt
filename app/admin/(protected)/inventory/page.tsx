import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import AdminInventoryClient from "@/components/admin/inventory-client";
import InventoryTransferDialog from "@/components/admin/inventory-transfer-dialog";
import InventoryWithdrawDialog from "@/components/admin/inventory-withdraw-dialog";
import InventoryImportDialog from "@/components/admin/inventory-import-dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 50;

type Props = { searchParams: Promise<{ page?: string; q?: string }> };

export default async function AdminInventoryPage({ searchParams }: Props) {
  const session = await auth();
  const role = session?.user?.role ?? "";
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1"));
  const search = q?.trim() ?? "";

  const where = search
    ? {
        OR: [
          { variant: { product: { nameTh: { contains: search } } } },
          { variant: { color: { contains: search } } },
          { variant: { size: { contains: search } } },
          { variant: { sku: { contains: search } } },
          { warehouse: { name: { contains: search } } },
        ],
      }
    : {};

  const [total, inventory, warehouses] = await Promise.all([
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
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
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
            <InventoryWithdrawDialog warehouses={warehouses} inventory={inventory} />
          )}
        </div>
      </div>

      {/* Search */}
      <form method="GET" action="/admin/inventory" className="flex gap-2 max-w-sm">
        <input
          name="q"
          defaultValue={search}
          placeholder="ค้นหาสินค้า, สี, ขนาด, SKU, คลัง..."
          className="flex-1 h-9 rounded-md border border-input bg-white px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        <Button type="submit" size="sm" variant="outline" className="shadow-sm">ค้นหา</Button>
        {search && (
          <Button asChild size="sm" variant="ghost">
            <Link href="/admin/inventory">ล้าง</Link>
          </Button>
        )}
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
