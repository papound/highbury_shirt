import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF", "ACCOUNTANT"];

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ customers: [], orders: [] });
  }

  // Search registered users
  const users = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
      OR: [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
      ],
    },
    select: {
      id: true,
      customerNo: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  // Search orders by guest info (includes both registered and guest customers)
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { guestName: { contains: q } },
        { guestEmail: { contains: q } },
        { guestPhone: { contains: q } },
        { shippingName: { contains: q } },
        { shippingPhone: { contains: q } },
        { orderNumber: { contains: q } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { select: { quantity: true, unitPrice: true } },
    },
  });

  return NextResponse.json({ users, orders });
}
