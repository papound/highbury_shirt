const LINE_NOTIFY_API = "https://notify-api.line.me/api/notify";

async function sendLineNotify(token: string, message: string): Promise<void> {
  // 1. ตรวจสอบการส่งแจ้งเตือนผ่าน LINE Messaging API (Push Message) หากมีการตั้งค่า ADMIN_LINE_USER_ID
  const adminUserId = process.env.ADMIN_LINE_USER_ID;
  if (adminUserId && !adminUserId.includes("PLACEHOLDER")) {
    const channelToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (channelToken) {
      try {
        const res = await fetch("https://api.line.me/v2/bot/message/push", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${channelToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: adminUserId,
            messages: [{ type: "text", text: message.trim() }],
          }),
        });
        if (res.ok) {
          return; // ส่งผ่าน LINE Push Message สำเร็จแล้ว ข้าม LINE Notify เก่าได้เลย
        } else {
          const errText = await res.text();
          console.error("[Admin Notify] Push message failed:", errText);
        }
      } catch (pushErr) {
        console.error("[Admin Notify] Push message exception:", pushErr);
      }
    }
  }

  // 2. LINE Notify เดิม (End of Service ไปเมื่อ 31 มีนาคม 2025)
  if (!token || token.includes("PLACEHOLDER")) return;

  try {
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
      console.error("[Line Notify] Error:", text);
    }
  } catch (err: any) {
    console.error("[Line Notify] Network/DNS failure:", err.message || err);
  }
}

/** Notify admin channel about a new order */
export async function notifyAdminNewOrder({
  orderNumber,
  total,
  customerName,
}: {
  orderNumber: string;
  total: number;
  customerName: string;
}) {
  const token = process.env.LINE_NOTIFY_TOKEN_ADMIN;
  if (!token) return;
  await sendLineNotify(
    token,
    `\n🛒 ออเดอร์ใหม่! #${orderNumber}\nลูกค้า: ${customerName}\nยอดรวม: ฿${total.toLocaleString()}\nรอการยืนยันการชำระเงิน`
  );
}

/** Notify admin channel when payment slip is uploaded */
export async function notifyAdminPaymentUploaded({
  orderNumber,
  customerName,
}: {
  orderNumber: string;
  customerName: string;
}) {
  const token = process.env.LINE_NOTIFY_TOKEN_ADMIN;
  if (!token) return;
  await sendLineNotify(
    token,
    `\n💳 อัพโหลดสลิปแล้ว! #${orderNumber}\nลูกค้า: ${customerName}\nกรุณาตรวจสอบและยืนยันการชำระเงิน`
  );
}

/** Notify admin when payment verified */
export async function notifyAdminPaymentVerified(orderNumber: string) {
  const token = process.env.LINE_NOTIFY_TOKEN_ADMIN;
  if (!token) return;
  await sendLineNotify(
    token,
    `\n✅ ยืนยันชำระเงินแล้ว #${orderNumber}\nกรุณาดำเนินการจัดส่งสินค้า`
  );
}

/** Notify admin when customer requests urgent human intervention */
export async function notifyAdminUrgentHelp(lineUserId: string, reason: string) {
  const token = process.env.LINE_NOTIFY_TOKEN_ADMIN;
  if (!token) return;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  await sendLineNotify(
    token,
    `\n🚨 ลูกค้าต้องการความช่วยเหลือด่วน!\nLINE ID: ${lineUserId}\nเหตุผล: ${reason}\n\nกรุณาเข้าจัดการในบอร์ดแอดมิน: ${baseUrl}/admin/chats`
  );
}
