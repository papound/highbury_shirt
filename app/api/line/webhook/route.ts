import { NextRequest, NextResponse } from "next/server";
import { verifySignature, handleLineEvent } from "@/lib/line-bot";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-line-signature");
    if (!signature) {
      console.warn("[LINE Webhook] Missing x-line-signature header.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // อ่าน Request Body เป็นแบบดิบ (Raw String) เพื่อเอาไปเช็คลายเซ็น SHA256
    const rawBody = await req.text();

    // ตรวจสอบลายเซ็น
    const isValid = verifySignature(rawBody, signature);
    if (!isValid) {
      console.warn("[LINE Webhook] Invalid x-line-signature.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const events = body.events || [];

    // ดำเนินการประมวลผลแต่ละ Event แบบ Async ในเบื้องหลัง (เพื่อตอบกลับ LINE ทันทีใน 200 OK ป้องกันการรีไทร์ซ้ำซ้อน)
    for (const event of events) {
      handleLineEvent(event).catch((eventError) => {
        console.error("[LINE Webhook] Error handling individual event:", eventError);
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[LINE Webhook Exception]:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
