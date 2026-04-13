import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN"];

export async function POST() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const unlinkedOrders = await prisma.order.findMany({
    where: { userId: null, guestEmail: { not: null } },
    select: { id: true, orderNumber: true, guestEmail: true },
  });

  let linked = 0;
  const results: string[] = [];

  for (const order of unlinkedOrders) {
    if (!order.guestEmail) continue;
    const user = await prisma.user.findUnique({
      where: { email: order.guestEmail },
      select: { id: true },
    });
    if (user) {
      await prisma.order.update({ where: { id: order.id }, data: { userId: user.id } });
      results.push(`✓ #${order.orderNumber} → ${order.guestEmail}`);
      linked++;
    } else {
      results.push(`✗ #${order.orderNumber} (no account for ${order.guestEmail})`);
    }
  }

  return NextResponse.json({
    total: unlinkedOrders.length,
    linked,
    results,
  });
}
