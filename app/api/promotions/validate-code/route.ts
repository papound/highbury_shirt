import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluatePromotions } from "@/lib/promotions";
import type { CartItem } from "@/types";

// POST /api/promotions/validate-code
// Body: { code: string, items: CartItem[] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, items } = body as { code: string; items: CartItem[] };

    if (!code || !items?.length) {
      return NextResponse.json({ error: "กรุณากรอกรหัสโปรโมชันและมีสินค้าในตะกร้า" }, { status: 400 });
    }

    const now = new Date();
    const cleanCode = code.trim();
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

    const results = evaluatePromotions(items as CartItem[], [promo]);
    if (!results.length) {
      return NextResponse.json({ error: "ไม่สามารถใช้รหัสโปรโมชันนี้กับสินค้าในตะกร้าได้" }, { status: 400 });
    }

    return NextResponse.json({ ...results[0], fromCode: true });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
