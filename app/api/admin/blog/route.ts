import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];

async function authorize() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) return null;
  return session;
}

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await authorize();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { titleTh, titleEn, excerpt, contentTh, contentEn, authorId, isPublished } = body;

    const slug = slugify(titleEn || titleTh, { lower: true, strict: true });
    const status = isPublished ? "PUBLISHED" : "DRAFT";

    const post = await prisma.blogPost.create({
      data: {
        titleTh,
        titleEn,
        slug,
        excerpt: excerpt || null,
        contentTh: contentTh || "",
        contentEn: contentEn || "",
        status,
        authorId: authorId || session.user.id,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("Blog create error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
