"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminOrderActions({ order }: { order: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");

  async function updateStatus(status: string, extra: object = {}) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("อัพเดทสถานะสำเร็จ");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  const latestProof = order.paymentProofs?.[0];
  const hasPendingProof = latestProof?.status === "PENDING";

  return (
    <div className="border rounded-xl p-5 bg-card space-y-4">
      <h2 className="font-semibold">จัดการคำสั่งซื้อ</h2>

      {/* Payment proof actions */}
      {hasPendingProof && (
        <div className="space-y-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">มีสลิปรอการตรวจสอบ</p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => updateStatus("PAYMENT_VERIFIED")}
              disabled={loading}
            >
              ✓ อนุมัติการชำระเงิน
            </Button>
            <div className="flex gap-2 flex-1">
              <Textarea
                placeholder="เหตุผลที่ปฏิเสธ"
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                rows={1}
                className="min-h-9 text-sm"
              />
              <Button
                size="sm"
                variant="destructive"
                disabled={loading}
                onClick={() => updateStatus("PAYMENT_REJECTED", { rejectionNote })}
              >
                ✕ ปฏิเสธ
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status transitions */}
      <div className="flex flex-wrap gap-2">
        {order.status === "PAYMENT_VERIFIED" && (
          <Button size="sm" variant="outline" disabled={loading} onClick={() => updateStatus("PROCESSING")}>
            เริ่มจัดส่ง
          </Button>
        )}
        {order.status === "PROCESSING" && (
          <div className="flex items-center gap-2">
            <Input
              placeholder="เลขพัสดุ"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="h-8 text-sm w-40"
            />
            <Button
              size="sm"
              disabled={loading}
              onClick={() => updateStatus("SHIPPED", { trackingNumber })}
            >
              จัดส่งแล้ว
            </Button>
          </div>
        )}
        {order.status === "SHIPPED" && (
          <Button size="sm" variant="outline" disabled={loading} onClick={() => updateStatus("DELIVERED")}>
            ยืนยันส่งสำเร็จ
          </Button>
        )}
        {!["CANCELLED", "DELIVERED"].includes(order.status) && (
          <Button
            size="sm"
            variant="destructive"
            disabled={loading}
            onClick={() => updateStatus("CANCELLED")}
          >
            ยกเลิกคำสั่งซื้อ
          </Button>
        )}
      </div>
    </div>
  );
}
