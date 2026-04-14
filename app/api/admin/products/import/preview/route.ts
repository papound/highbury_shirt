import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import ExcelJS from "exceljs";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF"];
const SAMPLE_ROW_COUNT = 5;

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
    if (!sheet || sheet.rowCount < 1) {
      return NextResponse.json({ error: "ไฟล์ Excel ว่างเปล่า" }, { status: 400 });
    }

    // Read header row (row 1)
    const headerRow = sheet.getRow(1);
    const headers: string[] = [];
    headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      headers[colNumber - 1] = String(cell.value ?? `Column ${colNumber}`).trim();
    });

    // Read sample data rows (rows 2 to SAMPLE_ROW_COUNT+1)
    const rows: string[][] = [];
    for (let rowNum = 2; rowNum <= Math.min(sheet.rowCount, SAMPLE_ROW_COUNT + 1); rowNum++) {
      const row = sheet.getRow(rowNum);
      const rowData: string[] = [];
      for (let col = 1; col <= headers.length; col++) {
        rowData.push(String(row.getCell(col).value ?? "").trim());
      }
      rows.push(rowData);
    }

    return NextResponse.json({ headers, rows, totalRows: sheet.rowCount - 1 });
  } catch (err) {
    console.error("Preview error:", err);
    return NextResponse.json({ error: "อ่านไฟล์ไม่สำเร็จ" }, { status: 500 });
  }
}
