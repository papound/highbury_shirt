export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || searchParams.get("search") || "").trim();

    if (!q) {
      return NextResponse.json({ results: [] });
    }

    const results = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { nameTh: { contains: q } },
          { name: { contains: q } },
          { descTh: { contains: q } },
          { description: { contains: q } },
          { category: { nameTh: { contains: q } } },
          { category: { name: { contains: q } } },
          { variants: { some: { color: { contains: q } } } },
        ],
      },
      select: {
        id: true,
        name: true,
        nameTh: true,
        slug: true,
        basePrice: true,
        category: {
          select: {
            name: true,
            nameTh: true,
          },
        },
        images: {
          take: 1,
          select: {
            url: true,
            altText: true,
          },
        },
      },
      take: 6,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Partial search error:", error);
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
  }
}
