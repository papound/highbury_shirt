import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];

async function authorize() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) return null;
  return session;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { titleTh, titleEn, excerpt, contentTh, contentEn, isPublished } = body;

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const wasPublished = existing?.status === "PUBLISHED";
  const status = isPublished ? "PUBLISHED" : "DRAFT";

  await prisma.blogPost.update({
    where: { id },
    data: {
      titleTh,
      titleEn,
      excerpt: excerpt || null,
      contentTh,
      contentEn: contentEn || "",
      status,
      publishedAt: isPublished && !wasPublished ? new Date() : existing?.publishedAt,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
