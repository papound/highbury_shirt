/**
 * One-time script: assign customerNo to all existing users that don't have one yet.
 * Orders by createdAt ASC so oldest users get the lowest numbers.
 *
 * Run with:
 *   npx tsx prisma/patch-customer-no.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    where: { customerNo: null, role: "CUSTOMER" },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, createdAt: true },
  });

  if (users.length === 0) {
    console.log("No users without customerNo — nothing to do.");
    return;
  }

  // Get current MAX so we don't collide with newly registered users
  const result = await prisma.user.aggregate({ _max: { customerNo: true } });
  let next = (result._max.customerNo ?? 0) + 1;

  console.log(`Assigning customerNo starting from ${next} to ${users.length} user(s)...`);

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { customerNo: next },
    });
    console.log(`  ✓ ${user.email}  →  CUS-${String(next).padStart(5, "0")}`);
    next++;
  }

  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); });
