import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];

async function authorize() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
    return null;
  }
  return session;
}

export async function POST(req: NextRequest) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { nameTh, name, descTh, description, basePrice, categoryId, status, isFeatured, variants, images } = body;

    const slug = slugify(name || nameTh, { lower: true, strict: true });

    const product = await prisma.product.create({
      data: {
        nameTh,
        name,
        slug,
        descTh,
        description,
        basePrice,
        categoryId,
        status,
        isFeatured,
        images: images?.length
          ? {
              create: images.map((img: { url: string; isPrimary: boolean }, i: number) => ({
                url: img.url,
                isPrimary: img.isPrimary ?? i === 0,
                sortOrder: i,
              })),
            }
          : undefined,
      },
    });

    // Create variants one-by-one to support per-variant images
    for (const v of variants ?? []) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          color: v.color,
          colorHex: v.colorHex,
          size: v.size,
          sku: v.sku,
          price: v.price,
        },
      });

      // Inventory per warehouse
      if (v.inventoryByWarehouse?.length) {
        for (const inv of v.inventoryByWarehouse.filter((i: any) => i.quantity > 0)) {
          await prisma.inventory.create({
            data: { variantId: variant.id, warehouseId: inv.warehouseId, quantity: inv.quantity },
          });
        }
      }

      // Variant images
      const variantImages: { url: string; isPrimary: boolean }[] = v.variantImages ?? [];
      if (variantImages.length > 0) {
        await prisma.productImage.createMany({
          data: variantImages.map((img, i) => ({
            productId: product.id,
            variantId: variant.id,
            url: img.url,
            isPrimary: img.isPrimary ?? i === 0,
            sortOrder: i,
          })),
        });
      }
    }

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, variants: true, images: { where: { variantId: null } } },
  });
  return NextResponse.json(products);
}

export async function DELETE() {
  const session = await auth();
  // Only SUPERADMIN can hard-delete all products
  if (session?.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized — SUPERADMIN only" }, { status: 403 });
  }

  try {
    // Must delete in FK-safe order:
    // 1. InventoryAdjustment → references Inventory (no cascade)
    await prisma.inventoryAdjustment.deleteMany({});
    // 2. StockTransfer → references ProductVariant (no cascade)
    await prisma.stockTransfer.deleteMany({});
    // 3. StockWithdrawal → references ProductVariant (no cascade)
    await prisma.stockWithdrawal.deleteMany({});
    // 4. OrderItem → references ProductVariant + Product (no cascade)
    await prisma.orderItem.deleteMany({});
    // 5. Product → cascades to ProductVariant → Inventory, ProductImage
    const { count } = await prisma.product.deleteMany({});
    return NextResponse.json({ deleted: count });
  } catch (err) {
    console.error("Clear products error:", err);
    return NextResponse.json({ error: "Failed to clear products" }, { status: 500 });
  }
}
