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
      className="v3-dialog w-[92vw] max-w-2xl rounded-2xl border border-[#262830] bg-[#0E1015] p-0 text-white overflow-hidden shadow-2xl backdrop:bg-black/80"
      aria-labelledby="quick-view-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#262830] bg-[#13161D]">
        <span className="text-xs font-semibold text-[#FFB900] uppercase tracking-wider">
          {product.category.nameTh}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full border border-[#262830] bg-white/5 hover:bg-white/10 text-[#9496A1] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Grid */}
      <div className="p-6 grid sm:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto bg-[#0E1015]">
        {/* Left: Product Image */}
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-[#262830] bg-[#13161D]">
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
              className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug"
            >
              {product.nameTh}
            </h2>

            <div className="mt-2 font-mono text-xl sm:text-2xl font-bold text-[#FFB900]">
              {minPrice === maxPrice
                ? `฿${minPrice.toLocaleString()}`
                : `฿${minPrice.toLocaleString()} – ฿${maxPrice.toLocaleString()}`}
            </div>

            {product.descTh && (
              <p className="mt-3 text-xs sm:text-sm text-[#E7E7E7] line-clamp-3 leading-relaxed">
                {product.descTh}
              </p>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <span className="text-xs font-medium text-white">สี:</span>
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-full bg-[#181B24] text-xs font-medium text-white border border-[#262830]"
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
                  <span className="text-xs font-medium text-white">ไซส์:</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSizeGuide();
                    }}
                    className="inline-flex items-center gap-1 text-xs text-[#FFB900] hover:underline cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>ดูตารางไซส์</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((s) => (
                    <span
                      key={s}
                      className="w-9 h-9 rounded-lg border border-[#262830] bg-[#181B24] flex items-center justify-center font-mono text-xs font-semibold text-white"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Guarantee note */}
            <div className="mt-4 p-3 rounded-xl bg-[#13161D] border border-[#262830] flex items-center gap-2.5 text-xs text-[#E7E7E7]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#FFB900]" />
              <span>รับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-[#262830]">
            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="v3-btn-white w-full justify-center py-3 text-sm font-semibold"
            >
              <span>ดูรายละเอียดสินค้าและสั่งซื้อ</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </dialog>
  );
}
