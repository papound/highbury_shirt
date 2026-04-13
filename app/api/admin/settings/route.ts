import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN"];

async function authorize() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) return null;
  return session;
}

export async function POST(req: NextRequest) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { promptpayId, promptpayName } = await req.json();

  await Promise.all([
    prisma.siteSetting.upsert({
      where: { key: "promptpay_id" },
      update: { value: promptpayId },
      create: { key: "promptpay_id", value: promptpayId },
    }),
    prisma.siteSetting.upsert({
      where: { key: "promptpay_name" },
      update: { value: promptpayName },
      create: { key: "promptpay_name", value: promptpayName },
    }),
  ]);

  return NextResponse.json({ success: true });
}
