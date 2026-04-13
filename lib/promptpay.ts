import generatePayload from "promptpay-qr";

/**
 * Generates a PromptPay QR payload string.
 * Pass this string to a QR code renderer (e.g. react-qr-code).
 *
 * @param amount  Order total in Thai Baht
 * @param ref     Order number used as reference (first 20 chars)
 */
export function generatePromptPayPayload(amount: number): string {
  const id = process.env.PROMPTPAY_ID;
  if (!id) throw new Error("PROMPTPAY_ID env var not set");
  return generatePayload(id, { amount: Math.round(amount * 100) / 100 });
}
