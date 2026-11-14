"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { getProductPlaceholderImage } from "@/lib/placeholders";
import { QuickViewProduct } from "./quick-view-modal";

interface ProductCardV3Props {
  product: QuickViewProduct;
  onQuickView: (product: QuickViewProduct) => void;
}

export default function ProductCardV3({
  product,
  onQuickView,
}: ProductCardV3Props) {
  const primaryImg =
    product.images[0]?.url || getProductPlaceholderImage(product.slug);

  const prices = product.variants.map((v) => v.price);
  const minPrice = prices.length ? Math.min(...prices) : product.basePrice;
  const maxPrice = prices.length ? Math.max(...prices) : product.basePrice;

  // Filter out SS
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)))
    .filter((s) => s !== "SS")
    .slice(0, 5);

  return (
    <div className="group relative flex flex-col h-full rounded-xl border border-[#E7E5E4] bg-white overflow-hidden hover:border-[#163666] transition-colors duration-150">
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] bg-[#F1F5F9] overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={primaryImg}
            alt={product.images[0]?.altText ?? product.nameTh}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top"
          />
        </Link>

        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md bg-white text-[11px] font-semibold text-[#0F172B] border border-[#E7E5E4]">
            {product.category.nameTh}
          </span>
        </div>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-white text-[#0F172B] font-semibold text-xs border border-[#E7E5E4] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#163666]" />
            <span>ดูข้อมูลด่วน</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="block text-sm sm:text-base font-bold text-[#0F172B] hover:text-[#163666] transition-colors line-clamp-1"
          >
            {product.nameTh}
          </Link>
          <p className="text-xs text-[#79716B] line-clamp-2 mt-1 leading-relaxed">
            {product.descTh || "เสื้อเชิ้ตคุณภาพสูง คัตติ้งเนี้ยบสำหรับคนไทย"}
          </p>
        </div>

        <div className="pt-2 border-t border-[#E7E5E4] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#79716B]">ราคา</span>
            <div className="text-base font-bold text-[#163666]">
              {minPrice === maxPrice
                ? `฿${minPrice.toLocaleString()}`
                : `฿${minPrice.toLocaleString()} - ฿${maxPrice.toLocaleString()}`}
            </div>
          </div>

          {sizes.length > 0 && (
            <div className="flex items-center gap-1">
              {sizes.map((s) => (
                <span
                  key={s}
                  className="px-1.5 py-0.5 rounded border border-[#E7E5E4] text-[10px] text-[#79716B]"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
