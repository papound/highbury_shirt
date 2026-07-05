import crypto from "crypto";
import { prisma } from "./prisma";
import { runChatbotTurn } from "./llm-agent";
import { notifyAdminNewOrder } from "./line-notify"; // ใช้สำหรับการแจ้งเตือน admin
import { generatePromptPayPayload } from "./promptpay";

const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message/reply";
const LINE_NOTIFY_API = "https://notify-api.line.me/api/notify";

/**
 * ฟังก์ชันส่งข้อความตอบกลับไปยัง LINE OA API
 */
async function replyToLine(replyToken: string, messages: any[]): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    console.error("[LINE BOT] Missing LINE_CHANNEL_ACCESS_TOKEN");
    return;
  }

  console.log("[LINE BOT] Sending reply to LINE. Payload:", JSON.stringify(messages, null, 2));

  const res = await fetch(LINE_MESSAGING_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      replyToken,
      messages,
    }),
  });

  console.log("[LINE BOT] LINE reply API response status:", res.status);

  if (!res.ok) {
    const errText = await res.text();
    console.error("[LINE BOT] Failed to reply:", errText);
  } else {
    console.log("[LINE BOT] Reply sent successfully.");
  }
}

/**
 * ส่งแจ้งเตือนด่วนหาแอดมินตัวจริงผ่าน LINE Notify (กรณีลูกค้าอยากพบแอดมิน)
 */
async function notifyAdminUrgentHelp(lineUserId: string, reason: string): Promise<void> {
  const notifyToken = process.env.LINE_NOTIFY_TOKEN_ADMIN;
  if (!notifyToken || notifyToken.includes("PLACEHOLDER")) return;

  const msg = `\n🚨 ลูกค้าต้องการความช่วยเหลือด่วน!\nLINE ID: ${lineUserId}\nเหตุผล: ${reason}\n\nกรุณาเข้าจัดการในบอร์ดแอดมิน: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/chats`;

  await fetch(LINE_NOTIFY_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${notifyToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ message: msg }).toString(),
  });
}

/**
 * ฟังก์ชันหลักในการตรวจสอบความถูกต้องของลายเซ็น LINE Webhook
 */
export function verifySignature(body: string, signature: string): boolean {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (!channelSecret) {
    console.error("[LINE BOT] Missing LINE_CHANNEL_SECRET");
    return false;
  }

  const hash = crypto
    .createHmac("sha256", channelSecret)
    .update(body)
    .digest("base64");

  return hash === signature;
}

/**
 * จัดการ LINE Event เดี่ยวๆ เช่น ข้อความตัวอักษร, follow, หรือ postback
 */
