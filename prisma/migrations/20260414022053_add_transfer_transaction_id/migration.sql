-- AlterTable
ALTER TABLE "stock_transfers" ADD COLUMN "transactionId" TEXT;

-- CreateIndex
CREATE INDEX "stock_transfers_transactionId_idx" ON "stock_transfers"("transactionId");
