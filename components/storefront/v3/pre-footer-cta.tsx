"use client";

import Link from "next/link";
import { ArrowRight, Ruler, Sparkles } from "lucide-react";

interface PreFooterCtaProps {
  onOpenSizeGuide: () => void;
}

export default function PreFooterCta({ onOpenSizeGuide }: PreFooterCtaProps) {
  return (
    <section className="relative w-full py-24 lg:py-32 bg-gradient-to-b from-[#091522] via-[#102236] to-[#071322] text-white overflow-hidden">
      {/* Warm dusk atmospheric glow matching Quantum */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 90%, rgba(217, 119, 6, 0.35) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.2) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-300 text-xs font-semibold border border-amber-400/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PROMOTION: ซื้อ 3 แถม 1 ฟรีทันที</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
          Feel the Difference
        </h2>

        <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
          สัมผัสความพอดีที่แท้จริง คัตติ้งประณีต และความสบายที่แตกต่างของ Highbury
          สั่งซื้อวันนี้พร้อมรับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน
        </p>

        {/* Dual Pill CTA Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#071322] font-bold text-sm hover:bg-slate-100 transition-[background-color,transform] duration-200 active:scale-[0.98] shadow-xl"
          >
            <span>เลือกซื้อเสื้อเชิ้ต</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-semibold text-sm border border-white/20 transition-colors duration-200 cursor-pointer"
          >
            <Ruler className="w-4 h-4 text-amber-300" />
            <span>ค้นหาไซส์ที่พอดี (Smart Size Finder)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
