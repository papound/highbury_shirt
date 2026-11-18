import { Resend } from "resend";

// Lazy init — avoid throwing at build time when RESEND_API_KEY is not set
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");
  }
  return _resend;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@highburyinternational.com";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Highbury International";
const ADMIN_PAYMENT_EMAIL = process.env.ADMIN_PAYMENT_NOTIFICATION_EMAIL ?? "highburyshirt@thongthan.com";

// ─── Order Confirmation ───────────────────────────────────────────────────────

export async function sendOrderConfirmation({
  to,
  orderNumber,
  total,
  locale = "th",
}: {
  to: string;
  orderNumber: string;
  total: number;
  locale?: "th" | "en";
}) {
  const subject =
    locale === "th"
      ? `[${APP_NAME}] ยืนยันคำสั่งซื้อ #${orderNumber}`
      : `[${APP_NAME}] Order Confirmation #${orderNumber}`;

  const html =
    locale === "th"
      ? `<p>ขอบคุณสำหรับคำสั่งซื้อ <strong>#${orderNumber}</strong> ยอดรวม <strong>฿${total.toLocaleString()}</strong></p><p>กรุณาชำระเงินผ่าน PromptPay และอัพโหลดสลิปที่ลิงค์ด้านล่าง</p>`
      : `<p>Thank you for your order <strong>#${orderNumber}</strong> total <strong>฿${total.toLocaleString()}</strong></p><p>Please complete payment via PromptPay and upload your slip.</p>`;

  return getResend().emails.send({ from: FROM, to, subject, html });
}

// ─── Payment Verified ─────────────────────────────────────────────────────────

export async function sendPaymentVerified({
  to,
  orderNumber,
  locale = "th",
}: {
  to: string;
  orderNumber: string;
  locale?: "th" | "en";
}) {
  const subject =
    locale === "th"
      ? `[${APP_NAME}] ยืนยันการชำระเงินแล้ว #${orderNumber}`
      : `[${APP_NAME}] Payment Verified #${orderNumber}`;

  const html =
    locale === "th"
      ? `<p>การชำระเงินสำหรับคำสั่งซื้อ <strong>#${orderNumber}</strong> ได้รับการยืนยันแล้ว เราจะดำเนินการจัดส่งโดยเร็ว</p>`
      : `<p>Your payment for order <strong>#${orderNumber}</strong> has been verified. We will process your shipment shortly.</p>`;

  return getResend().emails.send({ from: FROM, to, subject, html });
}

// ─── Shipping Notification ────────────────────────────────────────────────────

export async function sendShippingNotification({
  to,
  orderNumber,
  trackingNumber,
  locale = "th",
}: {
  to: string;
  orderNumber: string;
  trackingNumber?: string;
  locale?: "th" | "en";
}) {
  const subject =
    locale === "th"
      ? `[${APP_NAME}] จัดส่งแล้ว #${orderNumber}`
      : `[${APP_NAME}] Shipped #${orderNumber}`;

  const tracking = trackingNumber ? ` (${trackingNumber})` : "";
  const html =
    locale === "th"
      ? `<p>คำสั่งซื้อ <strong>#${orderNumber}</strong> ถูกจัดส่งแล้ว${tracking}</p>`
      : `<p>Order <strong>#${orderNumber}</strong> has been shipped${tracking}.</p>`;

  return getResend().emails.send({ from: FROM, to, subject, html });
}

// ─── Admin Payment Notification ───────────────────────────────────────────────

export interface AdminPaymentEmailItem {
  name: string;
  variant?: string;
  quantity: number;
  totalPrice: number;
}

export interface SendAdminPaymentNotificationParams {
  orderNumber: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  total: number;
  orderId: string;
  imageUrl?: string;
  items?: AdminPaymentEmailItem[];
}

