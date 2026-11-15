"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

      {/* Ambient Subtle Background */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-b from-[#F8FAFC]/50 via-[#F1F5F9]/80 to-[#E2E8F0]/30"
            : "bg-gradient-to-b from-transparent via-[#0E1015]/60 to-[#07080B]"
        }`}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Liquid Glass Translucent Card with Grounded Assurances (order-2 on mobile, order-1 on lg) */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-start">
            <div
              className="w-full max-w-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-300"
              style={{
                backgroundColor: isLight ? "rgba(255, 255, 255, 0.76)" : "rgba(10, 12, 16, 0.70)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                borderColor: isLight ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.12)",
                boxShadow: isLight
                  ? "inset 0 1px 1px 0 rgba(255, 255, 255, 0.95), 0 20px 40px -15px rgba(0, 0, 0, 0.06)"
                  : "inset 0 1px 1px 0 rgba(255, 255, 255, 0.18), 0 24px 48px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Stat 1: 7 Days Return */}
              <div>
                <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}>
                  {lang === "th" ? "7 วัน" : "7 Days"}
                </div>
                <div className={`text-xs sm:text-sm font-medium mt-1 ${
                  isLight ? "text-[#0F172A]" : "text-white/90"
                }`}>
                  {lang === "th" ? "รับประกันเปลี่ยนไซส์ฟรี" : "Free Size Exchange"}
                </div>
                <div className={`text-xs mt-0.5 ${
                  isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                }`}>
                  {lang === "th" ? "นับจากวันรับพัสดุ หากไม่พอดีเปลี่ยนใหม่ได้ทันที" : "From parcel delivery date; instant replacement if size is off."}
                </div>
              </div>

              {/* Stat 2: Tailored Asian Fit */}
              <div className={`border-t pt-5 mt-5 ${
                isLight ? "border-slate-200/80" : "border-white/10"
              }`}>
                <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}>
                  {lang === "th" ? "ทรงพอดีตัว" : "Asian Fit"}
                </div>
                <div className={`text-xs sm:text-sm font-medium mt-1 ${
                  isLight ? "text-[#0F172A]" : "text-white/90"
                }`}>
                  {lang === "th" ? "แพทเทิร์นสำหรับคนไทย" : "Tailored Proportion"}
                </div>
                <div className={`text-xs mt-0.5 ${
                  isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                }`}>
                  {lang === "th" ? "สัดส่วนไหล่และวงแขนพอดี คล่องตัว ไม่ตึงรั้ง" : "Balanced shoulder-to-armhole ratio for natural everyday movement."}
                </div>
              </div>

              {/* Stat 3: Corporate OEM */}
              <div className={`border-t pt-5 mt-5 ${
                isLight ? "border-slate-200/80" : "border-white/10"
              }`}>
                <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}>
                  {lang === "th" ? "3,500 ตัว" : "3,500 Pcs"}
                </div>
                <div className={`text-xs sm:text-sm font-medium mt-1 ${
                  isLight ? "text-[#0F172A]" : "text-white/90"
                }`}>
                  {lang === "th" ? "กำลังผลิตต่อเดือน (OEM)" : "Monthly Workshop Capacity"}
                </div>
                <div className={`text-xs mt-0.5 ${
                  isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                }`}>
                  {lang === "th" ? "เวิร์กช็อปรองรับการปักโลโก้และเลือกผ้าตาม CI" : "Highbury workshop line with custom embroidery & fabric CI options."}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Heading, Subtitle & Action Pills (order-1 on mobile, order-2 on lg) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 max-w-xl lg:ml-auto">
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
                ? "เสื้อเชิ้ต Highbury ออกแบบเพื่อความสบาย คัตติ้งเนี้ยบ ดูแลง่าย พร้อมการรับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน"
                : "Highbury shirts deliver all-day comfort, clean tailoring, and easy-care fabrics, backed by a 7-day size exchange guarantee."}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="#models"
                className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 group cursor-pointer border ${
                  isLight
                    ? "bg-[#0F172A] !text-white border-[#0F172A] hover:bg-[#1E293B]"
                    : "bg-white text-[#07080B] border-white hover:bg-white/90"
                }`}
              >
                <span className={isLight ? "!text-white" : ""}>{lang === "th" ? "เลือกซื้อสินค้า" : "Shop Collection"}</span>
                <ArrowRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${isLight ? "!text-white" : ""}`} />
              </Link>

              <button
                type="button"
                onClick={onOpenSizeGuide}
                className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isLight
                    ? "bg-white text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F8FAFC]"
                    : "bg-transparent text-white border border-[#262830] hover:bg-white/10"
                }`}
              >
                <span>{lang === "th" ? "คำนวณไซส์ Smart Size Finder" : "Smart Size Finder"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
