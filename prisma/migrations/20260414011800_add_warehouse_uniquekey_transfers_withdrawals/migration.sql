/*
  Warnings:

  - A unique constraint covering the columns `[customerNo]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniqueKey` to the `warehouses` table without a default value. This is not possible if the table is not empty.

  NOTE: Rewritten for PostgreSQL (original was generated with SQLite provider).
*/

-- AlterTable
ALTER TABLE "users" ADD COLUMN "customerNo" INTEGER;

-- CreateTable
CREATE TABLE "stock_transfers" (
    "id" TEXT NOT NULL,
    "fromWarehouseId" TEXT NOT NULL,
    "toWarehouseId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "note" TEXT,
    "performedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_transfers_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "stock_transfers_fromWarehouseId_fkey" FOREIGN KEY ("fromWarehouseId") REFERENCES "warehouses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stock_transfers_toWarehouseId_fkey" FOREIGN KEY ("toWarehouseId") REFERENCES "warehouses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stock_transfers_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stock_transfers_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "stock_withdrawals" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "performedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_withdrawals_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "stock_withdrawals_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stock_withdrawals_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stock_withdrawals_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- AlterTable: add uniqueKey to warehouses (PostgreSQL: use ADD COLUMN with default then set NOT NULL)
ALTER TABLE "warehouses" ADD COLUMN "uniqueKey" TEXT;
UPDATE "warehouses" SET "uniqueKey" = "id" WHERE "uniqueKey" IS NULL;
ALTER TABLE "warehouses" ALTER COLUMN "uniqueKey" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_uniqueKey_key" ON "warehouses"("uniqueKey");

-- CreateIndex
CREATE UNIQUE INDEX "users_customerNo_key" ON "users"("customerNo");
