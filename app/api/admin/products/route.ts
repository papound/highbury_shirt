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
    const { nameTh, name, descTh, description, basePrice, categoryId, warehouseId, status, isFeatured, variants, images } = body;

    const slug = slugify(name || nameTh, { lower: true, strict: true });

    // Use specified warehouse, fallback to first active warehouse
    const warehouse = warehouseId
      ? await prisma.warehouse.findUnique({ where: { id: warehouseId } })
      : await prisma.warehouse.findFirst({ where: { isActive: true } });

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
        variants: {
          create: variants.map((v: any) => ({
            color: v.color,
            colorHex: v.colorHex,
            size: v.size,
            sku: v.sku,
            price: v.price,
            inventory: warehouse
              ? {
                  create: [{ warehouseId: warehouse.id, quantity: v.stock ?? 0 }],
                }
              : undefined,
          })),
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, variants: true, images: true },
  });
  return NextResponse.json(products);
}
