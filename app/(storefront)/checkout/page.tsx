"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/hooks/use-cart";
import { calcShippingFee, shippingFeeLabel } from "@/lib/shipping";
import { toast } from "sonner";

const schema = z.object({
  guestName: z.string().min(2, "กรุณาระบุชื่อ-นามสกุล"),
  guestEmail: z.string().email("อีเมลไม่ถูกต้อง"),
  guestPhone: z.string().min(9, "เบอร์โทรไม่ถูกต้อง"),
  shippingName: z.string().optional(),
  shippingPhone: z.string().optional(),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingProvince: z.string().optional(),
  shippingPostcode: z.string().optional(),
  note: z.string().optional(),
  promotionCode: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type DeliveryMethod = "delivery" | "pickup";

interface OrderResult {
  orderId: string;
  orderNumber: string;
  total: number;
  qrPayload: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, discountAmount, subtotal, appliedPromotions, clearCart } = useCartStore();
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipUploading, setSlipUploading] = useState(false);
  const [slipUploaded, setSlipUploaded] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      shippingName: "",
      shippingPhone: "",
      shippingAddress: "",
      shippingCity: "",
      shippingProvince: "",
      shippingPostcode: "",
    },
  });

  const isDelivery = deliveryMethod === "delivery";
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const hasFreeShipping = appliedPromotions.some((p) => p.promotionType === "FREE_SHIPPING");
  const shippingFee = calcShippingFee(totalQty, { isPickup: !isDelivery, hasFreeShippingPromo: hasFreeShipping });

  async function onSubmit(values: FormValues) {
    if (items.length === 0) {
      toast.error("ตะกร้าสินค้าว่างเปล่า");
      return;
    }
    // Validate shipping fields only when delivery is selected
    if (isDelivery) {
      const missing =
        !values.shippingName?.trim() ||
        !values.shippingPhone?.trim() ||
        !values.shippingAddress?.trim() ||
        !values.shippingCity?.trim() ||
        !values.shippingProvince?.trim() ||
        (values.shippingPostcode ?? "").length !== 5;
      if (missing) {
        toast.error("กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบถ้วน");
        return;
      }
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, items, deliveryMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "เกิดข้อผิดพลาด");
      setOrderResult(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  async function handleSlipUpload() {
    if (!slipFile || !orderResult) return;
    setSlipUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", slipFile);
      formData.append("orderId", orderResult.orderId);

      const res = await fetch("/api/payment-slip", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "อัพโหลดไม่สำเร็จ");

      setSlipUploaded(true);
      clearCart();
      toast.success("อัพโหลดสลิปสำเร็จ! รอการยืนยันจากเรา");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSlipUploading(false);
    }
  }

  // Post-order: show QR + slip upload
  if (orderResult) {
    if (slipUploaded) {
      return (
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">รับคำสั่งซื้อแล้ว!</h1>
          <p className="text-muted-foreground mb-4">
            หมายเลขคำสั่งซื้อ: <strong>#{orderResult.orderNumber}</strong>
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            เราจะตรวจสอบการชำระเงินและดำเนินการจัดส่งโดยเร็วที่สุด
            คุณจะได้รับการแจ้งเตือนทาง Email
          </p>
          <Button asChild>
            <a href="/">กลับหน้าหลัก</a>
          </Button>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-2xl font-bold mb-2 text-center">ชำระเงิน</h1>
        <p className="text-center text-muted-foreground mb-6">
          หมายเลขคำสั่งซื้อ: <strong className="text-foreground">#{orderResult.orderNumber}</strong>
        </p>

        <div className="border rounded-xl p-6 text-center space-y-4 bg-card">
          <div className="text-3xl font-bold text-primary">
            ฿{orderResult.total.toLocaleString()}
          </div>
          <div className="flex justify-center">
            <QRCode
              value={orderResult.qrPayload}
              size={220}
              style={{ border: "8px solid white", borderRadius: 4 }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            สแกน QR Code ด้วยแอปธนาคาร เพื่อชำระเงิน
          </p>

          {/* Payment options */}
          <div className="space-y-3 text-left">
            {/* PromptPay */}
            <div className="border border-[#003F97]/30 rounded-lg p-4 bg-[#003F97]/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#003F97] text-white rounded-md px-3 py-1 text-xs font-bold tracking-wide">PromptPay</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">หมายเลข</span>
                <span className="font-mono font-bold tracking-widest">098-146-6416</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">ชื่อ</span>
                <span className="text-sm font-semibold">นายประชา นาควังศาสตร์</span>
              </div>
            </div>

            {/* SCB Bank */}
            <div className="border border-[#4e2a8e]/30 rounded-lg p-4 bg-[#4e2a8e]/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#4e2a8e] text-white rounded-md px-3 py-1 text-xs font-bold tracking-wide">SCB</span>
                <span className="text-xs text-[#4e2a8e] font-medium">ไทยพาณิชย์</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">เลขที่บัญชี</span>
                <span className="font-mono font-bold tracking-widest">046-2-91316-6</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">ชื่อบัญชี</span>
                <span className="text-sm font-semibold">นายประชา นาควังศาสตร์</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h2 className="font-semibold">อัพโหลดหลักฐานการโอน</h2>
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-primary/40 rounded-xl p-8 cursor-pointer hover:bg-primary/5 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setSlipFile(e.target.files?.[0] ?? null)}
            />
            {slipFile ? (
              <>
                <span className="text-3xl">🖼️</span>
                <span className="text-sm font-medium text-primary">{slipFile.name}</span>
                <span className="text-xs text-muted-foreground">คลิกเพื่อเปลี่ยนไฟล์</span>
              </>
            ) : (
              <>
                <span className="text-3xl">📎</span>
                <span className="text-sm font-semibold">เลือกไฟล์สลิป</span>
                <span className="text-xs text-muted-foreground">JPG, PNG — คลิกหรือลากไฟล์มาวาง</span>
              </>
            )}
          </label>

          <Button
            className="w-full"
            size="lg"
            onClick={handleSlipUpload}
            disabled={!slipFile || slipUploading}
          >
            {slipUploading ? "กำลังอัพโหลด..." : "อัพโหลดสลิป"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ดำเนินการสั่งซื้อ</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">ข้อมูลผู้สั่งซื้อ</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="guestName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อ-นามสกุล *</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="guestPhone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>เบอร์โทร *</FormLabel>
                      <FormControl><Input type="tel" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="guestEmail" render={({ field }) => (
                  <FormItem>
                    <FormLabel>อีเมล *</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <Separator />

              {/* Delivery Method */}
              <div className="space-y-3">
                <h2 className="font-semibold text-lg">วิธีรับสินค้า</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-colors ${
                      isDelivery
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="text-2xl">🚚</span>
                    <span>จัดส่งถึงบ้าน</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {hasFreeShipping ? "ฟรีค่าจัดส่ง" : shippingFeeLabel(totalQty)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-colors ${
                      !isDelivery
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="text-2xl">🏪</span>
                    <span>รับที่ร้าน</span>
                    <span className="text-xs font-normal text-muted-foreground">ไม่มีค่าจัดส่ง</span>
                  </button>
                </div>

                {/* Pickup info */}
                {!isDelivery && (
                  <div className="rounded-lg border bg-muted/40 p-4 text-sm space-y-1">
                    <p className="font-medium">📍 ที่อยู่ Highbury International</p>
                    <p className="text-muted-foreground">กรุณาติดต่อล่วงหน้าก่อนมารับสินค้า</p>
                    <p className="text-muted-foreground">โทร: 02-896-8066 ต่อ 9</p>
                    <p className="text-muted-foreground">LINE: @highbury</p>
                  </div>
                )}
              </div>

              {/* Shipping Address — shown only when delivery */}
              {isDelivery && (
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg">ที่อยู่จัดส่ง</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="shippingName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>ชื่อผู้รับ *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="shippingPhone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>เบอร์โทรผู้รับ *</FormLabel>
                        <FormControl><Input type="tel" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="shippingAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel>ที่อยู่ *</FormLabel>
                      <FormControl><Textarea rows={3} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="shippingCity" render={({ field }) => (
                      <FormItem>
                        <FormLabel>เขต/อำเภอ *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="shippingProvince" render={({ field }) => (
                      <FormItem>
                        <FormLabel>จังหวัด *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="shippingPostcode" render={({ field }) => (
                      <FormItem>
                        <FormLabel>รหัสไปรษณีย์ *</FormLabel>
                        <FormControl><Input maxLength={5} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              )}

              <Separator />

              {/* Note + Promo */}
              <div className="space-y-4">
                <FormField control={form.control} name="promotionCode" render={({ field }) => (
                  <FormItem>
                    <FormLabel>รหัสโปรโมชั่น (ถ้ามี)</FormLabel>
                    <FormControl>
                      <Input placeholder="เช่น SUMMER20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="note" render={({ field }) => (
                  <FormItem>
                    <FormLabel>หมายเหตุ (ถ้ามี)</FormLabel>
                    <FormControl>
                      <Textarea rows={2} placeholder="ต้องการอะไรเพิ่มเติมไหม?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "กำลังสร้างคำสั่งซื้อ..." : "สร้างคำสั่งซื้อและไปชำระเงิน →"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="border rounded-lg p-5 bg-card space-y-3 sticky top-20">
            <h2 className="font-semibold">สรุปคำสั่งซื้อ</h2>
            <Separator />
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between text-sm">
                <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                  {item.productNameTh} ({item.color}, {item.size}) ×{item.quantity}
                </span>
                <span>฿{(item.unitPrice * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <Separator />
            <div className="text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ราคาสินค้า</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>ส่วนลด</span>
                  <span>-฿{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">ค่าจัดส่ง</span>
                <span>
                  {!isDelivery
                    ? <span className="text-muted-foreground">รับที่ร้าน</span>
                    : shippingFee === 0
                      ? <span className="text-green-600">ฟรี</span>
                      : `฿${shippingFee}`
                  }
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>รวมทั้งสิ้น</span>
              <span className="text-primary">฿{(total + shippingFee).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
