import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN"];

async function authorize() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) return null;
  return session;
}

function generateUniqueKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let key = "WH-";
  for (let i = 0; i < 6; i++) key += chars[Math.floor(Math.random() * chars.length)];
  return key;
}

export async function GET() {
  const session = await authorize();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const warehouses = await prisma.warehouse.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(warehouses);
}

export async function POST(req: NextRequest) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, location } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  // Ensure uniqueKey doesn't collide
  let uniqueKey = generateUniqueKey();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await prisma.warehouse.findUnique({ where: { uniqueKey } });
    if (!existing) break;
    uniqueKey = generateUniqueKey();
    attempts++;
  }

  const warehouse = await prisma.warehouse.create({
    data: { name, location: location || null, uniqueKey },
  });

  return NextResponse.json(warehouse, { status: 201 });
}
