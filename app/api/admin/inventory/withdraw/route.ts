import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
    const { warehouseId, variantId, quantity, reason } = await req.json();

    if (!warehouseId || !variantId || !quantity) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }
    if (quantity <= 0) {
      return NextResponse.json({ error: "จำนวนต้องมากกว่า 0" }, { status: 400 });
    }

    const inv = await prisma.inventory.findUnique({
      where: { variantId_warehouseId: { variantId, warehouseId } },
    });
    if (!inv || inv.quantity < quantity) {
      return NextResponse.json({ error: `Stock ไม่เพียงพอ (มี ${inv?.quantity ?? 0})` }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.inventory.update({
        where: { variantId_warehouseId: { variantId, warehouseId } },
        data: { quantity: { decrement: quantity } },
      }),
      prisma.stockWithdrawal.create({
        data: { warehouseId, variantId, quantity, reason: reason || null, performedById: session.user.id },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Withdrawal error:", message);
    return NextResponse.json({ error: `เบิกสินค้าล้มเหลว: ${message}` }, { status: 500 });
  }
}
