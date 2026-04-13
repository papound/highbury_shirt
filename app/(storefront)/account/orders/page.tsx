import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getStatusLabel, getStatusBadgeClass } from "@/lib/order-status";

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
                  <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium border ${getStatusBadgeClass(order.status)}`}>{getStatusLabel(order.status)}</span>
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
                    <span className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium border bg-red-100 text-red-800 border-red-200">
                      {(proof as { rejectionNote?: string })?.rejectionNote ?? "ไม่ผ่านการยืนยัน"}
                    </span>
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
