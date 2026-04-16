/**
 * Pure formatting utilities for customerNo — no server dependencies
 * Safe to import in both Server and Client Components
 */

/** Formats customerNo as CUS-00001 */
export function formatCustomerNo(no: number | null | undefined): string {
  if (!no) return "—";
  return `CUS-${String(no).padStart(5, "0")}`;
}
