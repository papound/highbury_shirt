import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "รอดำเนินการ", variant: "secondary" },
  PAYMENT_UPLOADED: { label: "อัพโหลดสลิปแล้ว", variant: "outline" },
  PAYMENT_VERIFIED: { label: "ยืนยันการชำระแล้ว", variant: "default" },
  PROCESSING: { label: "กำลังจัดส่ง", variant: "default" },
  SHIPPED: { label: "จัดส่งแล้ว", variant: "default" },
  DELIVERED: { label: "ได้รับสินค้าแล้ว", variant: "default" },
  CANCELLED: { label: "ยกเลิก", variant: "destructive" },
  PAYMENT_REJECTED: { label: "ปฏิเสธการชำระ", variant: "destructive" },
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { variant: { include: { product: true } } } },
      paymentProofs: { orderBy: { uploadedAt: "desc" }, take: 1 },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">คำสั่งซื้อของฉัน</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="mb-4">ยังไม่มีคำสั่งซื้อ</p>
          <Button asChild variant="outline">
            <Link href="/products">เริ่มช้อปปิ้ง</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, variant: "secondary" as const };
            const proof = order.paymentProofs[0];

            return (
              <div key={order.id} className="border rounded-xl p-5 bg-card space-y-3">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold">#{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  {order.items.map((item) => (
                    <p key={item.id}>
                      {item.variant.product.nameTh} ({item.variant.color}, {item.variant.size}) × {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-semibold">รวม ฿{order.total.toLocaleString()}</p>

                  {order.status === "PENDING" && !proof && (
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/account/orders/${order.id}/pay`}>อัพโหลดสลิป</Link>
                    </Button>
                  )}

                  {order.status === "PAYMENT_REJECTED" && (
                    <Badge variant="destructive" className="text-xs">
                      {(proof as { rejectionNote?: string })?.rejectionNote ?? "ไม่ผ่านการยืนยัน"}
                    </Badge>
                  )}

                  {order.trackingNumber && (
                    <p className="text-xs text-muted-foreground">เลขพัสดุ: {order.trackingNumber}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
