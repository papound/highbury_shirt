export const dynamic = "force-dynamic";
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
  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.max(1, parseInt(req.nextUrl.searchParams.get("pageSize") ?? "20", 10) || 20);

  const numericQ = Number(q.replace(/^CUS-/i, ""));
  const isNumeric =
    q !== "" &&
    !Number.isNaN(numericQ) &&
    Number.isInteger(numericQ) &&
    numericQ > 0 &&
    numericQ <= 2147483647;

  const userWhere = {
    role: "CUSTOMER" as const,
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
            ...(isNumeric ? [{ customerNo: numericQ }] : []),
          ],
        }
      : {}),
  };

  // Fetch registered customers with pagination + count + matching orders (when q is provided)
  const [users, total, orders] = await Promise.all([
    prisma.user.findMany({
      where: userWhere,
      select: {
        id: true,
        customerNo: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: userWhere }),
    q
      ? prisma.order.findMany({
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
        })
      : Promise.resolve([]),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return NextResponse.json({
    users,
    orders,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  });
}
