"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingCart, Tag, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/hooks/use-cart";
import { useEffect, useState, useCallback } from "react";
import { evaluatePromotions } from "@/lib/promotions";
import type { AppliedPromotion } from "@/types";

export default function CartPage() {
  const {
    items,
    appliedPromotions,
    subtotal,
    discountAmount,
    total,
    removeItem,
    updateQuantity,
    refreshAutoPromotions,
    applyCodePromotion,
    removeCodePromotion,
  } = useCartStore();

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const codePromo = appliedPromotions.find((p) => p.fromCode);

  // Auto-evaluate promotions whenever cart items change
  const fetchAndEvaluate = useCallback(async () => {
    if (items.length === 0) {
      refreshAutoPromotions([]);
      return;
    }
    try {
      const res = await fetch("/api/promotions");
      if (!res.ok) return;
      const promotions = await res.json();
      const evaluated = evaluatePromotions(items, promotions);
      refreshAutoPromotions(evaluated);
    } catch {
      // silently fail — promos just won't show
    }
  }, [items, refreshAutoPromotions]);

  useEffect(() => {
    fetchAndEvaluate();
  }, [fetchAndEvaluate]);

  async function handleApplyCode() {
    if (!promoCode.trim()) return;
    setPromoError("");
    setPromoLoading(true);
    try {
      const res = await fetch("/api/promotions/validate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim(), items }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.error ?? "ไม่สามารถใช้รหัสนี้ได้");
      } else {
        applyCodePromotion(data as AppliedPromotion);
        setPromoCode("");
        setPromoError("");
      }
    } catch {
      setPromoError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setPromoLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">ตะกร้าสินค้าว่างเปล่า</h1>
        <p className="text-muted-foreground mb-6">เพิ่มสินค้าเพื่อเริ่มสั่งซื้อ</p>
        <Button asChild>
          <Link href="/products">ดูสินค้าทั้งหมด</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ตะกร้าสินค้า ({items.length} รายการ)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex gap-4 p-4 border rounded-lg bg-card"
            >
              {/* Image */}
              <div className="w-20 h-20 relative rounded-md overflow-hidden bg-gray-100 shrink-0">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.productNameTh}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-medium hover:text-primary line-clamp-2"
                >
                  {item.productNameTh}
                </Link>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{item.color}</Badge>
                  <Badge variant="outline" className="text-xs">{item.size}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
              </div>

              {/* Qty + Price + Remove */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    ฿{(item.unitPrice * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ฿{item.unitPrice.toLocaleString()} / ตัว
                  </p>
                </div>
                <div className="flex items-center border rounded-md">
                  <button
                    className="px-2 py-1 hover:bg-secondary transition-colors"
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-3 text-sm">{item.quantity}</span>
                  <button
                    className="px-2 py-1 hover:bg-secondary transition-colors"
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  className="text-xs text-destructive hover:underline flex items-center gap-1"
                  onClick={() => removeItem(item.variantId)}
                >
                  <Trash2 className="h-3 w-3" />
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="border rounded-lg p-5 bg-card space-y-4 sticky top-20">
            <h2 className="font-semibold text-lg">สรุปคำสั่งซื้อ</h2>
            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ราคาสินค้า</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>

              {appliedPromotions.map((promo) => (
                <div key={promo.promotionId} className="flex justify-between items-center text-green-600">
                  <span className="flex items-center gap-1">
                    🎁 {promo.name}
                    {promo.fromCode && (
                      <button
                        onClick={removeCodePromotion}
                        className="ml-1 text-muted-foreground hover:text-destructive"
                        title="นำออก"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                  <span>-฿{promo.discountAmount.toLocaleString()}</span>
                </div>
              ))}

              <div className="flex justify-between">
                <span className="text-muted-foreground">ค่าจัดส่ง</span>
                <span className="text-muted-foreground">คำนวณที่ checkout</span>
              </div>
            </div>

            {discountAmount > 0 && (
              <>
                <Separator />
                <div className="text-sm text-green-600 font-medium">
                  ประหยัด ฿{discountAmount.toLocaleString()}!
                </div>
              </>
            )}

            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>รวม</span>
              <span className="text-primary">฿{total.toLocaleString()}</span>
            </div>

            {/* Promo code input */}
            {!codePromo && (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-1">
                  <Tag className="h-4 w-4" /> รหัสโปรโมชัน
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="กรอกรหัส..."
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCode()}
                    className="uppercase text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApplyCode}
                    disabled={promoLoading || !promoCode.trim()}
                  >
                    {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "ใช้"}
                  </Button>
                </div>
                {promoError && (
                  <p className="text-xs text-destructive">{promoError}</p>
                )}
              </div>
            )}

            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout">ดำเนินการสั่งซื้อ →</Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/products">← ช้อปปิ้งต่อ</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
