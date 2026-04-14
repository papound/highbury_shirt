import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN"];

async function authorize() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) return null;
  return session;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  try {
    const updated = await prisma.warehouse.update({
      where: { id },
      data: { name: name.trim() },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "ไม่พบคลังสินค้า" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await authorize();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only SUPERADMIN can delete warehouses
  if (session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "เฉพาะ Super Admin เท่านั้น" }, { status: 403 });
  }

  const { id } = await params;

  try {
    // Cascade: StockAdjustments for this warehouse's inventory → then inventory → then warehouse
    const inventories = await prisma.inventory.findMany({
      where: { warehouseId: id },
      select: { id: true },
    });
    const inventoryIds = inventories.map((inv) => inv.id);

    await prisma.$transaction([
      // Delete adjustments for this warehouse's inventory
      prisma.inventoryAdjustment.deleteMany({ where: { inventoryId: { in: inventoryIds } } }),
      // Delete inventory records
      prisma.inventory.deleteMany({ where: { warehouseId: id } }),
      // Delete related transfers (from/to) and withdrawals
      prisma.stockTransfer.deleteMany({ where: { OR: [{ fromWarehouseId: id }, { toWarehouseId: id }] } }),
      prisma.stockWithdrawal.deleteMany({ where: { warehouseId: id } }),
      // Delete the warehouse
      prisma.warehouse.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "ลบคลังสินค้าไม่สำเร็จ" }, { status: 500 });
  }
}
