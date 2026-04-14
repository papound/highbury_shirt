import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import AdminInventoryClient from "@/components/admin/inventory-client";
import InventoryTransferDialog from "@/components/admin/inventory-transfer-dialog";
import InventoryWithdrawDialog from "@/components/admin/inventory-withdraw-dialog";

export default async function AdminInventoryPage() {
  const session = await auth();
  const role = session?.user?.role ?? "";

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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">คลังสินค้า</h1>
          <p className="text-muted-foreground text-sm">{inventory.length} รายการ</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <InventoryTransferDialog warehouses={warehouses} inventory={inventory} />
          {role === "SUPERADMIN" && (
            <InventoryWithdrawDialog warehouses={warehouses} inventory={inventory} />
          )}
        </div>
      </div>
      <AdminInventoryClient inventory={inventory} warehouses={warehouses} />
    </div>
  );
}
