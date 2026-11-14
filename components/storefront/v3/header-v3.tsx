"use client";

import Link from "next/link";
import { Ruler, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart";

interface HeaderV3Props {
  onOpenSizeGuide: () => void;
}

export default function HeaderV3({ onOpenSizeGuide }: HeaderV3Props) {
  const cartItems = useCartStore((s) => s.items);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left: Brand Logo in solid brand color */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[#163666] font-bold text-xl uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          <span>HIGHBURY</span>
        </Link>

        {/* Center: Desktop Navigation Links (Clean, untracked, sentence case/natural Thai) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#79716B]">
          <Link
            href="/products"
            className="hover:text-[#163666] transition-colors py-1"
          >
            สินค้าทั้งหมด
          </Link>
          <a
            href="#oem"
            className="hover:text-[#163666] transition-colors py-1"
          >
            รับผลิตยูนิฟอร์มและ OEM
          </a>
          <a
            href="#craftsmanship"
            className="hover:text-[#163666] transition-colors py-1"
          >
            คุณภาพการตัดเย็บ
          </a>
          <Link
            href="/about"
            className="hover:text-[#163666] transition-colors py-1"
          >
            เกี่ยวกับเรา
          </Link>
        </nav>

        {/* Right: Size Guide Button + Cart Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E7E5E4] text-[#163666] bg-white hover:bg-[#F9FAFB] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>ตารางไซส์</span>
          </button>

          <Link
            href="/cart"
            className="relative p-2 rounded-lg border border-[#E7E5E4] bg-white hover:bg-[#F9FAFB] text-[#0F172B] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="ตะกร้าสินค้า"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[#163666] text-white text-[11px] font-bold flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
