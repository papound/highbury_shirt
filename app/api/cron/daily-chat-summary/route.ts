import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LINE_NOTIFY_API = "https://notify-api.line.me/api/notify";

async function sendLineNotify(token: string, message: string): Promise<void> {
  const body = new URLSearchParams({ message });
  const res = await fetch(LINE_NOTIFY_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("[Cron LINE Notify] Error:", text);
  }
}

export async function GET(req: NextRequest) {
  try {
    // ตรวจสอบความปลอดภัยเบื้องต้น (เช่น Authorization Header หรือ Token Query Parameter)
    // เพื่อป้องกันคนทั่วไปเรียกใช้ Cron Route นี้เล่นๆ
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "highbury_cron_secret";
    
    // หากมีค่า CRON_SECRET กำหนดไว้ในระบบ จะทำการเช็ค Token
    const url = new URL(req.url);
    const tokenParam = url.searchParams.get("token");

    if (process.env.CRON_SECRET && authHeader !== `Bearer ${cronSecret}` && tokenParam !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenAdmin = process.env.LINE_NOTIFY_TOKEN_ADMIN;
    if (!tokenAdmin) {
      return NextResponse.json({ error: "LINE_NOTIFY_TOKEN_ADMIN is not configured" }, { status: 500 });
    }

    // 1. ดึงแชทที่สถานะ requiresAdmin = true (แอดมินยังตอบไม่หมด)
    const pendingChats = await prisma.chatSession.findMany({
      where: {
        requiresAdmin: true,
        status: { not: "COMPLETED" },
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    // 2. ดึงออเดอร์ประเภท PENDING (ลูกค้ายังไม่ชำระเงิน/ไม่ได้อัปโหลดสลิป) ในรอบ 3 วันที่ผ่านมา
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 3);

    const pendingOrders = await prisma.order.findMany({
      where: {
        status: "PENDING",
        createdAt: { gte: dateLimit },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // 3. สร้างข้อความรายงานสรุปยอดตอนเช้า
    let message = `\n☀️ รายงานสรุปแชทค้างและออเดอร์ประจำเช้า\nแบรนด์ Highbury International\n`;
    message += `📅 วันที่: ${new Date().toLocaleDateString("th-TH")}\n`;
    message += `──────────────────\n`;

    // สรุปยอดแชทค้างหาแอดมิน
    message += `💬 แชทลูกค้าที่รอแอดมินตอบกลับ: ${pendingChats.length} รายการ\n`;
    if (pendingChats.length > 0) {
      pendingChats.forEach((chat, index) => {
        const lastMsg = chat.messages[0]?.content || "ไม่มีข้อความ";
        const truncatedMsg = lastMsg.length > 25 ? lastMsg.substring(0, 22) + "..." : lastMsg;
        message += `  ${index + 1}. LINE User: ${chat.lineUserId.substring(0, 8)}... (${truncatedMsg})\n`;
      });
    }

    message += `\n🛒 ออเดอร์ที่ค้างชำระเงิน (3 วันล่าสุด): ${pendingOrders.length} รายการ\n`;
    if (pendingOrders.length > 0) {
      pendingOrders.forEach((order, index) => {
        message += `  ${index + 1}. ออเดอร์ #${order.orderNumber} - คุณ ${order.guestName} (฿${order.total.toLocaleString()})\n`;
      });
    }

    message += `──────────────────\n`;
    message += `🔗 จัดการแชท: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/chats\n`;
    message += `🔗 จัดการออเดอร์: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/orders`;

    // 4. ส่งข้อความรายงานผ่าน LINE Notify
    await sendLineNotify(tokenAdmin, message);

    return NextResponse.json({
      success: true,
      summary: {
        pendingChatsCount: pendingChats.length,
        pendingOrdersCount: pendingOrders.length,
      },
    });
  } catch (err: any) {
    console.error("[GET /api/cron/daily-chat-summary] Error:", err);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}
