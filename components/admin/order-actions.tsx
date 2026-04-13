"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminOrderActions({ order }: { order: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");

  // Edit form state
  const [isPickup, setIsPickup] = useState<boolean>(order.isPickup ?? false);
  const [edit, setEdit] = useState({
    guestName: order.guestName ?? "",
    guestEmail: order.guestEmail ?? "",
    guestPhone: order.guestPhone ?? "",
    shippingName: order.shippingName ?? "",
    shippingPhone: order.shippingPhone ?? "",
    shippingAddress: order.shippingAddress ?? "",
    shippingCity: order.shippingCity ?? "",
    shippingProvince: order.shippingProvince ?? "",
    shippingPostcode: order.shippingPostcode ?? "",
    note: order.note ?? "",
    trackingNumber: order.trackingNumber ?? "",
  });

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

  async function saveEdit() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...edit, isPickup }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("บันทึกข้อมูลสำเร็จ");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  const latestProof = order.paymentProofs?.[0];
  const hasPendingProof = latestProof?.status === "PENDING";

  const field = (label: string, key: keyof typeof edit, opts?: { multiline?: boolean; type?: string }) => (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      {opts?.multiline ? (
        <Textarea
          value={edit[key]}
          onChange={(e) => setEdit((prev) => ({ ...prev, [key]: e.target.value }))}
          rows={2}
          className="text-sm"
        />
      ) : (
        <Input
          type={opts?.type ?? "text"}
          value={edit[key]}
          onChange={(e) => setEdit((prev) => ({ ...prev, [key]: e.target.value }))}
          className="h-8 text-sm"
        />
      )}
    </div>
  );

  return (
    <div className="border rounded-xl p-5 bg-card space-y-4">
      <h2 className="font-semibold">จัดการคำสั่งซื้อ</h2>

      <Tabs defaultValue="status">
        <TabsList className="mb-4">
          <TabsTrigger value="status">สถานะ</TabsTrigger>
          <TabsTrigger value="customer">ข้อมูลลูกค้า</TabsTrigger>
          <TabsTrigger value="shipping">ที่อยู่จัดส่ง</TabsTrigger>
        </TabsList>

        {/* ───── STATUS TAB ───── */}
        <TabsContent value="status" className="space-y-4">
          {hasPendingProof && (
            <div className="space-y-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">มีสลิปรอการตรวจสอบ</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => updateStatus("PAYMENT_VERIFIED")} disabled={loading}>
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

          <div className="flex flex-wrap gap-2">
            {order.status === "PENDING" && (
              <Button size="sm" variant="outline" disabled={loading} onClick={() => updateStatus("PAYMENT_VERIFIED")}>
                อนุมัติโดยไม่มีสลิป
              </Button>
            )}
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
                <Button size="sm" disabled={loading} onClick={() => updateStatus("SHIPPED", { trackingNumber })}>
                  จัดส่งแล้ว
                </Button>
              </div>
            )}
            {order.status === "SHIPPED" && (
              <Button size="sm" variant="outline" disabled={loading} onClick={() => updateStatus("DELIVERED")}>
                ยืนยันส่งสำเร็จ
              </Button>
            )}
            {order.status === "DELIVERED" && (
              <Button size="sm" variant="outline" disabled={loading} onClick={() => updateStatus("REFUNDED")}>
                คืนเงิน
              </Button>
            )}
            {!["CANCELLED", "DELIVERED", "REFUNDED"].includes(order.status) && (
              <Button size="sm" variant="destructive" disabled={loading} onClick={() => updateStatus("CANCELLED")}>
                ยกเลิกคำสั่งซื้อ
              </Button>
            )}
          </div>

          <Separator />
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">เปลี่ยนสถานะโดยตรง</p>
            <div className="flex flex-wrap gap-2">
              {["PENDING","PAYMENT_UPLOADED","PAYMENT_VERIFIED","PAYMENT_REJECTED","PROCESSING","SHIPPED","DELIVERED","CANCELLED","REFUNDED"].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={order.status === s ? "default" : "outline"}
                  disabled={loading || order.status === s}
                  className="text-xs h-7"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: s, force: true }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error);
                      toast.success(`เปลี่ยนสถานะเป็น ${s}`);
                      router.refresh();
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ───── CUSTOMER TAB ───── */}
        <TabsContent value="customer" className="space-y-3">
          {field("ชื่อผู้สั่งซื้อ", "guestName")}
          {field("อีเมล", "guestEmail", { type: "email" })}
          {field("เบอร์โทร", "guestPhone")}
          <Separator />
          {field("หมายเหตุ", "note", { multiline: true })}
          <Button size="sm" onClick={saveEdit} disabled={loading}>
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </TabsContent>

        {/* ───── SHIPPING TAB ───── */}
        <TabsContent value="shipping" className="space-y-3">
          {/* Delivery / Pickup toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsPickup(false)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-sm font-medium transition-colors ${
                !isPickup
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <span className="text-xl">🚚</span>
              <span>จัดส่งถึงบ้าน</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPickup(true)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-sm font-medium transition-colors ${
                isPickup
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <span className="text-xl">🏪</span>
              <span>รับที่ร้าน</span>
            </button>
          </div>

          {/* Pickup info box */}
          {isPickup && (
            <div className="rounded-lg border bg-muted/40 p-3 text-sm space-y-1">
              <p className="font-medium">📍 ที่อยู่ Highbury International</p>
              <p className="text-muted-foreground">กรุณาติดต่อล่วงหน้าก่อนมารับสินค้า</p>
              <p className="text-muted-foreground">โทร: 02-896-8066 ต่อ 9</p>
              <p className="text-muted-foreground">LINE: @highbury</p>
            </div>
          )}

          {/* Address fields — delivery only */}
          {!isPickup && (
            <>
              {field("ชื่อผู้รับ", "shippingName")}
              {field("เบอร์โทรผู้รับ", "shippingPhone")}
              {field("ที่อยู่", "shippingAddress", { multiline: true })}
              <div className="grid grid-cols-2 gap-2">
                {field("อำเภอ/เขต", "shippingCity")}
                {field("จังหวัด", "shippingProvince")}
              </div>
              {field("รหัสไปรษณีย์", "shippingPostcode")}
            </>
          )}

          {!isPickup && (
            <>
              <Separator />
              {field("เลขพัสดุ", "trackingNumber")}
            </>
          )}
          <Button size="sm" onClick={saveEdit} disabled={loading}>
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
