/**
 * Calculate shipping fee based on total item quantity.
 *
 * < 10 items  → ฿70
 * 10–19       → ฿100
 * 20–49       → ฿150
 * 50–99       → ฿200
 * ≥ 100       → Free (฿0)
 */
export function calcShippingFee(
  totalQty: number,
  options?: { isPickup?: boolean; hasFreeShippingPromo?: boolean }
): number {
  if (options?.isPickup) return 0;
  if (options?.hasFreeShippingPromo) return 0;

  if (totalQty >= 100) return 0;
  if (totalQty >= 50) return 200;
  if (totalQty >= 20) return 150;
  if (totalQty >= 10) return 100;
  return 70;
}

export function shippingFeeLabel(qty: number): string {
  if (qty >= 100) return "ฟรีค่าจัดส่ง (≥100 ตัว)";
  if (qty >= 50) return "฿200 (50–99 ตัว)";
  if (qty >= 20) return "฿150 (20–49 ตัว)";
  if (qty >= 10) return "฿100 (10–19 ตัว)";
  return "฿70 (<10 ตัว)";
}
