import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@prisma/client";
import { getStatusLabel, getStatusBadgeClass } from "@/lib/order-status";

const STATUS_TABS = [
  { key: "", label: "ทั้งหมด" },
  { key: "PENDING", label: "รอดำเนินการ" },
  { key: "PAYMENT_UPLOADED", label: "อัพโหลดสลิปแล้ว" },
  { key: "PAYMENT_VERIFIED", label: "ยืนยันแล้ว" },
  { key: "SHIPPED", label: "กำลังจัดส่ง" },
  { key: "DELIVERED", label: "ส่งแล้ว" },
  { key: "CANCELLED", label: "ยกเลิก" },
];



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
        user: { select: { name: true, email: true } },
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
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">จัดส่งโดย</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">วันที่</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">ยอดรวม</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">สถานะ</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                return (
                  <tr key={order.id} className="border-b hover:bg-muted/20">
                    <td className="px-4 py-3 font-mono text-xs">#{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.shippingName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.guestPhone ?? order.shippingPhone ?? ""}
                      </p>
                      {order.user && (
                        <p className="text-xs text-blue-600">{order.user.name ?? order.user.email}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {order.isPickup ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                          🏪 รับที่ร้าน
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                          📦 จัดส่งพัสดุ
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString("th-TH")}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">฿{order.total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium border ${getStatusBadgeClass(order.status)}`}>{getStatusLabel(order.status)}</span>
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
