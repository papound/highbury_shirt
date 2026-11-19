export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];

async function authorize() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) return null;
  return session;
}

interface IncomingProductImage {
  url: string;
  isPrimary?: boolean;
  color?: string | null;
  altText?: string | null;
}

function normalizeProductImages(images: IncomingProductImage[]) {
  const valid = images
    .filter((img) => typeof img?.url === "string" && img.url.trim().length > 0)
    .map((img) => ({
      url: img.url.trim(),
      isPrimary: Boolean(img.isPrimary),
      altText: (img.color ?? img.altText)?.trim() || null,
    }));

  if (valid.length === 0) return [];

  const primaryIdx = valid.findIndex((img) => img.isPrimary);
  const effectivePrimaryIdx = primaryIdx === -1 ? 0 : primaryIdx;

  return [
    { ...valid[effectivePrimaryIdx], isPrimary: true },
    ...valid
      .filter((_, idx) => idx !== effectivePrimaryIdx)
      .map((img) => ({ ...img, isPrimary: false })),
  ];
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { nameTh, name, descTh, description, basePrice, categoryId, status, isFeatured, variants, images } = body;

    // Update product basic info
    await prisma.product.update({
      where: { id },
      data: { nameTh, name, descTh, description, basePrice, categoryId, status, isFeatured },
    });

    // Replace all product images (consolidated color-tagged model stored at product level with altText = color)
    if (Array.isArray(images)) {
      const normalizedImages = normalizeProductImages(images);
      await prisma.productImage.deleteMany({ where: { productId: id } });
      if (normalizedImages.length > 0) {
        await prisma.productImage.createMany({
          data: normalizedImages.map((img, i) => ({
            productId: id,
            variantId: null,
            url: img.url,
            altText: img.altText,
            isPrimary: img.isPrimary,
            sortOrder: i,
          })),
        });
      }
    }

    // Upsert variants
    for (const v of variants) {
      let variantId = v.id;
      if (variantId) {
        await prisma.productVariant.update({
          where: { id: variantId },
          data: { color: v.color, colorHex: v.colorHex, size: v.size, sku: v.sku, price: v.price },
        });
      } else {
        // Create new variant
        const newVariant = await prisma.productVariant.create({
          data: { productId: id, color: v.color, colorHex: v.colorHex, size: v.size, sku: v.sku, price: v.price },
        });
        variantId = newVariant.id;
      }

      // Upsert inventory per warehouse
      if (Array.isArray(v.inventoryByWarehouse)) {
        for (const inv of v.inventoryByWarehouse) {
          if (!inv.warehouseId) continue;
          await prisma.inventory.upsert({
            where: { variantId_warehouseId: { variantId, warehouseId: inv.warehouseId } },
            update: { quantity: inv.quantity ?? 0 },
            create: { variantId, warehouseId: inv.warehouseId, quantity: inv.quantity ?? 0 },
          });
        }
      }

      // Optional legacy support if a caller explicitly passes per-variant images
      const variantImages: IncomingProductImage[] = Array.isArray(v.variantImages) ? v.variantImages : [];
      if (variantImages.length > 0) {
        await prisma.productImage.deleteMany({ where: { variantId } });
        await prisma.productImage.createMany({
          data: variantImages.map((img, i) => ({
            productId: id,
            variantId,
            url: img.url,
            altText: (img.color ?? img.altText)?.trim() || v.color || null,
            isPrimary: img.isPrimary ?? i === 0,
            sortOrder: i,
          })),
        });
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
