import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AdminOrderActions from "@/components/admin/order-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { variant: { include: { product: true } } } },
      paymentProofs: { orderBy: { uploadedAt: "desc" } },
      user: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/orders"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <h1 className="text-2xl font-bold">#{order.orderNumber}</h1>
        <Badge>{order.status}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer */}
        <div className="border rounded-xl p-4 bg-card space-y-2">
          <h2 className="font-semibold text-sm">ข้อมูลลูกค้า</h2>
          <Separator />
          <p className="text-sm">{order.shippingName}</p>
          {order.guestEmail && <p className="text-sm text-muted-foreground">{order.guestEmail}</p>}
          {order.guestPhone && <p className="text-sm text-muted-foreground">{order.guestPhone}</p>}
        </div>

        {/* Shipping Address */}
        <div className="border rounded-xl p-4 bg-card space-y-2">
          <h2 className="font-semibold text-sm">ที่อยู่จัดส่ง</h2>
          <Separator />
          <p className="text-sm">{order.shippingAddress}</p>
          <p className="text-sm text-muted-foreground">
            {order.shippingCity}, {order.shippingProvince} {order.shippingPostcode}
          </p>
          <p className="text-sm text-muted-foreground">{order.shippingPhone}</p>
          {order.trackingNumber && (
            <p className="text-sm text-primary font-medium">เลขพัสดุ: {order.trackingNumber}</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="border rounded-xl bg-card overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/30">
          <h2 className="font-semibold text-sm">รายการสินค้า</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left px-4 py-2 text-muted-foreground font-medium">สินค้า</th>
              <th className="text-center px-4 py-2 text-muted-foreground font-medium">ราคา</th>
              <th className="text-center px-4 py-2 text-muted-foreground font-medium">จำนวน</th>
              <th className="text-right px-4 py-2 text-muted-foreground font-medium">รวม</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-3">
                  <p>{item.variant.product.nameTh}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.variant.color} / {item.variant.size}
                  </p>
                </td>
                <td className="px-4 py-3 text-center">฿{item.unitPrice.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">{item.quantity}</td>
                <td className="px-4 py-3 text-right">฿{(item.unitPrice * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 text-sm space-y-1 text-right">
          {order.discountAmount > 0 && (
            <div className="text-green-600">ส่วนลด: -฿{order.discountAmount.toLocaleString()}</div>
          )}
          <div>ค่าจัดส่ง: ฿{order.shippingFee.toLocaleString()}</div>
          <div className="font-bold text-base">รวมทั้งสิ้น: ฿{order.total.toLocaleString()}</div>
        </div>
      </div>

      {/* Payment Proofs */}
      {order.paymentProofs.length > 0 && (
        <div className="border rounded-xl bg-card overflow-hidden">
          <div className="px-4 py-3 border-b bg-muted/30">
            <h2 className="font-semibold text-sm">หลักฐานการชำระเงิน</h2>
          </div>
          <div className="p-4 space-y-3">
            {order.paymentProofs.map((proof) => (
              <div key={proof.id} className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <a href={proof.imageUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={proof.imageUrl}
                    alt="Payment slip"
                    className="w-24 h-24 object-cover rounded border hover:opacity-80 transition"
                  />
                </a>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={proof.status === "APPROVED" ? "default" : proof.status === "REJECTED" ? "destructive" : "secondary"}>
                      {proof.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(proof.uploadedAt).toLocaleString("th-TH")}
                    </span>
                  </div>
                  {proof.rejectionNote && (
                    <p className="text-sm text-destructive">{proof.rejectionNote}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <AdminOrderActions order={order} />
    </div>
  );
}
