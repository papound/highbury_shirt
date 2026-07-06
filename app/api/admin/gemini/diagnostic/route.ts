import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN"];

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalProducts = await prisma.product.count();
    const totalVariants = await prisma.productVariant.count();
    const totalInventory = await prisma.inventory.count();

    const variants = await prisma.productVariant.findMany({
      where: { sku: { contains: "144535_5" } },
      include: {
        product: true,
        inventory: {
          include: { warehouse: true }
        }
      }
    });

    const inventoriesDirect = await prisma.inventory.findMany({
      where: {
        variant: {
          sku: { contains: "144535_5" }
        }
      },
      include: {
        variant: {
          include: { product: true }
        },
        warehouse: true
      }
    });

    return NextResponse.json({
      dbType: process.env.DATABASE_URL?.startsWith("postgres") ? "PostgreSQL" : "SQLite",
      stats: {
        totalProducts,
        totalVariants,
        totalInventory,
      },
      variantsSearch: variants.map(v => ({
        id: v.id,
        sku: v.sku,
        color: v.color,
        size: v.size,
        price: v.price,
        productName: v.product.nameTh,
        inventory: v.inventory.map(i => ({
          warehouse: i.warehouse.name,
          quantity: i.quantity
        }))
      })),
      inventoriesSearch: inventoriesDirect.map(i => ({
        id: i.id,
        warehouse: i.warehouse.name,
        quantity: i.quantity,
        sku: i.variant.sku,
        productName: i.variant.product.nameTh
      }))
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
