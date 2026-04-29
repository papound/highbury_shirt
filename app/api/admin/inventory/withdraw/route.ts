import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

async function authorizeSuperAdmin() {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "SUPERADMIN") return null;
  return session;
}

// ── GET — withdrawal history ─────────────────────────────────────────────────
export async function GET() {
  const session = await auth();
  const allowed = ["SUPERADMIN", "ADMIN"];
  if (!session?.user?.role || !allowed.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const withdrawals = await prisma.stockWithdrawal.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      warehouse: { select: { id: true, name: true, uniqueKey: true } },
      variant: { include: { product: { select: { nameTh: true } } } },
      performedBy: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(withdrawals);
}

// ── POST — withdraw stock ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await authorizeSuperAdmin();
  if (!session) return NextResponse.json({ error: "เฉพาะ Super Admin เท่านั้น" }, { status: 403 });

  try {
    const body = await req.json();
    const { warehouseId, reason } = body;

    // Support both single-item (legacy) and multi-item payloads
    const items: { variantId: string; quantity: number }[] =
      Array.isArray(body.items)
        ? body.items
        : [{ variantId: body.variantId, quantity: body.quantity }];

    if (!warehouseId || items.length === 0) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    for (const item of items) {
      if (!item.variantId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json({ error: "ข้อมูลรายการสินค้าไม่ถูกต้อง" }, { status: 400 });
      }
    }

    // Validate all stock levels before touching the DB
    const inventoryRecords = await prisma.inventory.findMany({
      where: {
        warehouseId,
        variantId: { in: items.map((i) => i.variantId) },
      },
    });

    for (const item of items) {
      const inv = inventoryRecords.find((r) => r.variantId === item.variantId);
      if (!inv || inv.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Stock ไม่เพียงพอสำหรับ variantId: ${item.variantId} (มี ${inv?.quantity ?? 0})` },
          { status: 400 }
        );
      }
    }

    // Generate one transactionId shared by all items in this request
    const transactionId = randomUUID();

    // Execute all updates in a single transaction
    await prisma.$transaction(
      items.flatMap((item) => [
        prisma.inventory.update({
          where: { variantId_warehouseId: { variantId: item.variantId, warehouseId } },
          data: { quantity: { decrement: item.quantity } },
        }),
        prisma.stockWithdrawal.create({
          data: {
            transactionId,
            warehouseId,
            variantId: item.variantId,
            quantity: item.quantity,
            reason: reason || null,
            performedById: session.user.id,
          },
        }),
      ])
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Withdrawal error:", message);
    return NextResponse.json({ error: `เบิกสินค้าล้มเหลว: ${message}` }, { status: 500 });
  }
}
