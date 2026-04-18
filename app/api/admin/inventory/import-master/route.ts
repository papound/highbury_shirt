import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

const ALLOWED_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];
export const IMPORT_NOTE_PREFIX = "IMPORT:IMPORT";

// ── helpers ────────────────────────────────────────────────────────────────────



async function parseExcel(file: File) {
  const bytes = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await workbook.xlsx.load(Buffer.from(bytes) as any);
  const sheet = workbook.worksheets[0];

  const rows: { sku: string; quantity: number; note?: string }[] = [];
  for (let rowNum = 2; rowNum <= sheet.rowCount; rowNum++) {
    const row = sheet.getRow(rowNum);
    const sku = String(row.getCell(1).value ?? "").trim();
    const quantity = parseInt(String(row.getCell(2).value ?? "0"));
    const note = String(row.getCell(3).value ?? "").trim() || undefined;
    if (sku && quantity > 0) rows.push({ sku, quantity, note });
  }
  return rows;
}

// ── POST /preview ──────────────────────────────────────────────────────────────

async function handlePreview(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const warehouseId = formData.get("warehouseId") as string | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!warehouseId) return NextResponse.json({ error: "กรุณาเลือกคลัง" }, { status: 400 });

  const warehouse = await prisma.warehouse.findUnique({ where: { id: warehouseId } });
  if (!warehouse) {
    return NextResponse.json(
      { error: `ไม่พบคลังที่เลือก กรุณาตรวจสอบใหม่` },
      { status: 400 }
    );
  }

  const rows = await parseExcel(file);

  type PreviewItem = {
    sku: string;
    quantity: number;
    note?: string;
    productName: string;
    color: string;
    size: string;
    currentStock: number;
    isNew: boolean; // true = ไม่เคยมี inventory ใน master
    variantExists: boolean; // false = ไม่เจอ variant เลย
  };

  const items: PreviewItem[] = [];
  const unknownSkus: string[] = [];

  for (const row of rows) {
    const variant = await prisma.productVariant.findUnique({
      where: { sku: row.sku },
      include: { product: true },
    });

    if (!variant) {
      unknownSkus.push(row.sku);
      continue;
    }


    const existingInv = await prisma.inventory.findUnique({
      where: { variantId_warehouseId: { variantId: variant.id, warehouseId: warehouse.id } },
    });

    items.push({
      sku: row.sku,
      quantity: row.quantity,
      note: row.note,
      productName: variant.product.nameTh,
      color: variant.color,
      size: variant.size,
      currentStock: existingInv?.quantity ?? 0,
      isNew: !existingInv,
      variantExists: true,
    });
  }

  return NextResponse.json({
    warehouseId: warehouse.id,
    warehouseName: warehouse.name,
    newItems: items.filter((i) => i.isNew),
    existingItems: items.filter((i) => !i.isNew),
    unknownSkus,
  });
}

// ── POST /import ───────────────────────────────────────────────────────────────

async function handleImport(req: NextRequest, userId: string) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const warehouseId = formData.get("warehouseId") as string | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!warehouseId) return NextResponse.json({ error: "กรุณาเลือกคลัง" }, { status: 400 });

  const warehouse = await prisma.warehouse.findUnique({ where: { id: warehouseId } });
  if (!warehouse) {
    return NextResponse.json(
      { error: `ไม่พบคลังที่เลือก กรุณาตรวจสอบใหม่` },
      { status: 400 }
    );
  }

  const rows = await parseExcel(file);

  // unique batch ID for this import session
  const batchId = `IMP-${Date.now().toString(36).toUpperCase()}`;

  let created = 0;
  let updated = 0;
  const skipped: string[] = [];

  for (const row of rows) {
    const variant = await prisma.productVariant.findUnique({ where: { sku: row.sku } });
    if (!variant) {
      skipped.push(row.sku);
      continue;
    }

    const existing = await prisma.inventory.findUnique({
      where: { variantId_warehouseId: { variantId: variant.id, warehouseId: warehouse.id } },
    });

    if (existing) {
      await prisma.inventory.update({
        where: { variantId_warehouseId: { variantId: variant.id, warehouseId: warehouse.id } },
        data: { quantity: { increment: row.quantity } },
      });
      // log adjustment
      await prisma.inventoryAdjustment.create({
        data: {
          inventoryId: existing.id,
          delta: row.quantity,
          note: `${IMPORT_NOTE_PREFIX} | BATCH:${batchId}${row.note ? ` | ${row.note}` : ""}`,
          createdById: userId,
        },
      });
      updated++;
    } else {
      const inv = await prisma.inventory.create({
        data: { variantId: variant.id, warehouseId: warehouse.id, quantity: row.quantity },
      });
      await prisma.inventoryAdjustment.create({
        data: {
          inventoryId: inv.id,
          delta: row.quantity,
          note: `${IMPORT_NOTE_PREFIX} | BATCH:${batchId}${row.note ? ` | ${row.note}` : ""}`,
          createdById: userId,
        },
      });
      created++;
    }
  }

  return NextResponse.json({ created, updated, skipped, batchId });
}

// ── GET /history ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.role || !["SUPERADMIN", "ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const records = await prisma.inventoryAdjustment.findMany({
      where: { note: { startsWith: IMPORT_NOTE_PREFIX } },
      include: {
        inventory: {
          include: {
            variant: { include: { product: true } },
            warehouse: true,
          },
        },
        createdBy: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    // Group by batchId extracted from note
    type BatchMap = Map<string, {
      batchId: string;
      createdAt: string;
      createdBy: { name: string | null; email: string | null } | null;
      totalItems: number;
      totalQty: number;
      items: typeof records;
    }>;
    const grouped: BatchMap = new Map();

    for (const rec of records) {
      const match = (rec.note ?? "").match(/BATCH:([A-Z0-9-]+)/);
      const batchId = match?.[1] ?? "LEGACY";

      if (!grouped.has(batchId)) {
        grouped.set(batchId, {
          batchId,
          createdAt: rec.createdAt.toISOString(),
          createdBy: rec.createdBy,
          totalItems: 0,
          totalQty: 0,
          items: [],
        });
      }
      const batch = grouped.get(batchId)!;
      batch.totalItems++;
      batch.totalQty += rec.delta;
      batch.items.push(rec);
    }

    const batches = Array.from(grouped.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ batches });
  } catch (err) {
    console.error("import-master history error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

// ── Router ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.role || !ALLOWED_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "import";
    if (action === "preview") return handlePreview(req);
    return handleImport(req, session.user.id);
  } catch (err) {
    console.error("import-master error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
