import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

const ALLOWED_ROLES = ["SUPERADMIN", "ADMIN", "ACCOUNTANT"];

export async function GET() {
  const session = await auth();
  if (!session?.user?.role || !ALLOWED_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { variant: { include: { product: true } } } },
    },
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Orders");

  sheet.columns = [
    { header: "หมายเลขคำสั่งซื้อ", key: "orderNumber", width: 20 },
    { header: "วันที่", key: "date", width: 18 },
    { header: "ชื่อผู้รับ", key: "shippingName", width: 20 },
    { header: "เบอร์โทร", key: "phone", width: 15 },
    { header: "ที่อยู่", key: "address", width: 40 },
    { header: "สินค้า", key: "items", width: 50 },
    { header: "ส่วนลด", key: "discount", width: 12 },
    { header: "ค่าส่ง", key: "shipping", width: 12 },
    { header: "ยอดรวม", key: "total", width: 14 },
    { header: "สถานะ", key: "status", width: 15 },
    { header: "เลขพัสดุ", key: "tracking", width: 20 },
  ];

  orders.forEach((order) => {
    const itemsText = order.items
      .map((i) => `${i.variant.product.nameTh}(${i.variant.color}/${i.variant.size})×${i.quantity}`)
      .join(", ");
    sheet.addRow({
      orderNumber: order.orderNumber,
      date: new Date(order.createdAt).toLocaleDateString("th-TH"),
      shippingName: order.shippingName,
      phone: order.shippingPhone,
      address: `${order.shippingAddress} ${order.shippingCity} ${order.shippingProvince} ${order.shippingPostcode}`,
      items: itemsText,
      discount: order.discountAmount,
      shipping: order.shippingFee,
      total: order.total,
      status: order.status,
      tracking: order.trackingNumber ?? "",
    });
  });

  // Style header
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E3A8A" },
  };
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await workbook.xlsx.writeBuffer() as any;
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="orders-report.xlsx"`,
    },
  });
}
