import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { notifyAdminPaymentUploaded } from "@/lib/line-notify";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const orderId = formData.get("orderId") as string | null;

    if (!file || !orderId) {
      return NextResponse.json({ error: "Missing file or orderId" }, { status: 400 });
    }

    // Check allowed types
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Save file to public/uploads/slips/
    const uploadDir = path.join(process.cwd(), "public", "uploads", "slips");
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `${orderId}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const imageUrl = `/uploads/slips/${fileName}`;

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
