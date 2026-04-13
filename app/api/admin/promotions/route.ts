import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN"];

async function authorize() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) return null;
  return session;
}

export async function GET() {
  const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(
    promotions.map((p) => ({
      ...p,
      nameEn: p.name,
      rules: p.rulesJson ? JSON.parse(p.rulesJson) : {},
    }))
  );
}

export async function POST(req: NextRequest) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { nameTh, nameEn, code, type, discountValue, buyQuantity, getQuantity, minOrderAmount, maxDiscountAmount, isActive, startsAt, endsAt, usageLimit } = body;

    const rules: Record<string, unknown> = {};
    if (type === "BUY_X_GET_Y") {
      rules.buyQuantity = Number(buyQuantity ?? 3);
      rules.getQuantity = Number(getQuantity ?? 1);
    }
    if (minOrderAmount) rules.minOrderAmount = Number(minOrderAmount);
    if (maxDiscountAmount) rules.maxDiscountAmount = Number(maxDiscountAmount);

    const promo = await prisma.promotion.create({
      data: {
        name: nameEn || nameTh || "",
        nameTh: nameTh || null,
        code: code || null,
        type,
        discountValue: discountValue || null,
        rulesJson: JSON.stringify(rules),
        isActive: isActive ?? true,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        usageLimit: usageLimit || null,
      },
    });

    return NextResponse.json({ ...promo, nameEn: promo.name, rules }, { status: 201 });
  } catch (err) {
    console.error("Create promotion error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
