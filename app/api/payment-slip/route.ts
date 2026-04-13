import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyAdminPaymentUploaded } from "@/lib/line-notify";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, orderId } = await req.json();

    if (!imageUrl || !orderId) {
      return NextResponse.json({ error: "Missing imageUrl or orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create PaymentProof record
    await prisma.paymentProof.create({
      data: {
        orderId,
        imageUrl,
        status: "PENDING",
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAYMENT_UPLOADED" },
    });

    // Notify admin via Line
    try {
      await notifyAdminPaymentUploaded({
        orderNumber: order.orderNumber,
        customerName: order.shippingName,
      });
    } catch {
      // Non-fatal: LINE notify failure shouldn't fail the request
    }

    return NextResponse.json({ success: true, imageUrl });
  } catch (err) {
    console.error("Payment slip upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
