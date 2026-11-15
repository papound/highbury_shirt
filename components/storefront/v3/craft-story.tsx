"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
          {/* Left Column: Liquid Glass Translucent Card with 3 Craftsmanship Specifications */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-start">
            <div
              className="w-full max-w-md p-6 sm:p-8 rounded-2xl border space-y-6 transition-all duration-300"
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
              {/* Feature 1: Collar */}
              <div>
                <div className={`text-base font-semibold tracking-tight ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}>
                  {lang === "th" ? "โครงสร้างปกอัดกาวสองชั้น" : "Dual-Fused Collar Stance"}
                </div>
                <div className={`text-sm mt-1 leading-relaxed ${
                  isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                }`}>
                  {lang === "th" ? "ปกตั้งทรงคมชัด ไม่ย้วย อยู่ทรงตลอดวันแม้ไม่ผูกเนกไท" : "Two-layer fusing maintains crisp stance throughout the workday without a tie."}
                </div>
              </div>

              {/* Feature 2: Asian Fit Armhole */}
              <div className={`border-t pt-5 ${isLight ? "border-slate-200/80" : "border-white/10"}`}>
                <div className={`text-base font-semibold tracking-tight ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}>
                  {lang === "th" ? "วงแขนคัตติ้งเฉพาะคนไทย" : "Sculpted Asian Fit Armhole"}
                </div>
                <div className={`text-sm mt-1 leading-relaxed ${
                  isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                }`}>
                  {lang === "th" ? "องศาวงแขนเว้าลึกพอดี ลดการรั้งตึงช่วงไหล่ ยกแขนและขยับตัวคล่องตัว" : "Calibrated armhole curvature eliminates shoulder tension during movement."}
                </div>
              </div>

              {/* Feature 3: Easy Care */}
              <div className={`border-t pt-5 ${isLight ? "border-slate-200/80" : "border-white/10"}`}>
                <div className={`text-base font-semibold tracking-tight ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}>
                  {lang === "th" ? "เนื้อผ้า Easy-Care คืนทรงหลังซัก" : "Easy-Care Wrinkle Recovery"}
                </div>
                <div className={`text-sm mt-1 leading-relaxed ${
                  isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                }`}>
                  {lang === "th" ? "สะบัดแขวนหลังซัก คืนทรงไว ประหยัดเวลารีดกว่า 50%" : "Rebounds post-wash to reduce ironing time by half."}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Heading, Subtitle & Action Button (order-1 on mobile, order-2 on lg) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 max-w-xl lg:ml-auto">
            {/* Big Display Heading (No tiny eyebrow clutter) */}
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

            {/* Direct, Concise Explanatory Paragraph (Halved copy, no repetitive fluff) */}
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isLight ? "text-[#475569]" : "text-[#E7E7E7]"
              }`}
            >
              {lang === "th"
                ? "คำนวณสัดส่วนช่วงไหล่ วงแขน และความยาวเสื้อให้พอดีเมื่อสอดเข้ากางเกง ตัดเย็บจากเวิร์กช็อปที่มีกำลังผลิต 3,500 ตัวต่อเดือน"
                : "Engineered shoulder widths, sculpted armholes, and tuck-in lengths crafted in our 3,500 pcs/month workshop."}
            </p>

            {/* Pill Button */}
            <div className="pt-2">
              <Link
                href="#models"
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 group cursor-pointer ${
                  isLight
                    ? "bg-[#0F172A] !text-white hover:bg-[#1E293B]"
                    : "bg-black text-white border border-white/20 hover:bg-white/10"
                }`}
              >
                <span className={isLight ? "!text-white" : ""}>{lang === "th" ? "เลือกดูคอลเลกชันสินค้า" : "Explore Collection"}</span>
                <ArrowRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${isLight ? "!text-white" : ""}`} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
