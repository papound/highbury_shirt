import { prisma } from "@/lib/prisma";

/**
 * Generates the next customerNo by querying MAX(customerNo) + 1.
 * Runs inside a transaction if needed for safety.
 */
export async function generateCustomerNo(): Promise<number> {
  const result = await prisma.user.aggregate({
    _max: { customerNo: true },
  });
  return (result._max.customerNo ?? 0) + 1;
}

/** Formats customerNo as CUS-00001 */
export function formatCustomerNo(no: number | null | undefined): string {
  if (!no) return "—";
  return `CUS-${String(no).padStart(5, "0")}`;
}
