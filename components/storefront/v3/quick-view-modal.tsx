"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowRight, ShieldCheck, Ruler } from "lucide-react";
import { getProductPlaceholderImage } from "@/lib/placeholders";

export interface QuickViewProduct {
  id: string;
  name: string;
  nameTh: string;
  slug: string;
  descTh?: string | null;
  basePrice: number;
  category: {
    nameTh: string;
    slug: string;
  };
  images: { url: string; altText?: string | null }[];
  variants: {
    id: string;
    color: string;
    colorHex?: string | null;
    size: string;
    price: number;
  }[];
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  onClose: () => void;
  onOpenSizeGuide: () => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onOpenSizeGuide,
}: QuickViewModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (product && !dialog.open) {
      dialog.showModal();
    } else if (!product && dialog.open) {
      dialog.close();
    }
  }, [product]);

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!product) return null;

  const primaryImage =
    product.images[0]?.url || getProductPlaceholderImage(product.slug);

  const prices = product.variants.map((v) => v.price);
  const minPrice = prices.length ? Math.min(...prices) : product.basePrice;
  const maxPrice = prices.length ? Math.max(...prices) : product.basePrice;

  const sizes = Array.from(new Set(product.variants.map((v) => v.size))).filter(
    (s) => s !== "SS"
  );
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="v3-dialog w-[92vw] max-w-2xl rounded-2xl border border-border bg-background p-0 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm text-foreground overflow-hidden"
      aria-labelledby="quick-view-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-border/80 bg-slate-50 dark:bg-slate-900/60">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {product.category.nameTh}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Grid */}
      <div className="p-6 grid sm:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
        {/* Left: Product Image */}
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-border/80 bg-muted/30">
          <Image
            src={primaryImage}
            alt={product.nameTh}
            fill
            sizes="(max-width: 640px) 90vw, 320px"
            className="object-cover object-top"
          />
        </div>

        {/* Right: Details & Options */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <h2
              id="quick-view-title"
              className="text-lg font-bold text-foreground leading-snug"
            >
              {product.nameTh}
            </h2>

            <div className="mt-2 text-xl font-black text-[#0A2540] dark:text-blue-400">
              {minPrice === maxPrice
                ? `฿${minPrice.toLocaleString()}`
                : `฿${minPrice.toLocaleString()} – ฿${maxPrice.toLocaleString()}`}
            </div>

            {product.descTh && (
              <p className="mt-3 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {product.descTh}
              </p>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <span className="text-xs font-semibold text-foreground">สีที่มี:</span>
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-md bg-muted text-[11px] font-medium text-foreground border border-border"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">ไซส์:</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSizeGuide();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>ดูตารางไซส์</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((s) => (
                    <span
                      key={s}
                      className="w-8 h-8 rounded-lg border border-border/80 bg-background flex items-center justify-center text-xs font-bold text-foreground shadow-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Guarantee note */}
            <div className="mt-5 p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>รับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-border/60">
            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0A2540] dark:bg-blue-600 text-white font-semibold text-xs hover:bg-[#16385e] transition-colors"
            >
              <span>ดูรายละเอียดสินค้าและสั่งซื้อ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </dialog>
  );
}
