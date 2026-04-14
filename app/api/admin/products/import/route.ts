import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import slugify from "slugify";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];

// Default column mapping (1-indexed) used when no mapping is supplied
const DEFAULT_MAPPING: Record<string, number> = {
  nameTh: 1,
  name: 2,
  basePrice: 3,
  categoryNameTh: 4,
  parentSku: 5,
  color: 6,
  colorHex: 7,
  size: 8,
  sku: 9,
  stock: 10,
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    // Accept optional field-mapping JSON: { "nameTh": 1, "name": 2, ... } (1-indexed columns)
    const mappingRaw = formData.get("mapping");
    const mapping: Record<string, number> = mappingRaw
      ? { ...DEFAULT_MAPPING, ...(JSON.parse(String(mappingRaw)) as Record<string, number>) }
      : DEFAULT_MAPPING;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = new ExcelJS.Workbook();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await workbook.xlsx.load(buffer as any);

    const sheet = workbook.worksheets[0];
    const warehouse = await prisma.warehouse.findFirst();

    let imported = 0;
    const errors: string[] = [];

    for (let rowNum = 2; rowNum <= sheet.rowCount; rowNum++) {
      const row = sheet.getRow(rowNum);
      const getCell = (col: number | undefined) =>
        col !== undefined ? String(row.getCell(col).value ?? "").trim() : "";

      const nameTh = getCell(mapping.nameTh);
      const name = getCell(mapping.name);
      const basePrice = parseFloat(getCell(mapping.basePrice));
      const categoryNameTh = getCell(mapping.categoryNameTh);
      const parentSku = getCell(mapping.parentSku);
      const color = getCell(mapping.color);
      const colorHex = getCell(mapping.colorHex) || "#000000";
      const size = getCell(mapping.size);
      const sku = getCell(mapping.sku);
      const stock = parseInt(getCell(mapping.stock)) || 0;

      if (!nameTh || !name || !basePrice || !color || !size || !sku) {
        errors.push(`Row ${rowNum}: ข้อมูลไม่ครบ`);
        continue;
      }

      try {
        // Find or create category — lookup by nameTh first, then create with a
        // slug that won't collide (Thai slugify strips all chars → use cuid fallback)
        let category = null;
        if (categoryNameTh) {
          category = await prisma.category.findFirst({ where: { nameTh: categoryNameTh } });
          if (!category) {
            const rawSlug = slugify(categoryNameTh, { lower: true, strict: true });
            // If Thai text produces empty slug, fall back to a unique slug
            const catSlug = rawSlug || `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            category = await prisma.category.create({
              data: { nameTh: categoryNameTh, name: categoryNameTh, slug: catSlug },
            });
          }
        }

        if (!category) {
          errors.push(`Row ${rowNum}: ไม่พบหมวดหมู่`);
          continue;
        }

        // Find or create product — upsert by slug to avoid race condition on duplicate slug
        const slug = parentSku || slugify(name, { lower: true, strict: true });
        const product = await prisma.product.upsert({
          where: { slug },
          update: {},
          create: {
            nameTh,
            name,
            slug,
            basePrice,
            categoryId: category.id,
            status: "ACTIVE",
          },
        });

        // Upsert variant — upsert by sku to avoid duplicate on re-import
        const variant = await prisma.productVariant.upsert({
          where: { sku },
          update: { color, colorHex, size, price: basePrice },
          create: { productId: product.id, color, colorHex, size, sku, price: basePrice },
        });

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
