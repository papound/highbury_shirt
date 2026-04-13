import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v3";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF", "ACCOUNTANT"];

const editSchema = z.object({
  guestName: z.string().min(1).optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  isPickup: z.boolean().optional(),
  shippingName: z.string().optional(),
  shippingPhone: z.string().optional(),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingProvince: z.string().optional(),
  shippingPostcode: z.string().optional(),
  note: z.string().optional(),
  trackingNumber: z.string().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = editSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const updateData: Record<string, unknown> = {};
  const d = parsed.data;
  if (d.isPickup !== undefined) updateData.isPickup = d.isPickup;
  if (d.guestName !== undefined) updateData.guestName = d.guestName;
  if (d.guestEmail !== undefined) {
    updateData.guestEmail = d.guestEmail;
    // Re-link userId if email changed
    const user = await prisma.user.findUnique({ where: { email: d.guestEmail }, select: { id: true } });
    updateData.userId = user?.id ?? order.userId ?? null;
  }
  if (d.guestPhone !== undefined) updateData.guestPhone = d.guestPhone;
  if (d.shippingName !== undefined) updateData.shippingName = d.shippingName;
  if (d.shippingPhone !== undefined) updateData.shippingPhone = d.shippingPhone;
  if (d.shippingAddress !== undefined) updateData.shippingAddress = d.shippingAddress;
  if (d.shippingCity !== undefined) updateData.shippingCity = d.shippingCity;
  if (d.shippingProvince !== undefined) updateData.shippingProvince = d.shippingProvince;
  if (d.shippingPostcode !== undefined) updateData.shippingPostcode = d.shippingPostcode;
  if (d.note !== undefined) updateData.note = d.note;
  if (d.trackingNumber !== undefined) updateData.trackingNumber = d.trackingNumber;

  await prisma.order.update({ where: { id }, data: updateData });

  return NextResponse.json({ success: true });
}
