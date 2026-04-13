import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentVerified, sendShippingNotification } from "@/lib/email";
import { notifyAdminPaymentVerified } from "@/lib/line-notify";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF", "ACCOUNTANT"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status, rejectionNote, trackingNumber } = await req.json();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { paymentProofs: { orderBy: { uploadedAt: "desc" }, take: 1 }, items: { include: { variant: { include: { product: true } } } } },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Status transition validation
  const validTransitions: Record<string, string[]> = {
    PENDING: ["PAYMENT_VERIFIED", "CANCELLED"],
    PAYMENT_UPLOADED: ["PAYMENT_VERIFIED", "PAYMENT_REJECTED"],
    PAYMENT_VERIFIED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED"],
    SHIPPED: ["DELIVERED"],
  };

  if (validTransitions[order.status] && !validTransitions[order.status].includes(status)) {
    return NextResponse.json({ error: `Cannot transition from ${order.status} to ${status}` }, { status: 400 });
  }

  // Update order
  await prisma.order.update({
    where: { id },
    data: {
      status,
      trackingNumber: trackingNumber ?? order.trackingNumber,
    },
  });

  // Update payment proof status
  const proof = order.paymentProofs[0];
  if (proof) {
    if (status === "PAYMENT_VERIFIED") {
      await prisma.paymentProof.update({
        where: { id: proof.id },
        data: { status: "APPROVED" },
      });
    } else if (status === "PAYMENT_REJECTED") {
      await prisma.paymentProof.update({
        where: { id: proof.id },
        data: { status: "REJECTED", rejectionNote: rejectionNote ?? null },
      });
    }
  }

  // Send notifications
  const email = order.guestEmail;
  if (email) {
    try {
      if (status === "PAYMENT_VERIFIED") {
        await sendPaymentVerified({ to: email, orderNumber: order.orderNumber });
        await notifyAdminPaymentVerified(order.orderNumber);
      } else if (status === "SHIPPED") {
        await sendShippingNotification({
          to: email,
          orderNumber: order.orderNumber,
          trackingNumber: trackingNumber ?? "",
        });
      }
    } catch {
      // Non-fatal
    }
  }

  return NextResponse.json({ success: true });
}
