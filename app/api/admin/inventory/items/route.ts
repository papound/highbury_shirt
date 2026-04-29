import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  const allowed = ["SUPERADMIN", "ADMIN"];
  if (!session?.user?.role || !allowed.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const warehouseId = req.nextUrl.searchParams.get("warehouseId");

  const items = await prisma.inventory.findMany({
    where: warehouseId ? { warehouseId } : {},
    include: {
      variant: { include: { product: true } },
      warehouse: true,
    },
    orderBy: [
      { variant: { product: { nameTh: "asc" } } },
      { variant: { size: "asc" } },
    ],
  });

  return NextResponse.json(items);
}
