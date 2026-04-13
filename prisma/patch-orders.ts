/**
 * Run: npx tsx prisma/patch-orders.ts
 * Links existing orders to their user accounts by matching guestEmail → User.email
 */
import path from "path";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const url = `file:${path.resolve(process.cwd(), "dev.db")}`;
const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Find all orders with no userId but have a guestEmail
  const unlinkedOrders = await prisma.order.findMany({
    where: { userId: null, guestEmail: { not: null } },
    select: { id: true, orderNumber: true, guestEmail: true },
  });

  console.log(`Found ${unlinkedOrders.length} unlinked orders`);

  let linked = 0;
  for (const order of unlinkedOrders) {
    if (!order.guestEmail) continue;

    const user = await prisma.user.findUnique({
      where: { email: order.guestEmail },
      select: { id: true, email: true },
    });

    if (user) {
      await prisma.order.update({
        where: { id: order.id },
        data: { userId: user.id },
      });
      console.log(`✓ Linked order #${order.orderNumber} → user ${user.email}`);
      linked++;
    } else {
      console.log(`✗ No user found for email: ${order.guestEmail} (order #${order.orderNumber})`);
    }
  }

  console.log(`\nDone: linked ${linked}/${unlinkedOrders.length} orders`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
