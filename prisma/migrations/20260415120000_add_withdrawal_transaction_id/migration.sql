-- AlterTable
ALTER TABLE "stock_withdrawals" ADD COLUMN "transactionId" TEXT;

-- CreateIndex
CREATE INDEX "stock_withdrawals_transactionId_idx" ON "stock_withdrawals"("transactionId");
