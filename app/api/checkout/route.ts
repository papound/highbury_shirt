import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { generatePromptPayPayload } from "@/lib/promptpay";
import { notifyAdminNewOrder } from "@/lib/line-notify";
import { sendOrderConfirmation } from "@/lib/email";
import { evaluatePromotions } from "@/lib/promotions";
import { calcShippingFee } from "@/lib/shipping";
import type { CartItem } from "@/types";

const cartItemSchema = z.object({
  variantId: z.string(),
  productId: z.string(),
  productName: z.string(),
  productNameTh: z.string(),
  slug: z.string(),
  color: z.string(),
  size: z.string(),
  sku: z.string(),
  imageUrl: z.string(),
  unitPrice: z.number(),
  quantity: z.number().min(1),
});

const checkoutSchema = z.object({
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(9),
  shippingName: z.string().optional(),
  shippingPhone: z.string().optional(),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingProvince: z.string().optional(),
  shippingPostcode: z.string().optional(),
  note: z.string().optional(),
  items: z.array(cartItemSchema).min(1),
  promotionCode: z.string().optional(),
  deliveryMethod: z.enum(["delivery", "pickup"]).default("delivery"),
});

function generateOrderNumber(): string {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `HBI${ymd}${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;

    // Validate stock availability
    for (const item of data.items) {
      const inventory = await prisma.inventory.findFirst({
        where: { variantId: item.variantId },
        orderBy: { quantity: "desc" },
      });
      if (!inventory || inventory.quantity < item.quantity) {
        return NextResponse.json(
          { error: `สินค้า SKU ${item.sku} ไม่เพียงพอ` },
          { status: 400 }
        );
      }
    }

    // Apply promotions
    const allPromotions = await prisma.promotion.findMany({
      where: { isActive: true },
    });
    const applicablePromos = evaluatePromotions(data.items as CartItem[], allPromotions);

    // Apply code-based promotion if provided
    if (data.promotionCode) {
      const codePromo = await prisma.promotion.findFirst({
        where: { code: data.promotionCode, isActive: true },
      });
      if (!codePromo) {
        return NextResponse.json({ error: "รหัสโปรโมชั่นไม่ถูกต้อง" }, { status: 400 });
      }
      // Apply the code promo if not already in auto-applied list
      const alreadyApplied = applicablePromos.some((p) => p.promotionId === codePromo.id);
      if (!alreadyApplied) {
        const codeResults = evaluatePromotions(data.items as CartItem[], [codePromo]);
        applicablePromos.push(...codeResults);
      }
    }

    const subtotal = data.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const discountAmount = applicablePromos.reduce((s, p) => s + p.discountAmount, 0);
    const totalQty = data.items.reduce((s, i) => s + i.quantity, 0);
    const hasFreeShippingPromo = applicablePromos.some((p) => p.promotionType === "FREE_SHIPPING");
    const shippingFee = calcShippingFee(totalQty, {
      isPickup: data.deliveryMethod === "pickup",
      hasFreeShippingPromo,
    });
    const total = Math.max(0, subtotal - discountAmount) + shippingFee;

    // Create order in DB
    const isPickup = data.deliveryMethod === "pickup";
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session?.user?.id ?? null,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        isPickup,
        shippingName: data.shippingName ?? "",
        shippingPhone: data.shippingPhone ?? "",
        shippingAddress: data.shippingAddress ?? "",
        shippingCity: data.shippingCity ?? "",
        shippingProvince: data.shippingProvince ?? "",
        shippingPostcode: data.shippingPostcode ?? "",
        note: data.note,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        items: {
          create: data.items.map((item) => ({
            variantId: item.variantId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
          })),
        },
      },
    });

    // Generate PromptPay QR payload
    const qrPayload = generatePromptPayPayload(total);

    // Fire-and-forget notifications
    Promise.all([
      sendOrderConfirmation({
        to: data.guestEmail,
        orderNumber: order.orderNumber,
        total,
      }).catch(console.error),
      notifyAdminNewOrder({
        orderNumber: order.orderNumber,
        total,
        customerName: data.guestName,
      }).catch(console.error),
    ]);

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      total,
      qrPayload,
    });
  } catch (err) {
    console.error("[POST /api/checkout]", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่" }, { status: 500 });
  }
}