export async function handleLineEvent(event: any): Promise<void> {
  const lineUserId = event.source?.userId;
  if (!lineUserId) return;

  // 1. ตรวจสอบหรือสร้าง ChatSession ในระบบ
  let session = await prisma.chatSession.findUnique({
    where: { lineUserId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!session) {
    session = await prisma.chatSession.create({
      data: {
        lineUserId,
        status: "ACTIVE",
      },
      include: {
        messages: true,
      },
    });
  }

  // 2. จัดการแชทตามประเภทเหตุการณ์ (Event Types)
  if (event.type === "follow") {
    // ส่งข้อความต้อนรับ
    const welcomeMsg = "สวัสดีครับ ยินดีต้อนรับสู่แบรนด์เสื้อเชิ้ตสำเร็จรูป Highbury International ครับ 🎉\n\nผมคือ น้องไฮบิวรี่ ผู้ช่วยส่วนตัวของคุณ กำลังมองหาเสื้อเชิ้ตไซส์ไหน สีอะไร หรือต้องการดูโปรโมชั่นพิเศษอยู่ สามารถพิมพ์คุยกับผมได้เลยนะครับ!";
    
    // บันทึกลง DB
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: "BOT",
        messageType: "text",
        content: welcomeMsg,
      },
    });

    await replyToLine(event.replyToken, [{ type: "text", text: welcomeMsg }]);
    return;
  }

  if (event.type === "message" && event.message?.type === "text") {
    const userText = event.message.text.trim();

    // บันทึกข้อความของลูกค้าลงฐานข้อมูล
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: "CUSTOMER",
        messageType: "text",
        content: userText,
      },
    });

    // ตรวจสอบว่าแอดมินกด Pause บอทไว้หรือไม่ (แอดมินคุยสด)
    if (session.status === "PAUSED") {
      console.log(`[LINE BOT] Bot is paused for user ${lineUserId}. Ignoring.`);
      return;
    }

    // อัปเดตกิจกรรมล่าสุด
    await prisma.chatSession.update({
      where: { id: session.id },
      data: { lastActivity: new Date() },
    });

    // ดึงประวัติแชทย้อนหลัง (จำกัดไม่เกิน 20 ข้อความล่าสุด)
    const recentMessages = session.messages
      .slice(-20)
      .map((msg) => ({
        role: msg.sender === "CUSTOMER" ? ("user" as const) : ("model" as const),
        content: msg.content,
      }));

    // เรียก LLM Agent ประมวลผลและตอบกลับ
    const botResult = await runChatbotTurn(lineUserId, userText, recentMessages);

    // อัปเดตข้อมูล Session หากบอทส่งสัญญานเรียกแอดมินด่วน
    if (botResult.requiresAdmin) {
      await prisma.chatSession.update({
        where: { id: session.id },
        data: { requiresAdmin: true, status: "PAUSED" },
      });
      // ส่งแจ้งเตือนแอดมินด่วน
      await notifyAdminUrgentHelp(lineUserId, "ระบบบอทเรียกหาแอดมินด่วน / ปลดเพื่อคุยสด");
    }

    // บันทึกข้อความตอบกลับของบอทลงฐานข้อมูล
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: "BOT",
        messageType: "text",
        content: botResult.text,
      },
    });

    const messagesToSend: any[] = [];
    let qrImageUrl = "";
    let qrData = botResult.qrPayload;
    const qrMatch = botResult.text.match(/(000201[a-zA-Z0-9.]+)/);
    const promptpayIoMatch = botResult.text.match(/https?:\/\/promptpay\.io\/([0-9a-zA-Z]+)\/([0-9.]+)/i);

    if (promptpayIoMatch) {
      // หากบอทส่งลิงก์ promptpay.io มาโดยตรง ให้สกัดยอดเงินแล้วนำมาสร้างการ์ด PromptPay แบบสวยงามของร้านเราเอง
      try {
        const parsedAmount = promptpayIoMatch[2];
        const amountVal = parseFloat(parsedAmount);
        qrData = generatePromptPayPayload(amountVal);
      } catch (err) {
        console.error("[LINE BOT] Failed to generate payload from promptpay.io match:", err);
      }
    }

    if (!qrData && qrMatch) {
      qrData = qrMatch[1];
    }

    if (qrData) {
      // สกัดจำนวนเงินจาก QR Payload (ถ้ามีทศนิยม)
      let qrAmount = "";
      const amountMatch = qrData.match(/54(\d{2})(\d+(\.\d{2})?)/);
      if (amountMatch) {
        const len = parseInt(amountMatch[1], 10);
        const val = amountMatch[2];
        if (val.length === len) {
          qrAmount = val;
        }
      }
      // สร้าง URL สำหรับรูปภาพการ์ด PromptPay แบบสวยงามของเราเอง
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const cleanBaseUrl = baseUrl.replace(/\/$/, "");
      qrImageUrl = `${cleanBaseUrl}/api/promptpay-card?qr=${encodeURIComponent(qrData)}&amount=${qrAmount}&phone=${process.env.PROMPTPAY_ID || "0981466416"}&name=${encodeURIComponent(process.env.PROMPTPAY_NAME || "")}`;
    }

    let cleanedText = botResult.text;

    if (qrImageUrl) {
      // ตัดรหัสคิวอาร์โค้ดดิบ ลิงก์พร้อมเพย์ภายนอก และวงเล็บ Markdown ออกเพื่อให้ข้อความแชทสะอาดสวยงาม
      cleanedText = botResult.text
        .replace(/(000201[a-zA-Z0-9.]+)/g, "")
        .replace(/(https?:\/\/promptpay\.io\/[0-9a-zA-Z.\/]+)/gi, "")
        .replace(/\[\s*\]\(\s*\)/g, "")
        .replace(/\[\s*\]/g, "")
        .replace(/\(\s*\)/g, "")
        .replace(/`{3,}/g, "")
        .replace(/'{3,}/g, "")
        .replace(/(?:qrPayload|QR PromptPay|QR Code|พร้อมเพย์|PromptPay)?\s*:\s*/gi, "")
        .trim();

      if (!cleanedText) {
        cleanedText = "คุณลูกค้าสามารถชำระเงินโดยสแกนคิวอาร์โค้ดพร้อมเพย์ตามรูปภาพด้านล่างนี้ได้เลยค่ะ:";
      }

      messagesToSend.push({ type: "text", text: cleanedText });
      messagesToSend.push({
        type: "image",
        originalContentUrl: qrImageUrl,
        previewImageUrl: qrImageUrl,
      });
    } else {
      messagesToSend.push({ type: "text", text: cleanedText });
    }

    // ส่งตอบกลับ LINE
    await replyToLine(event.replyToken, messagesToSend);
  }

  // รองรับ Image Upload ใน LINE (สำหรับลูกค้าอัปโหลดสลิป หรือส่งภาพอื่นๆ)
  if (event.type === "message" && event.message?.type === "image") {
    const imageMessageId = event.message.id;
    const imageUrl = `https://api-data.line.me/v2/bot/message/${imageMessageId}/content`;

    // บันทึก Log การอัปโหลดภาพลงฐานข้อมูล
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: "CUSTOMER",
        messageType: "image",
        content: `Uploaded Image: ${imageUrl}`,
      },
    });

    let imagePart: any = undefined;
    try {
      const lineAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
      if (lineAccessToken) {
        const lineImgRes = await fetch(imageUrl, {
          headers: {
            Authorization: `Bearer ${lineAccessToken}`,
          },
        });
        if (lineImgRes.ok) {
          const arrayBuffer = await lineImgRes.arrayBuffer();
          const base64Data = Buffer.from(arrayBuffer).toString("base64");
          const contentType = lineImgRes.headers.get("content-type") || "image/jpeg";
          imagePart = {
            inlineData: {
              data: base64Data,
              mimeType: contentType,
            },
          };
        } else {
          console.warn("[LINE Bot] Failed to fetch image content from LINE API, status:", lineImgRes.status);
        }
      }
    } catch (err) {
      console.error("[LINE Bot] Error downloading image from LINE:", err);
    }

    // ดึงประวัติแชทย้อนหลัง (จำกัดไม่เกิน 20 ข้อความล่าสุด)
    const formattedHistory = session.messages
      .slice(-20)
      .map((msg) => ({
        role: msg.sender === "CUSTOMER" ? ("user" as const) : ("model" as const),
        content: msg.content,
      }));

    // เรียก LLM Agent ประมวลผลภาพแบบมัลติโมดัล (Multimodal)
    const { text: replyText, requiresAdmin } = await runChatbotTurn(
      event.source.userId!,
      `ส่งรูปภาพ: ${imageUrl}`,
      formattedHistory,
      imagePart
    );

    // บันทึกคำตอบบอทลงฐานข้อมูล
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: "BOT",
        messageType: "text",
        content: replyText,
      },
    });

    // อัปเดตสถานะความต้องการแอดมิน (ถ้ามีการขอพบแอดมิน)
    if (requiresAdmin) {
      await prisma.chatSession.update({
        where: { id: session.id },
        data: { requiresAdmin: true },
      });
    }

    // ตอบกลับผู้ใช้ใน LINE
    await replyToLine(event.replyToken, [{ type: "text", text: replyText }]);
  }
}