export async function sendAdminPaymentNotification({
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  total,
  orderId,
  imageUrl,
  items = [],
}: SendAdminPaymentNotificationParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://highbury.papoundhomelab.ddnsgeek.com";
  const adminOrderUrl = `${appUrl}/admin/orders/${orderId}`;
  const subject = `[${APP_NAME}] แจ้งเตือนการชำระเงินใหม่ - คำสั่งซื้อ #${orderNumber} (฿${total.toLocaleString()})`;

  const itemsTableRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #1f2937;">
          <strong>${item.name}</strong>
          ${item.variant ? `<br/><span style="font-size: 12px; color: #6b7280;">${item.variant}</span>` : ""}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: center; color: #374151;">
          x${item.quantity}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: right; font-weight: 600; color: #111827;">
          ฿${item.totalPrice.toLocaleString()}
        </td>
      </tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 24px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
        .header { background-color: #0f172a; color: #ffffff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
        .body-content { padding: 24px; }
        .badge { display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
        .info-grid { background-color: #f8fafc; border-radius: 6px; padding: 16px; margin-bottom: 20px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .info-label { color: #64748b; }
        .info-value { font-weight: 600; color: #0f172a; text-align: right; }
        .table { width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 20px; }
        .button { display: inline-block; background-color: #0284c7; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; text-align: center; margin-top: 16px; }
        .slip-box { margin-top: 20px; padding: 16px; background-color: #f8fafc; border-radius: 6px; text-align: center; }
        .slip-img { max-width: 100%; max-height: 400px; border-radius: 4px; border: 1px solid #cbd5e1; }
        .footer { text-align: center; padding: 16px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>แจ้งเตือนการชำระเงินใหม่</h1>
          <p style="margin: 4px 0 0; font-size: 14px; color: #94a3b8;">Highbury International</p>
        </div>
        <div class="body-content">
          <span class="badge">สลิปอัปโหลดแล้ว รอตรวจสอบ</span>
          <p style="font-size: 15px; color: #334155; margin-top: 0;">
            ลูกค้าได้ทำการชำระเงินและอัปโหลดสลิปหลักฐานสำหรับคำสั่งซื้อ <strong>#${orderNumber}</strong> เรียบร้อยแล้ว
          </p>

          <div class="info-grid">
            <table style="width: 100%; font-size: 14px;">
              <tr><td style="color: #64748b; padding: 4px 0;">หมายเลขคำสั่งซื้อ:</td><td style="font-weight: 600; text-align: right;">#${orderNumber}</td></tr>
              <tr><td style="color: #64748b; padding: 4px 0;">ชื่อลูกค้า:</td><td style="font-weight: 600; text-align: right;">${customerName}</td></tr>
              ${customerPhone ? `<tr><td style="color: #64748b; padding: 4px 0;">เบอร์โทรศัพท์:</td><td style="font-weight: 600; text-align: right;"><a href="tel:${customerPhone}">${customerPhone}</a></td></tr>` : ""}
              ${customerEmail ? `<tr><td style="color: #64748b; padding: 4px 0;">อีเมลลูกค้า:</td><td style="font-weight: 600; text-align: right;">${customerEmail}</td></tr>` : ""}
              <tr><td style="color: #64748b; padding: 4px 0;">ยอดชำระเงินรวม:</td><td style="font-weight: 700; color: #0284c7; font-size: 16px; text-align: right;">฿${total.toLocaleString()}</td></tr>
            </table>
          </div>

          ${
            items.length > 0
              ? `
          <h3 style="font-size: 15px; color: #0f172a; margin-bottom: 8px;">รายการสินค้า (${items.length} รายการ)</h3>
          <table class="table">
            <thead>
              <tr style="background-color: #f8fafc; text-align: left;">
                <th style="padding: 8px; font-size: 12px; color: #64748b;">สินค้า</th>
                <th style="padding: 8px; font-size: 12px; color: #64748b; text-align: center;">จำนวน</th>
                <th style="padding: 8px; font-size: 12px; color: #64748b; text-align: right;">ราคา</th>
              </tr>
            </thead>
            <tbody>
              ${itemsTableRows}
            </tbody>
          </table>`
              : ""
          }

          ${
            imageUrl
              ? `
          <div class="slip-box">
            <p style="font-size: 13px; font-weight: 600; color: #475569; margin-top: 0;">หลักฐานการโอนเงิน (สลิป):</p>
            <a href="${imageUrl}" target="_blank">
              <img src="${imageUrl}" alt="Slip" class="slip-img" />
            </a>
            <p style="margin-bottom: 0; margin-top: 8px;">
              <a href="${imageUrl}" target="_blank" style="font-size: 12px; color: #0284c7;">คลิกเพื่อดูรูปภาพขนาดเต็ม &rarr;</a>
            </p>
          </div>`
              : ""
          }

          <div style="text-align: center; margin-top: 24px;">
            <a href="${adminOrderUrl}" class="button" target="_blank">
              เปิดตรวจสอบออเดอร์ในระบบ Admin &rarr;
            </a>
          </div>
        </div>
        <div class="footer">
          อีเมลแจ้งเตือนอัตโนมัติจากระบบ Highbury International Store
        </div>
      </div>
    </body>
    </html>
  `;

  return getResend().emails.send({
    from: FROM,
    to: ADMIN_PAYMENT_EMAIL,
    subject,
    html,
  });
}
