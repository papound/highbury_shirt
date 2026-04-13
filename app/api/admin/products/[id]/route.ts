import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];

async function authorize() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) return null;
  return session;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { nameTh, name, descTh, description, basePrice, categoryId, warehouseId, status, isFeatured, variants, images } = body;

    // Use specified warehouse, fallback to first active warehouse
    const warehouse = warehouseId
      ? await prisma.warehouse.findUnique({ where: { id: warehouseId } })
      : await prisma.warehouse.findFirst({ where: { isActive: true } });

    // Update product basic info
    await prisma.product.update({
      where: { id },
      data: { nameTh, name, descTh, description, basePrice, categoryId, status, isFeatured },
    });

    // Replace images: delete old, create new
    if (Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((img: { url: string; isPrimary: boolean }, i: number) => ({
            productId: id,
            url: img.url,
            isPrimary: img.isPrimary ?? i === 0,
            sortOrder: i,
          })),
        });
      }
    }

    // Upsert variants
    for (const v of variants) {
      if (v.id) {
        await prisma.productVariant.update({
          where: { id: v.id },
          data: { color: v.color, colorHex: v.colorHex, size: v.size, sku: v.sku, price: v.price },
        });
        // Update inventory stock
        if (warehouse) {
          await prisma.inventory.upsert({
            where: { variantId_warehouseId: { variantId: v.id, warehouseId: warehouse.id } },
            update: { quantity: v.stock ?? 0 },
            create: { variantId: v.id, warehouseId: warehouse.id, quantity: v.stock ?? 0 },
          });
        }
      } else {
        // Create new variant
        const newVariant = await prisma.productVariant.create({
          data: { productId: id, color: v.color, colorHex: v.colorHex, size: v.size, sku: v.sku, price: v.price },
        });
        if (warehouse) {
          await prisma.inventory.create({
            data: { variantId: newVariant.id, warehouseId: warehouse.id, quantity: v.stock ?? 0 },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update product error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.product.update({ where: { id }, data: { status: "ARCHIVED" } });
  return NextResponse.json({ success: true });
}
