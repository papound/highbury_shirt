"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Scissors, Sparkles, Shirt } from "lucide-react";
import { useStorefrontV3Safe } from "../storefront-shell";

interface CraftStoryProps {
  lang?: "th" | "en";
}

export default function CraftStory({ lang: propLang }: CraftStoryProps) {
  const v3 = useStorefrontV3Safe();
  const theme = v3?.theme || "dark";
  const lang = propLang || v3?.lang || "th";
  const isLight = theme === "light";

  return (
    <section id="craftsmanship" className="relative w-full min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden scroll-mt-20">
      {/* Background Image: Highbury Tailoring Workshop (Top-aligned so heads and faces are visible) */}
      <Image
        src="/images/craft-story.jpg"
        alt="Highbury Asian Fit Tailoring Craftsmanship"
        fill
        sizes="100vw"
        className="object-cover object-[25%_top] lg:object-[35%_top]"
      />

      {/* Top Edge Blend (Seamless Transition from Hero) */}
      <div
        className={`absolute inset-x-0 top-0 h-14 sm:h-16 lg:h-20 pointer-events-none z-1 transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-b from-white/25 via-white/8 to-transparent"
            : "bg-gradient-to-b from-[#07080B]/25 via-[#07080B]/8 to-transparent"
        }`}
      />

      {/* Bottom Edge Blend (Seamless Transition into Carousel) */}
      <div
        className={`absolute inset-x-0 bottom-0 h-14 sm:h-16 lg:h-20 pointer-events-none z-1 transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-t from-white/25 via-white/8 to-transparent"
            : "bg-gradient-to-t from-[#07080B]/25 via-[#07080B]/8 to-transparent"
        }`}
      />

      {/* Smooth Gradient Fade Layer (Softer, Airier Dissolve from Right for Text Readability) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 max-lg:hidden z-1"
        style={{
          background: isLight
            ? "linear-gradient(to left, #FFFFFF 0%, rgba(255, 255, 255, 0.96) 20%, rgba(255, 255, 255, 0.72) 30%, rgba(255, 255, 255, 0.15) 42%, transparent 52%)"
            : "linear-gradient(to left, #07080B 0%, rgba(7, 8, 11, 0.94) 20%, rgba(7, 8, 11, 0.65) 30%, rgba(7, 8, 11, 0.12) 42%, transparent 52%)",
        }}
      />
      {/* Mobile Fade Layer */}
      <div
        className={`lg:hidden absolute inset-0 pointer-events-none transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-t from-white/95 via-white/80 via-40% to-transparent"
            : "bg-gradient-to-t from-[#07080B]/95 via-[#07080B]/80 via-40% to-transparent"
        }`}
      />

      {/* Content Container aligned with site grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Floating Frosted Glass Card with 3 Specs (order-2 on mobile, order-1 on lg) */}
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
              {/* Stat 1: Collar */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                  <Scissors className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    01
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                    {lang === "th" ? "โครงสร้างปก (Dual-Fused Collar)" : "Dual-Fused Collar Stance"}
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/60 mt-0.5">
                    {lang === "th" ? "ปกอัดกาวสองชั้น ตั้งทรงสวย ไม่ย้วย แม้ไม่ผูกเนกไท" : "Two-layer fusing maintains crisp stance all day"}
                  </div>
                </div>
              </div>

              {/* Stat 2: Asian Fit Armhole */}
              <div className="flex items-start gap-4 border-t border-white/15 pt-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                  <Shirt className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    02
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                    {lang === "th" ? "วงแขน Asian Fit (Sculpted Armhole)" : "Sculpted Asian Fit Armhole"}
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/60 mt-0.5">
                    {lang === "th" ? "ลดการรั้งช่วงไหล่ ขยับตัวคล่องตัวตลอดวันทำงาน" : "Engineered curves eliminate torso & shoulder pull"}
                  </div>
                </div>
              </div>

              {/* Stat 3: Easy Care */}
              <div className="flex items-start gap-4 border-t border-white/15 pt-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    03
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                    {lang === "th" ? "การรีด Easy Care (Wrinkle Recovery)" : "Easy-Care Wrinkle Recovery"}
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/60 mt-0.5">
                    {lang === "th" ? "คืนทรงหลังซัก สะบัดแขวน ประหยัดเวลารีด 50%" : "Fabric rebounds post-wash, 50% less ironing"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Heading, Subtitle & Action Button (order-1 on mobile, order-2 on lg) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 max-w-xl lg:ml-auto">
            {/* Reference-style Category Tracker */}
            <div
              className={`text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase ${
                isLight ? "text-[#64748B]" : "text-[#9496A1]"
              }`}
            >
              CRAFTSMANSHIP+
            </div>

            {/* Big Display Heading */}
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th" ? (
                <>
                  มิติใหม่ของงานตัดเย็บ
                  <br />
                  ที่ใส่สบายได้ทุกวันทำงาน.
                </>
              ) : (
                <>
                  A New Era
                  <br />
                  of Everyday Tailoring.
                </>
              )}
            </h2>

            {/* Refined Explanatory Paragraph */}
            <p
              className={`text-sm sm:text-base leading-relaxed max-w-lg ${
                isLight ? "text-[#475569]" : "text-[#E7E7E7]"
              }`}
            >
              {lang === "th"
                ? "Highbury พัฒนาแพทเทิร์นเสื้อเชิ้ตสำเร็จรูปสำหรับสรีระคนไทยโดยเฉพาะ คำนวณความกว้างช่วงไหล่ ความลึกของวงแขน และความยาวเสื้อที่สอดเข้ากางเกงได้พอดี ผลิตในเวิร์กช็อปที่มีกำลังผลิต 3,500 ตัวต่อเดือน"
                : "Highbury develops ready-to-wear shirt patterns sculpted specifically for Asian proportions. Calibrated shoulder widths, armhole depths, and tuck-in lengths crafted in our 3,500 pcs/month workshop."}
            </p>

            {/* Quantum Pill Button */}
            <div className="pt-2">
              <Link
                href="#models"
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md group cursor-pointer ${
                  isLight
                    ? "bg-[#0F172A] text-white hover:bg-[#1E293B]"
                    : "bg-black text-white border border-white/20 hover:bg-white/10"
                }`}
              >
                <span>{lang === "th" ? "เลือกดูคอลเลกชันสินค้า" : "Explore Collection"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
