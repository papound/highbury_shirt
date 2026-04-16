import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];

export async function GET() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: { status: { not: "ARCHIVED" } },
    orderBy: { createdAt: "asc" },
    include: {
      category: true,
      variants: {
        include: {
          inventory: true,
        },
      },
    },
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Highbury International";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Products");

  // ── Header row ──
  const headers = [
    { header: "ชื่อสินค้า (TH)", key: "nameTh", width: 30 },
    { header: "ชื่อสินค้า (EN)", key: "name", width: 30 },
    { header: "ราคาฐาน", key: "basePrice", width: 12 },
    { header: "หมวดหมู่", key: "categoryNameTh", width: 20 },
    { header: "Parent SKU", key: "parentSku", width: 25 },
    { header: "สี", key: "color", width: 15 },
    { header: "Hex สี", key: "colorHex", width: 12 },
    { header: "ขนาด / Size", key: "size", width: 12 },
    { header: "SKU", key: "sku", width: 20 },
    { header: "จำนวน Stock", key: "stock", width: 14 },
  ];

  sheet.columns = headers;

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2563EB" }, // blue-600
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 20;

  // ── Data rows ──
  for (const product of products) {
    for (const variant of product.variants) {
      const totalStock = variant.inventory.reduce((sum, inv) => sum + inv.quantity, 0);

      const row = sheet.addRow({
        nameTh: product.nameTh,
        name: product.name,
        basePrice: product.basePrice,
        categoryNameTh: product.category?.nameTh ?? "",
        parentSku: product.slug,
        color: variant.color,
        colorHex: variant.colorHex ?? "#000000",
        size: variant.size,
        sku: variant.sku,
        stock: totalStock,
      });

      // Alternate row background
      if (row.number % 2 === 0) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8FAFC" }, // slate-50
        };
      }
    }
  }

  // Freeze header row
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  // Auto-filter on header
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: headers.length },
  };

  const buffer = await workbook.xlsx.writeBuffer();

  const filename = `products_export_${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(new Uint8Array(buffer as ArrayBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
