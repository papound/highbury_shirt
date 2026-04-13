import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/promotions — returns all active auto-apply promotions (no code required)
export async function GET() {
  try {
    const now = new Date();
    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        code: null,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
    });
    return NextResponse.json(promotions);
  } catch {
    return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 });
  }
}
