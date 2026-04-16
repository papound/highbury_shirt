import { prisma } from "@/lib/prisma";

/**
 * Generates the next customerNo by querying MAX(customerNo) + 1.
 * Runs inside a transaction if needed for safety.
 * SERVER-ONLY — do not import in Client Components
 */
export async function generateCustomerNo(): Promise<number> {
  const result = await prisma.user.aggregate({
    _max: { customerNo: true },
  });
  return (result._max.customerNo ?? 0) + 1;
}

/**
 * Formats customerNo as CUS-00001
 * Pure function — safe for both server and client
 * @deprecated Import from @/lib/customer-no-format instead to avoid pulling prisma into client bundles
 */
export { formatCustomerNo } from "@/lib/customer-no-format";
