import generatePayload from "promptpay-qr";

/**
 * Generates a PromptPay QR payload string.
 * Pass this string to a QR code renderer (e.g. react-qr-code).
 *
 * @param amount  Order total in Thai Baht
 * @param ref     Order number used as reference (first 20 chars)
 */
export function generatePromptPayPayload(amount: number): string {
  const id = process.env.PROMPTPAY_ID || "0981466416";
  return generatePayload(id, { amount: Math.round(amount * 100) / 100 });
}
