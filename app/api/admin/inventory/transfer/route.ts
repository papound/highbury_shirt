import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];

async function authorize() {
  const session = await auth();
  if (!session?.user?.role || !ALLOWED_ROLES.includes(session.user.role)) return null;
  return session;
}

// ── GET /api/admin/inventory/transfer — transfer history ─────────────────────
export async function GET() {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const transfers = await prisma.stockTransfer.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      transactionId: true,
      quantity: true,
      note: true,
      createdAt: true,
      fromWarehouse: { select: { id: true, name: true, uniqueKey: true } },
      toWarehouse: { select: { id: true, name: true, uniqueKey: true } },
      variant: { select: { sku: true, color: true, size: true, product: { select: { nameTh: true } } } },
      performedBy: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(transfers);
}

// ── POST /api/admin/inventory/transfer — transfer stock ──────────────────────
export async function POST(req: NextRequest) {
  const session = await authorize();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { fromWarehouseId, toWarehouseId, variantId, quantity, note, transactionId } = await req.json();

    if (!fromWarehouseId || !toWarehouseId || !variantId || !quantity) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }
    if (fromWarehouseId === toWarehouseId) {
      return NextResponse.json({ error: "คลังต้นทางและปลายทางต้องต่างกัน" }, { status: 400 });
    }
    if (quantity <= 0) {
      return NextResponse.json({ error: "จำนวนต้องมากกว่า 0" }, { status: 400 });
    }

    // Check source inventory
    const sourceInv = await prisma.inventory.findUnique({
      where: { variantId_warehouseId: { variantId, warehouseId: fromWarehouseId } },
    });
    if (!sourceInv || sourceInv.quantity < quantity) {
      return NextResponse.json({ error: `Stock ต้นทางไม่เพียงพอ (มี ${sourceInv?.quantity ?? 0})` }, { status: 400 });
    }

    // Validate all FK references before writing
    const [fromWH, toWH, variant, performer] = await Promise.all([
      prisma.warehouse.findUnique({ where: { id: fromWarehouseId }, select: { id: true } }),
      prisma.warehouse.findUnique({ where: { id: toWarehouseId }, select: { id: true } }),
      prisma.productVariant.findUnique({ where: { id: variantId }, select: { id: true } }),
      prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true } }),
    ]);
    if (!fromWH) return NextResponse.json({ error: `ไม่พบคลังต้นทาง: ${fromWarehouseId}` }, { status: 400 });
    if (!toWH) return NextResponse.json({ error: `ไม่พบคลังปลายทาง: ${toWarehouseId}` }, { status: 400 });
    if (!variant) return NextResponse.json({ error: `ไม่พบสินค้า: ${variantId}` }, { status: 400 });
    if (!performer) return NextResponse.json({ error: `session user id ไม่ถูกต้อง: ${session.user.id}` }, { status: 400 });

    // Check if destination inventory row exists
    const destInv = await prisma.inventory.findUnique({
      where: { variantId_warehouseId: { variantId, warehouseId: toWarehouseId } },
    });

    // Sequential writes — libsql does not support interactive transactions
    // Deduct from source
    await prisma.inventory.update({
      where: { variantId_warehouseId: { variantId, warehouseId: fromWarehouseId } },
      data: { quantity: { decrement: quantity } },
    });

    // Add to destination
    if (destInv) {
      await prisma.inventory.update({
        where: { variantId_warehouseId: { variantId, warehouseId: toWarehouseId } },
        data: { quantity: { increment: quantity } },
      });
    } else {
      await prisma.inventory.create({
        data: { variantId, warehouseId: toWarehouseId, quantity },
      });
    }

    // Record transfer history
    await prisma.stockTransfer.create({
      data: {
        fromWarehouseId,
        toWarehouseId,
        variantId,
        quantity,
        note: note || null,
        transactionId: transactionId || null,
        performedById: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Transfer error:", message);
    return NextResponse.json({ error: `โอนสินค้าล้มเหลว: ${message}` }, { status: 500 });
  }
}
