import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN"];

async function authorize() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) return null;
  return session;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  const rules: Record<string, unknown> = {};
  if (body.type === "BUY_X_GET_Y") {
    rules.buyQuantity = Number(body.buyQuantity ?? 3);
    rules.getQuantity = Number(body.getQuantity ?? 1);
  }
  if (body.minOrderAmount) rules.minOrderAmount = Number(body.minOrderAmount);
  if (body.maxDiscountAmount) rules.maxDiscountAmount = Number(body.maxDiscountAmount);

  await prisma.promotion.update({
    where: { id },
    data: {
      name: body.nameEn || body.nameTh || "",
      nameTh: body.nameTh || null,
      code: body.code || null,
      type: body.type,
      discountValue: body.discountValue || null,
      rulesJson: JSON.stringify(rules),
      isActive: body.isActive,
      startsAt: body.startsAt ? new Date(body.startsAt) : null,
      endsAt: body.endsAt ? new Date(body.endsAt) : null,
      usageLimit: body.usageLimit || null,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.promotion.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
