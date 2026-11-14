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
    <header className="sticky top-0 z-50 w-full bg-[#0A0B0E]/80 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Left: Brand Logo in Quantum Editorial Style */}
        <Link
          href="/"
          className="flex items-center gap-3 text-white tracking-[0.2em] font-extrabold text-lg sm:text-xl uppercase hover:opacity-90 transition-opacity"
        >
          <span>HIGHBURY</span>
        </Link>

        {/* Center: Desktop Navigation Links (Quantum style) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase text-white/70">
          <a
            href="#collection"
            className="hover:text-white transition-colors duration-150 py-1"
          >
            คอลเลกชัน
          </a>
          <a
            href="#craftsmanship"
            className="hover:text-white transition-colors duration-150 py-1"
          >
            ความประณีต
          </a>
          <a
            href="#technology"
            className="hover:text-white transition-colors duration-150 py-1"
          >
            เนื้อผ้า & เทคโนโลยี
          </a>
          <a
            href="#promise"
            className="hover:text-white transition-colors duration-150 py-1"
          >
            มาตรฐาน QC
          </a>
          <Link
            href="/about"
            className="hover:text-white transition-colors duration-150 py-1"
          >
            เรื่องราว
          </Link>
        </nav>

        {/* Right: Smart Size Finder Pill + Cart Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0A0B0E] font-bold text-xs hover:bg-slate-100 transition-transform active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5 text-blue-600" />
            <span>Size Finder</span>
          </button>

          <Link
            href="/cart"
            className="relative w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="ตะกร้าสินค้า"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">
                {totalCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
