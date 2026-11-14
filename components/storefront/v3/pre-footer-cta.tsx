"use client";

import Link from "next/link";
import { ArrowRight, Ruler } from "lucide-react";

interface PreFooterCtaProps {
  onOpenSizeGuide: () => void;
  lang?: "th" | "en";
}

export default function PreFooterCta({ onOpenSizeGuide, lang = "th" }: PreFooterCtaProps) {
  return (
    <section className="w-full py-20 sm:py-28 bg-[#07080B] text-white border-b border-[#262830]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-5">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
            {lang === "th" ? (
              <>
                สัมผัสความต่าง
                <br />
                ที่สร้างความมั่นใจในทุกวันทำงาน
              </>
            ) : (
              <>
                Feel the Difference
                <br />
                in Everyday Workwear
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#E7E7E7] leading-relaxed max-w-xl">
            {lang === "th"
              ? "สัมผัสความเบาสบาย คัตติ้งที่เสริมบุคลิกภาพ และความคงทนของเสื้อเชิ้ต Highbury ด้วยตัวคุณเอง"
              : "Experience the comfort, effortless drape, and tailored confidence of Highbury shirts for yourself."}
          </p>

          {/* Action Buttons: Exact Quantum Pill Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link href="#models" className="v3-btn-white">
              <span>{lang === "th" ? "เลือกซื้อสินค้า" : "Shop Collection"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="v3-btn-glass"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>{lang === "th" ? "คำนวณไซส์ Smart Size Finder" : "Smart Size Finder"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
