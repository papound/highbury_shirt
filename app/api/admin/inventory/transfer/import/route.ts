import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

const ALLOWED_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.role || !ALLOWED_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const fromWarehouseId = String(formData.get("fromWarehouseId") ?? "");
    const toWarehouseId = String(formData.get("toWarehouseId") ?? "");

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
    if (!fromWarehouseId || !toWarehouseId) {
      return NextResponse.json({ error: "กรุณาระบุคลังต้นทางและปลายทาง" }, { status: 400 });
    }
    if (fromWarehouseId === toWarehouseId) {
      return NextResponse.json({ error: "คลังต้นทางและปลายทางต้องต่างกัน" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await workbook.xlsx.load(Buffer.from(bytes) as any);

    const sheet = workbook.worksheets[0];
    const results: { sku: string; quantity: number; note?: string; status: string }[] = [];
    let transferred = 0;

    // Expected columns: sku, quantity, note (optional)
    for (let rowNum = 2; rowNum <= sheet.rowCount; rowNum++) {
      const row = sheet.getRow(rowNum);
      const sku = String(row.getCell(1).value ?? "").trim();
      const quantity = parseInt(String(row.getCell(2).value ?? "0"));
      const note = String(row.getCell(3).value ?? "").trim() || undefined;

      if (!sku || !quantity || quantity <= 0) {
        results.push({ sku: sku || `Row ${rowNum}`, quantity, status: "ข้ามแถว (ข้อมูลไม่ครบ)" });
        continue;
      }

      try {
        const variant = await prisma.productVariant.findUnique({ where: { sku } });
        if (!variant) {
          results.push({ sku, quantity, status: "ไม่พบ SKU" });
          continue;
        }

        const sourceInv = await prisma.inventory.findUnique({
          where: { variantId_warehouseId: { variantId: variant.id, warehouseId: fromWarehouseId } },
        });
        if (!sourceInv || sourceInv.quantity < quantity) {
          results.push({ sku, quantity, status: `Stock ไม่พอ (มี ${sourceInv?.quantity ?? 0})` });
          continue;
        }

        await prisma.$transaction(async (tx) => {
          await tx.inventory.update({
            where: { variantId_warehouseId: { variantId: variant.id, warehouseId: fromWarehouseId } },
            data: { quantity: { decrement: quantity } },
          });
          await tx.inventory.upsert({
            where: { variantId_warehouseId: { variantId: variant.id, warehouseId: toWarehouseId } },
            update: { quantity: { increment: quantity } },
            create: { variantId: variant.id, warehouseId: toWarehouseId, quantity },
          });
          await tx.stockTransfer.create({
            data: {
              fromWarehouseId,
              toWarehouseId,
              variantId: variant.id,
              quantity,
              note: note || null,
              performedById: session.user.id,
            },
          });
        });

        results.push({ sku, quantity, note, status: "สำเร็จ" });
        transferred++;
      } catch (rowErr) {
        results.push({ sku, quantity, status: `ข้อผิดพลาด: ${(rowErr as Error).message}` });
      }
    }

    return NextResponse.json({ transferred, results });
  } catch (err) {
    console.error("Transfer import error:", err);
    return NextResponse.json({ error: "นำเข้าล้มเหลว" }, { status: 500 });
  }
}
