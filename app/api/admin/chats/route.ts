import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF", "ACCOUNTANT"];
const LINE_PUSH_API = "https://api.line.me/v2/bot/message/push";

/**
 * GET: ดึงรายการ Session การสนทนาทั้งหมดพร้อมข้อความล่าสุด
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await prisma.chatSession.findMany({
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: {
        lastActivity: "desc",
      },
    });

    return NextResponse.json(chats);
  } catch (err) {
    console.error("[GET /api/admin/chats] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST: แอดมินส่งข้อความพิมพ์ตอบสดไปยังลูกค้า LINE OA (พร้อมหยุดการคุยของบอทชั่วคราว)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, text } = await req.json();
    if (!sessionId || !text || !text.trim()) {
      return NextResponse.json({ error: "Bad Request: Missing parameters" }, { status: 400 });
    }

    const chatSession = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!chatSession) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    // 1. ส่งข้อความสดหาลูกค้าผ่าน LINE OA Push Message API
    const lineAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (!lineAccessToken) {
      return NextResponse.json({ error: "LINE configuration missing" }, { status: 500 });
    }

    const lineResponse = await fetch(LINE_PUSH_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lineAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: chatSession.lineUserId,
        messages: [
          {
            type: "text",
            text: text.trim(),
          },
        ],
      }),
    });

    if (!lineResponse.ok) {
      const errBody = await lineResponse.text();
      console.error("[Admin Send LINE] Failed to push message:", errBody);
      return NextResponse.json({ error: "Failed to send message to LINE API", details: errBody }, { status: 500 });
    }

    // 2. บันทึกข้อความของแอดมินลงใน ChatMessage DB
    const adminMessage = await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        sender: "ADMIN",
        messageType: "text",
        content: text.trim(),
      },
    });

    // 3. ปรับสถานะ Session อัตโนมัติ:
    //    - เปลี่ยน status = PAUSED (เพื่อหยุดบอท ให้แอดมินคุยสดจนจบ)
    //    - เคลียร์ requiresAdmin = false (เพราะแอดมินเข้ามาตอบแล้ว)
    await prisma.chatSession.update({
      where: { id: chatSession.id },
      data: {
        status: "PAUSED",
        requiresAdmin: false,
        lastActivity: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: adminMessage });
  } catch (err) {
    console.error("[POST /api/admin/chats] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
