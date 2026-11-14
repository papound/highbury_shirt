"use client";

import Link from "next/link";
import { ArrowRight, Ruler, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { useStorefrontV3Safe } from "../storefront-shell";

interface PreFooterCtaProps {
  onOpenSizeGuide: () => void;
  lang?: "th" | "en";
}

export default function PreFooterCta({
  onOpenSizeGuide,
  lang: propLang,
}: PreFooterCtaProps) {
  const v3 = useStorefrontV3Safe();
  const theme = v3?.theme || "dark";
  const lang = propLang || v3?.lang || "th";
  const isLight = theme === "light";

  return (
    <section id="about" className="relative w-full py-16 sm:py-20 lg:py-28 overflow-hidden scroll-mt-20">
      {/* Top Edge Blend (Seamless Transition from Standards Landscape) */}
      <div
        className={`absolute inset-x-0 top-0 h-14 sm:h-16 lg:h-20 pointer-events-none z-1 transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-b from-white/25 via-white/8 to-transparent"
            : "bg-gradient-to-b from-[#07080B]/25 via-[#07080B]/8 to-transparent"
        }`}
      />

      {/* Ambient Glow / Subtle Gradient Dissolve Background (No Box Border Frame) */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-b from-[#F8FAFC]/50 via-[#F1F5F9]/80 to-[#E2E8F0]/30"
            : "bg-gradient-to-b from-transparent via-[#0E1015]/60 to-[#07080B]"
        }`}
      />
      <div
        aria-hidden="true"
        className={`absolute -top-32 left-10 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none transition-opacity duration-300 ${
          isLight ? "bg-[#2563EB]/10" : "bg-[#FFB900]/10"
        }`}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Floating Frosted Glass Card with 3 Assurances (order-2 on mobile, order-1 on lg) */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-start">
            <div
              className="w-full max-w-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl space-y-6 transition-all duration-300"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.55)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderColor: "rgba(255, 255, 255, 0.18)",
                borderWidth: "1px",
                borderStyle: "solid",
                color: "#FFFFFF",
              }}
            >
              {/* Stat 1: 7 Days Return */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    7 Days
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                    {lang === "th" ? "รับประกันเปลี่ยนไซส์ฟรี" : "Free Size Exchange"}
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/60 mt-0.5">
                    {lang === "th" ? "ลองใส่แล้วไม่พอดี เปลี่ยนใหม่ได้ทันที ไม่มีค่าใช้จ่าย" : "Swap sizes hassle-free if it doesn't fit perfectly"}
                  </div>
                </div>
              </div>

              {/* Stat 2: Asian Fit */}
              <div className="flex items-start gap-4 border-t border-white/15 pt-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Asian Fit
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                    {lang === "th" ? "แพทเทิร์นสรีระคนไทยโดยเฉพาะ" : "Asian Proportion Silhouette"}
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/60 mt-0.5">
                    {lang === "th" ? "สัดส่วนไหล่และวงแขนพอดี คล่องตัว ไม่ตึงรั้ง" : "Sculpted proportions deliver effortless mobility"}
                  </div>
                </div>
              </div>

              {/* Stat 3: Corporate OEM */}
              <div className="flex items-start gap-4 border-t border-white/15 pt-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    3,500 Pcs
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                    {lang === "th" ? "บริการสั่งผลิตยูนิฟอร์มองค์กร (OEM)" : "Corporate Uniform OEM Capacity"}
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/60 mt-0.5">
                    {lang === "th" ? "กำลังผลิตต่อเดือน พร้อมบริการปักโลโก้และเลือกผ้าตาม CI" : "Monthly capacity with custom embroidery & fabric CI"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Heading, Subtitle & Action Pills (order-1 on mobile, order-2 on lg) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 max-w-xl lg:ml-auto">
            {/* Category Tracker Tag (Exact Quantum Style) */}
            <div
              className={`text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase ${
                isLight ? "text-[#64748B]" : "text-[#9496A1]"
              }`}
            >
              EXPERIENCE+
            </div>

            {/* Display Heading */}
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th" ? (
                <>
                  สัมผัสความต่าง
                  <br />
                  ที่สร้างความมั่นใจในทุกวันทำงาน.
                </>
              ) : (
                <>
                  Feel the Difference
                  <br />
                  in Everyday Workwear.
                </>
              )}
            </h2>

            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isLight ? "text-[#475569]" : "text-[#E7E7E7]"
              }`}
            >
              {lang === "th"
                ? "สัมผัสความเบาสบาย คัตติ้งที่เสริมบุคลิกภาพ และความคงทนของเสื้อเชิ้ต Highbury ด้วยตัวคุณเอง มั่นใจได้ในทุกการสั่งซื้อด้วยการรับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน"
                : "Experience the comfort, effortless drape, and tailored confidence of Highbury shirts for yourself, backed by our 7-day hassle-free size exchange guarantee."}
            </p>

            {/* Action Buttons: Exact Quantum Pill Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="#models"
                className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md group cursor-pointer ${
                  isLight
                    ? "bg-[#0F172A] text-white hover:bg-[#1E293B]"
                    : "bg-white text-[#07080B] hover:bg-white/90"
                }`}
              >
                <span>{lang === "th" ? "เลือกซื้อสินค้า" : "Shop Collection"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={onOpenSizeGuide}
                className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isLight
                    ? "bg-white text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F8FAFC] shadow-xs"
                    : "bg-black text-white border border-white/20 hover:bg-white/10"
                }`}
              >
                <Ruler className="w-4 h-4 text-[#FFB900]" />
                <span>{lang === "th" ? "คำนวณไซส์ Smart Size Finder" : "Smart Size Finder"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
