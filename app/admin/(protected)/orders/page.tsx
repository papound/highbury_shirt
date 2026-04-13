import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@prisma/client";

const STATUS_TABS = [
  { key: "", label: "ทั้งหมด" },
  { key: "PENDING", label: "รอดำเนินการ" },
  { key: "PAYMENT_UPLOADED", label: "อัพโหลดสลิปแล้ว" },
  { key: "PAYMENT_VERIFIED", label: "ยืนยันแล้ว" },
  { key: "SHIPPED", label: "กำลังจัดส่ง" },
  { key: "DELIVERED", label: "ส่งแล้ว" },
  { key: "CANCELLED", label: "ยกเลิก" },
];

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "รอดำเนินการ", variant: "secondary" },
  PAYMENT_UPLOADED: { label: "อัพโหลดสลิป", variant: "outline" },
  PAYMENT_VERIFIED: { label: "ยืนยันแล้ว", variant: "default" },
  PROCESSING: { label: "กำลังจัดส่ง", variant: "default" },
  SHIPPED: { label: "จัดส่งแล้ว", variant: "default" },
  DELIVERED: { label: "ได้รับแล้ว", variant: "default" },
  CANCELLED: { label: "ยกเลิก", variant: "destructive" },
  PAYMENT_REJECTED: { label: "ปฏิเสธ", variant: "destructive" },
};

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status, page } = await searchParams;
  const pageNum = parseInt(page ?? "1");
  const take = 20;

  const validStatus = status && Object.values(OrderStatus).includes(status as OrderStatus)
    ? (status as OrderStatus)
    : undefined;

  const where = validStatus ? { status: validStatus } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * take,
      take,
      include: {
        items: true,
        paymentProofs: { take: 1, orderBy: { uploadedAt: "desc" } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / take);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">คำสั่งซื้อ</h1>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.key}
            asChild
            size="sm"
            variant={status === tab.key || (!status && tab.key === "") ? "default" : "outline"}
          >
            <Link href={tab.key ? `/admin/orders?status=${tab.key}` : "/admin/orders"}>
              {tab.label}
            </Link>
          </Button>
        ))}
      </div>

      <div className="border rounded-xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">หมายเลข</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ลูกค้า</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">วันที่</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">ยอดรวม</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">สถานะ</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, variant: "secondary" as const };
                return (
                  <tr key={order.id} className="border-b hover:bg-muted/20">
                    <td className="px-4 py-3 font-mono text-xs">#{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p>{order.shippingName}</p>
                      <p className="text-xs text-muted-foreground">{order.guestPhone ?? ""}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString("th-TH")}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">฿{order.total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                      {order.paymentProofs.length > 0 && order.status === "PAYMENT_UPLOADED" && (
                        <span className="ml-1 text-xs text-orange-500">• สลิปรอตรวจ</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/admin/orders/${order.id}`}>ดูรายละเอียด</Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 justify-end">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              asChild
              size="sm"
              variant={p === pageNum ? "default" : "outline"}
            >
              <Link href={`/admin/orders?${status ? `status=${status}&` : ""}page=${p}`}>{p}</Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
