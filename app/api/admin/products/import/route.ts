import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import slugify from "slugify";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = new ExcelJS.Workbook();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await workbook.xlsx.load(buffer as any);

    const sheet = workbook.worksheets[0];
    const warehouse = await prisma.warehouse.findFirst();

    let imported = 0;
    const errors: string[] = [];

    // Expected columns: nameTh, name, basePrice, categoryNameTh, color, colorHex, size, sku, stock
    for (let rowNum = 2; rowNum <= sheet.rowCount; rowNum++) {
      const row = sheet.getRow(rowNum);
      const getCell = (col: number) => String(row.getCell(col).value ?? "").trim();

      const nameTh = getCell(1);
      const name = getCell(2);
      const basePrice = parseFloat(getCell(3));
      const categoryNameTh = getCell(4);
      const color = getCell(5);
      const colorHex = getCell(6) || "#000000";
      const size = getCell(7);
      const sku = getCell(8);
      const stock = parseInt(getCell(9)) || 0;

      if (!nameTh || !name || !basePrice || !color || !size || !sku) {
        errors.push(`Row ${rowNum}: ข้อมูลไม่ครบ`);
        continue;
      }

      try {
        // Find or create category
        let category = await prisma.category.findFirst({ where: { nameTh: categoryNameTh } });
        if (!category && categoryNameTh) {
          category = await prisma.category.create({
            data: {
              nameTh: categoryNameTh,
              name: categoryNameTh,
              slug: slugify(categoryNameTh, { lower: true, strict: true }),
            },
          });
        }

        if (!category) {
          errors.push(`Row ${rowNum}: ไม่พบหมวดหมู่`);
          continue;
        }

        // Find or create product
        const slug = slugify(name, { lower: true, strict: true });
        let product = await prisma.product.findFirst({ where: { name } });
        if (!product) {
          product = await prisma.product.create({
            data: {
              nameTh,
              name,
              slug,
              basePrice,
              categoryId: category.id,
              status: "ACTIVE",
            },
          });
        }

        // Upsert variant
        let variant = await prisma.productVariant.findUnique({ where: { sku } });
        if (!variant) {
          variant = await prisma.productVariant.create({
            data: { productId: product.id, color, colorHex, size, sku, price: basePrice },
          });
        }

        // Upsert inventory
        if (warehouse) {
          await prisma.inventory.upsert({
            where: { variantId_warehouseId: { variantId: variant.id, warehouseId: warehouse.id } },
            update: { quantity: stock },
            create: { variantId: variant.id, warehouseId: warehouse.id, quantity: stock },
          });
        }

        imported++;
      } catch (rowErr) {
        errors.push(`Row ${rowNum}: ${(rowErr as Error).message}`);
      }
    }

    return NextResponse.json({ imported, errors });
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
