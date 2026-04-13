/*
  Warnings:

  - You are about to drop the column `rejectNote` on the `payment_proofs` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT,
    "guestEmail" TEXT,
    "guestName" TEXT,
    "guestPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "subtotal" REAL NOT NULL,
    "discountAmount" REAL NOT NULL DEFAULT 0,
    "shippingFee" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL,
    "shippingName" TEXT NOT NULL,
    "shippingPhone" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "shippingCity" TEXT NOT NULL,
    "shippingProvince" TEXT NOT NULL,
    "shippingPostcode" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("createdAt", "discountAmount", "guestEmail", "guestName", "guestPhone", "id", "note", "orderNumber", "shippingAddress", "shippingCity", "shippingFee", "shippingName", "shippingPhone", "shippingPostcode", "shippingProvince", "status", "subtotal", "total", "updatedAt", "userId") SELECT "createdAt", "discountAmount", "guestEmail", "guestName", "guestPhone", "id", "note", "orderNumber", "shippingAddress", "shippingCity", "shippingFee", "shippingName", "shippingPhone", "shippingPostcode", "shippingProvince", "status", "subtotal", "total", "updatedAt", "userId" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");
CREATE TABLE "new_payment_proofs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "verifiedById" TEXT,
    "verifiedAt" DATETIME,
    "rejectionNote" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payment_proofs_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "payment_proofs_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_payment_proofs" ("id", "imageUrl", "orderId", "status", "uploadedAt", "verifiedAt", "verifiedById") SELECT "id", "imageUrl", "orderId", "status", "uploadedAt", "verifiedAt", "verifiedById" FROM "payment_proofs";
DROP TABLE "payment_proofs";
ALTER TABLE "new_payment_proofs" RENAME TO "payment_proofs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
