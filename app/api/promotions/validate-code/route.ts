export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { evaluatePromotions } from "@/lib/promotions";
import type { CartItem } from "@/types";

const cartItemSchema = z
  .object({
    variantId: z.string().min(1).max(100),
    productId: z.string().min(1).max(100),
    productName: z.string().max(300).optional().default(""),
    productNameTh: z.string().max(300).optional().default(""),
    slug: z.string().max(300).optional().default(""),
    color: z.string().max(100).optional().default(""),
    size: z.string().max(50).optional().default(""),
    sku: z.string().max(100).optional().default(""),
    imageUrl: z.string().max(2048).optional().default(""),
    unitPrice: z.number().min(0).max(10_000_000),
    quantity: z.number().int().min(1).max(1000),
    stock: z.number().int().min(0).nullable().optional(),
  })
  .strict();

const validateCodeSchema = z
  .object({
    code: z.string().trim().min(1, "กรุณากรอกรหัสโปรโมชัน").max(100),
    items: z.array(cartItemSchema).min(1, "กรุณามีสินค้าในตะกร้า").max(100),
  })
  .strict();

// POST /api/promotions/validate-code
// Body: { code: string, items: CartItem[] }
export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "ข้อมูลคำขอไม่ถูกต้อง" }, { status: 400 });
    }

    const parsed = validateCodeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "กรุณากรอกรหัสโปรโมชันและมีสินค้าในตะกร้า",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { code: cleanCode, items } = parsed.data;
    const cartItems: CartItem[] = items.map((item) => ({
      ...item,
      stock: item.stock ?? 0,
    }));

    const now = new Date();
    const isDefaultPromo = ["ซื้อ 3 แถม 1", "ซื้อ3แถม1", "buy3get1", "buy 3 get 1", "3get1", "3แถม1"].includes(cleanCode) || cleanCode.toLowerCase() === "promo-buy3get1";
    const promo = await prisma.promotion.findFirst({
      where: {
        isActive: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
          isDefaultPromo
            ? { id: "promo-buy3get1" }
            : {
                OR: [
                  { code: cleanCode.toUpperCase() },
                  { code: cleanCode },
                  { name: cleanCode },
                  { nameTh: cleanCode },
                  { name: cleanCode.replace(/\s+/g, "") },
                  { nameTh: cleanCode.replace(/\s+/g, "") }
                ]
              }
        ],
      },
    });

    if (!promo) {
      return NextResponse.json({ error: "รหัสโปรโมชันไม่ถูกต้องหรือหมดอายุแล้ว" }, { status: 404 });
    }

    if (promo.usageLimit != null && promo.usageCount >= promo.usageLimit) {
      return NextResponse.json({ error: "รหัสโปรโมชันถูกใช้งานเต็มจำนวนแล้ว" }, { status: 400 });
    }

    const results = evaluatePromotions(cartItems, [promo]);
    if (!results.length) {
      return NextResponse.json({ error: "ไม่สามารถใช้รหัสโปรโมชันนี้กับสินค้าในตะกร้าได้" }, { status: 400 });
    }

    return NextResponse.json({ ...results[0], fromCode: true });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
