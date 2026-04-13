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

  const { name, location } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const warehouse = await prisma.warehouse.create({
    data: { name, location: location || null },
  });

  return NextResponse.json(warehouse, { status: 201 });
}
