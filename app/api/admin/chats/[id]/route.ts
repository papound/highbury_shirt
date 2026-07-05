import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF", "ACCOUNTANT"];

/**
 * GET: ดึงรายละเอียดแชทเดี่ยวๆ พร้อมประวัติข้อความทั้งหมด
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const chatSession = await prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chatSession) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    return NextResponse.json(chatSession);
  } catch (err) {
    console.error("[GET /api/admin/chats/[id]] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PATCH: อัปเดตสถานะของบอทสนทนา (เปิดบอทใหม่ / สลับคุยสด / ปิดเคส)
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, requiresAdmin } = body;

    const chatSession = await prisma.chatSession.findUnique({
      where: { id },
    });

    if (!chatSession) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    // อัปเดตฟิลด์ที่ส่งเข้ามา
    const updatedSession = await prisma.chatSession.update({
      where: { id },
      data: {
        status: status ?? chatSession.status,
        requiresAdmin: requiresAdmin !== undefined ? requiresAdmin : chatSession.requiresAdmin,
        lastActivity: new Date(),
      },
    });

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (err) {
    console.error("[PATCH /api/admin/chats/[id]] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
