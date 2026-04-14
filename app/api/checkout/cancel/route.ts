import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Allow customer to cancel their own PENDING order (before payment slip uploaded)
export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "ไม่พบคำสั่งซื้อ" }, { status: 404 });
    }

    // Only allow cancellation when order is still PENDING
    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "ไม่สามารถยกเลิกได้ เนื่องจากคำสั่งซื้อนี้ได้รับการชำระเงินแล้ว" },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/checkout/cancel]", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
