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
