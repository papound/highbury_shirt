"use client";

import Link from "next/link";
import { ArrowRight, Ruler, Sparkles } from "lucide-react";

interface PreFooterCtaProps {
  onOpenSizeGuide: () => void;
}

export default function PreFooterCta({ onOpenSizeGuide }: PreFooterCtaProps) {
  return (
    <section className="relative w-full py-28 lg:py-40 bg-gradient-to-b from-[#0A0B0E] via-[#14161E] to-[#0A0B0E] text-white overflow-hidden">
      {/* Warm dusk atmospheric glow matching Quantum */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 90%, rgba(245, 158, 11, 0.4) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(46, 144, 250, 0.25) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-amber-400/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PROMOTION: ซื้อ 3 แถม 1 ฟรีทันที</span>
        </div>

        <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal text-white tracking-tight leading-[1.02]">
          Feel the Difference
        </h2>

        <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed font-sans">
          สัมผัสความพอดีที่แท้จริง คัตติ้งประณีต และความสบายที่แตกต่างของ Highbury
          สั่งซื้อวันนี้พร้อมรับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน
        </p>

        {/* Dual Pill CTA Buttons (Quantum style) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/products" className="v3-btn-white w-full sm:w-auto">
            <span>เลือกซื้อเสื้อเชิ้ต</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="v3-btn-glass w-full sm:w-auto"
          >
            <Ruler className="w-4 h-4 text-amber-300" />
            <span>Smart Size Finder</span>
          </button>
        </div>
      </div>
    </section>
  );
}
