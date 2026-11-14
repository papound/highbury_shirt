"use client";

import Link from "next/link";
import { ArrowRight, Ruler } from "lucide-react";

interface PreFooterCtaProps {
  onOpenSizeGuide: () => void;
  lang?: "th" | "en";
}

export default function PreFooterCta({ onOpenSizeGuide, lang = "th" }: PreFooterCtaProps) {
  return (
    <section className="relative w-full py-28 sm:py-36 bg-[#07080B] text-white overflow-hidden border-b border-white/10">
      {/* Sunset atmosphere gradient matching Quantum Feel the Difference scene */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 75% 50%, rgba(245, 158, 11, 0.3) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.2) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl space-y-6">
          <div className="text-xs font-semibold tracking-[0.25em] text-amber-400 uppercase">
            EXPERIENCE HIGHBURY · สัมผัสความพอดี
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.03em] text-white leading-[1.05]">
            {lang === "th" ? (
              <>
                สัมผัสความต่าง
                <br />
                ที่สร้างความมั่นใจ
              </>
            ) : (
              <>
                Feel the
                <br />
                Difference
              </>
            )}
          </h2>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl">
            {lang === "th"
              ? "สัมผัสความเบาสบาย คัตติ้งที่เสริมบุคลิกภาพ และความคงทนของเสื้อเชิ้ต Highbury ด้วยตัวคุณเอง"
              : "Experience the comfort, effortless drape, and tailored confidence of Highbury for yourself."}
          </p>

          {/* Action Buttons (Quantum Style: White Pill & Outline Glass Pill) */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link href="#models" className="v3-btn-white">
              <span>{lang === "th" ? "เลือกซื้อสินค้า" : "Shop Collection"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="v3-btn-glass"
            >
              <Ruler className="w-4 h-4 text-amber-400" />
              <span>{lang === "th" ? "คำนวณไซส์ Smart Size Finder" : "Smart Size Finder"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
