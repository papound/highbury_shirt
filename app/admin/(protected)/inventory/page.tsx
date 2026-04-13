import { prisma } from "@/lib/prisma";
import AdminInventoryClient from "@/components/admin/inventory-client";

export default async function AdminInventoryPage() {
  const [inventory, warehouses] = await Promise.all([
    prisma.inventory.findMany({
      include: {
        variant: { include: { product: true } },
        warehouse: true,
      },
      orderBy: [{ warehouse: { name: "asc" } }, { variant: { product: { nameTh: "asc" } } }],
    }),
    prisma.warehouse.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">คลังสินค้า</h1>
        <p className="text-muted-foreground text-sm">{inventory.length} รายการ</p>
      </div>
      <AdminInventoryClient inventory={inventory} warehouses={warehouses} />
    </div>
  );
}
