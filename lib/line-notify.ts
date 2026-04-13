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
    console.error("[Line Notify] Error:", text);
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
