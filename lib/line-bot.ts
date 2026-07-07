import crypto from "crypto";
import { prisma } from "./prisma";
import { runChatbotTurn } from "./llm-agent";
import { notifyAdminNewOrder, notifyAdminUrgentHelp } from "./line-notify"; // ใช้สำหรับการแจ้งเตือน admin
import { generatePromptPayPayload } from "./promptpay";

const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message/reply";

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
 * ฟังก์ชันดึงชื่อโปรไฟล์และรูปภาพของลูกค้าจาก LINE API
 */
async function fetchLineProfile(lineUserId: string): Promise<{ displayName: string; pictureUrl?: string } | null> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(`https://api.line.me/v2/bot/profile/${lineUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.warn(`[LINE BOT] Failed to fetch profile for ${lineUserId}, status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return {
      displayName: data.displayName,
      pictureUrl: data.pictureUrl,
    };
  } catch (err) {
    console.error(`[LINE BOT] Error fetching profile for ${lineUserId}:`, err);
    return null;
  }
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
    const profile = await fetchLineProfile(lineUserId);
    session = await prisma.chatSession.create({
      data: {
        lineUserId,
        status: "ACTIVE",
        lineDisplayName: profile?.displayName || null,
        linePictureUrl: profile?.pictureUrl || null,
      },
      include: {
        messages: true,
      },
    });
  } else if (!session.lineDisplayName) {
    // ถ้าพบเซสชันเดิมแต่ไม่มีข้อมูลชื่อโปรไฟล์ ให้พยายามดึงข้อมูลและอัปเดตเสริมเข้าฐานข้อมูล
    const profile = await fetchLineProfile(lineUserId);
    if (profile) {
      session = await prisma.chatSession.update({
        where: { id: session.id },
        data: {
          lineDisplayName: profile.displayName,
          linePictureUrl: profile.pictureUrl || null,
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }
  }

  // 2. จัดการแชทตามประเภทเหตุการณ์ (Event Types)
  if (event.type === "postback") {
    const postbackData = event.postback?.data || "";
    // ใช้ URL เสมือนในการแยกวิเคราะห์ query string
    const urlParams = new URL(postbackData.includes("?") ? postbackData : `?${postbackData}`, "http://localhost");
    const action = urlParams.searchParams.get("action");
    
    if (action === "pay") {
      const orderNumber = urlParams.searchParams.get("orderNumber") || "";
      const totalStr = urlParams.searchParams.get("total") || "0";
      const amountVal = parseFloat(totalStr);
      
      console.log(`[LINE BOT] Received payment postback for order ${orderNumber}, amount: ${amountVal}`);
      
      // บันทึก Log การคลิกปุ่มชำระเงินลงฐานข้อมูลเป็น CUSTOMER action เพื่อให้แอดมินเห็นในระบบหลังบ้าน
      await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          sender: "CUSTOMER",
          messageType: "text",
          content: `[กดปุ่มสแกนชำระเงินสำหรับออเดอร์ #${orderNumber} ยอดรวม ฿${amountVal.toLocaleString()}]`,
        },
      });

      // สร้าง QR Payload
      const qrData = generatePromptPayPayload(amountVal);
      let qrAmount = "";
      const amountMatch = qrData.match(/54(\d{2})(\d+(\.\d{2})?)/);
      if (amountMatch) {
        const len = parseInt(amountMatch[1], 10);
        const val = amountMatch[2];
        if (val.length === len) {
          qrAmount = val;
        }
      }
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const cleanBaseUrl = baseUrl.replace(/\/$/, "");
      const qrImageUrl = `${cleanBaseUrl}/api/promptpay-card?qr=${encodeURIComponent(qrData)}&amount=${qrAmount}&phone=${process.env.PROMPTPAY_ID || "0981466416"}&name=${encodeURIComponent(process.env.PROMPTPAY_NAME || "")}`;
      
      const replyMsg = `กรุณาสแกน QR Code ด้านล่างนี้เพื่อชำระเงินจำนวน ฿${amountVal.toLocaleString()} สำหรับออเดอร์หมายเลข #${orderNumber} ค่ะ`;

      // บันทึก Log การส่งการ์ด QR บอทตอบกลับ
      await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          sender: "BOT",
          messageType: "text",
          content: `${replyMsg} (ส่ง QR Code การ์ดภาพ)`,
        },
      });

      // ส่งตอบกลับ LINE (ข้อความ + การ์ด QR ภาพพร้อมเพย์)
      await replyToLine(event.replyToken, [
        {
          type: "text",
          text: replyMsg
        },
        {
          type: "image",
          originalContentUrl: qrImageUrl,
          previewImageUrl: qrImageUrl,
        }
      ]);
    } else if (action === "kbank") {
      const orderNumber = urlParams.searchParams.get("orderNumber") || "";
      const totalStr = urlParams.searchParams.get("total") || "0";
      const amountVal = parseFloat(totalStr);
      
      console.log(`[LINE BOT] Received bank transfer postback for order ${orderNumber}, amount: ${amountVal}`);
      
      // บันทึก Log การคลิกปุ่มโอนเงินลงฐานข้อมูลเป็น CUSTOMER action เพื่อให้แอดมินเห็นในระบบหลังบ้าน
      await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          sender: "CUSTOMER",
          messageType: "text",
          content: `[กดปุ่มโอนเงินธนาคารสำหรับออเดอร์ #${orderNumber} ยอดรวม ฿${amountVal.toLocaleString()}]`,
        },
      });

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const cleanBaseUrl = baseUrl.replace(/\/$/, "");
      const kbankImageUrl = `${cleanBaseUrl}/images/kbank-payment.jpg`;
      
      const replyMsg = `กรุณาโอนเงินจำนวน ฿${amountVal.toLocaleString()} สำหรับออเดอร์หมายเลข #${orderNumber} มาที่บัญชีธนาคารด้านล่างนี้ และส่งรูปสลิปเพื่อยืนยันนะคะ\n\nธนาคาร: กสิกรไทย (KBank)\nเลขบัญชี: 050-1-91029-5\nชื่อบัญชี: บจก. ธงธัญ 99`;

      // บันทึก Log การส่งช่องทางโอนเงิน บอทตอบกลับ
      await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          sender: "BOT",
          messageType: "text",
          content: `${replyMsg} (ส่งภาพช่องทางชำระเงินกสิกรไทย)`,
        },
      });

      // ส่งตอบกลับ LINE (ข้อความ + ภาพเลขบัญชี KBank)
      await replyToLine(event.replyToken, [
        {
          type: "text",
          text: replyMsg
        },
        {
          type: "image",
          originalContentUrl: kbankImageUrl,
          previewImageUrl: kbankImageUrl,
        }
      ]);
    }
    return;
  }

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
    }

    if (botResult.flexMessage) {
      // หากเป็นแบบ Carousel (แสดงรายการออเดอร์ทั้งหมด) ให้ส่งข้อความแนะนำ/ทักทายของบอทด้วย
      if (botResult.flexMessage.contents?.type === "carousel" && cleanedText) {
        messagesToSend.push({ type: "text", text: cleanedText });
      }
      messagesToSend.push(botResult.flexMessage);
      
      const hasPaymentButton = botResult.flexMessage.contents?.footer?.contents?.some(
        (btn: any) => btn.action?.data?.includes("action=pay") || btn.action?.data?.includes("action=kbank")
      );
      
      if (hasPaymentButton) {
        if (botResult.hasVat) {
          // หากเป็นบิล VAT ไม่ต้อง gen qr card ให้ส่งภาพบัญชีกสิกรไทยแทน
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
          const cleanBaseUrl = baseUrl.replace(/\/$/, "");
          const kbankImageUrl = `${cleanBaseUrl}/images/kbank-payment.jpg`;
          
          messagesToSend.push({
            type: "image",
            originalContentUrl: kbankImageUrl,
            previewImageUrl: kbankImageUrl,
          });
        } else if (qrImageUrl) {
          // ออเดอร์ปกติ: ส่งการ์ด QR code พร้อมเพย์
          messagesToSend.push({
            type: "image",
            originalContentUrl: qrImageUrl,
            previewImageUrl: qrImageUrl,
          });
        }
      }
    } else {
      if (cleanedText) {
        messagesToSend.push({ type: "text", text: cleanedText });
      }
      if (qrImageUrl) {
        messagesToSend.push({
          type: "image",
          originalContentUrl: qrImageUrl,
          previewImageUrl: qrImageUrl,
        });
      }
    }

    if (messagesToSend.length === 0) {
      messagesToSend.push({ type: "text", text: "ทำรายการเรียบร้อยแล้วค่ะ" });
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
