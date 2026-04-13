import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { inventoryId, delta, note } = await req.json();

    const inv = await prisma.inventory.findUnique({ where: { id: inventoryId } });
    if (!inv) return NextResponse.json({ error: "Inventory not found" }, { status: 404 });

    const newStock = inv.quantity + delta;
    if (newStock < 0) return NextResponse.json({ error: "Stock ไม่เพียงพอ" }, { status: 400 });

    await prisma.$transaction([
      prisma.inventory.update({
        where: { id: inventoryId },
        data: { quantity: newStock },
      }),
      prisma.inventoryAdjustment.create({
        data: {
          inventoryId,
          createdById: session.user.id,
          delta,
          note: note || null,
        },
      }),
    ]);

    return NextResponse.json({ success: true, newStock });
  } catch (err) {
    console.error("Inventory adjust error:", err);
    return NextResponse.json({ error: "ปรับ Stock ล้มเหลว" }, { status: 500 });
  }
}
