export const ORDER_STATUS: Record<string, { label: string; className: string }> = {
  PENDING:           { label: "รอดำเนินการ",     className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  PAYMENT_UPLOADED:  { label: "อัพโหลดสลิปแล้ว", className: "bg-sky-100 text-sky-800 border-sky-200" },
  PAYMENT_VERIFIED:  { label: "ยืนยันชำระแล้ว",  className: "bg-green-100 text-green-800 border-green-200" },
  PAYMENT_REJECTED:  { label: "ปฏิเสธการชำระ",   className: "bg-red-100 text-red-800 border-red-200" },
  PROCESSING:        { label: "กำลังจัดส่ง",     className: "bg-purple-100 text-purple-800 border-purple-200" },
  SHIPPED:           { label: "จัดส่งแล้ว",      className: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  DELIVERED:         { label: "ส่งสำเร็จ",       className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  CANCELLED:         { label: "ยกเลิก",          className: "bg-gray-100 text-gray-600 border-gray-200" },
  REFUNDED:          { label: "คืนเงิน",         className: "bg-orange-100 text-orange-800 border-orange-200" },
};

export function getStatusBadgeClass(status: string): string {
  return ORDER_STATUS[status]?.className ?? "bg-gray-100 text-gray-600 border-gray-200";
}

export function getStatusLabel(status: string): string {
  return ORDER_STATUS[status]?.label ?? status;
}
