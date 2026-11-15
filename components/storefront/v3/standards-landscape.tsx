"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStorefrontV3Safe } from "../storefront-shell";

interface StandardsLandscapeProps {
  lang?: "th" | "en";
}

export default function StandardsLandscape({ lang: propLang }: StandardsLandscapeProps) {
  const v3 = useStorefrontV3Safe();
  const theme = v3?.theme || "dark";
  const lang = propLang || v3?.lang || "th";
  const isLight = theme === "light";

  return (
    <section id="standards" className="relative w-full min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden scroll-mt-20">
      {/* Background Image: Highbury Coastal Road Photoshoot (Edge-to-Edge, No Outer Border) */}
      <Image
        src="/images/standards-landscape.jpg"
        alt="Highbury Standards Coastal Highway Tailoring"
        fill
        sizes="100vw"
        className="object-cover object-[70%_35%] lg:object-[center_35%]"
        priority
      />

      {/* Top Edge Blend (Seamless Transition from Macro Detail) */}
      <div
        className={`absolute inset-x-0 top-0 h-14 sm:h-16 lg:h-20 pointer-events-none z-1 transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-b from-white/25 via-white/8 to-transparent"
            : "bg-gradient-to-b from-[#07080B]/25 via-[#07080B]/8 to-transparent"
        }`}
      />

      {/* Bottom Edge Blend (Seamless Transition into Pre-Footer) */}
      <div
        className={`absolute inset-x-0 bottom-0 h-14 sm:h-16 lg:h-20 pointer-events-none z-1 transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-t from-white/25 via-white/8 to-transparent"
            : "bg-gradient-to-t from-[#07080B]/25 via-[#07080B]/8 to-transparent"
        }`}
      />

      {/* Smooth Gradient Fade Layer (Softer, Airier Dissolve so Road and Models are Fully Bright & Vibrant) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 max-lg:hidden z-1"
        style={{
          background: isLight
            ? "linear-gradient(to right, #FFFFFF 0%, rgba(255, 255, 255, 0.96) 20%, rgba(255, 255, 255, 0.72) 30%, rgba(255, 255, 255, 0.15) 42%, transparent 52%)"
            : "linear-gradient(to right, #07080B 0%, rgba(7, 8, 11, 0.94) 20%, rgba(7, 8, 11, 0.65) 30%, rgba(7, 8, 11, 0.12) 42%, transparent 52%)",
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtitle & Action Button */}
          <div className="lg:col-span-7 space-y-6 max-w-xl">
            {/* Big Display Heading */}
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th" ? (
                <>
                  ขับเคลื่อนด้วย
                  <br />
                  มาตรฐานคุณภาพตรวจสอบ
                  <br className="hidden sm:inline" />
                  ได้.
                </>
              ) : (
                <>
                  Driven by
                  <br />
                  Verifiable Standards.
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
                ? "เสื้อเชิ้ตทุกตัวผ่านการตรวจเช็กฝีเข็มก่อนบรรจุ พร้อมการรับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน และเวิร์กช็อปรองรับการสั่งตัดยูนิฟอร์มองค์กรตามมาตรฐาน"
                : "Every shirt undergoes needle-to-seam inspection before packing, backed by a 7-day size exchange guarantee and dedicated OEM workshop capacity."}
            </p>

            {/* Action Button */}
            <div className="pt-2">
              <Link
                href="https://lin.ee/T8tlget"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 group cursor-pointer border ${
                  isLight
                    ? "bg-[#0F172A] !text-white border-[#0F172A] hover:bg-[#1E293B]"
                    : "bg-white text-[#0B0C0E] border-white hover:bg-white/90"
                }`}
              >
                <span className={isLight ? "!text-white" : ""}>{lang === "th" ? "ปรึกษาสั่งตัดยูนิฟอร์มผ่าน LINE" : "Consult Corporate Tailoring via LINE"}</span>
                <ArrowRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${isLight ? "!text-white" : ""}`} />
              </Link>
            </div>
          </div>

          {/* Right Column: Solid Card with Grounded Metrics */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              className={`w-full max-w-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-300 ${
                isLight
                  ? "bg-white border-[#E2E8F0] shadow-sm"
                  : "bg-[#0E1015] border-[#262830]"
              }`}
            >
              {/* Stat 1: 7-Day Free Exchange */}
              <div>
                <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}>
                  {lang === "th" ? "7 วัน" : "7 Days"}
                </div>
                <div className={`text-xs sm:text-sm font-medium mt-1 ${
                  isLight ? "text-[#0F172A]" : "text-white/90"
                }`}>
                  {lang === "th" ? "รับประกันเปลี่ยนไซส์ฟรี" : "Free Size Exchange Guarantee"}
                </div>
                <div className={`text-xs mt-0.5 ${
                  isLight ? "text-[#64748B]" : "text-[#9496A1]"
                }`}>
                  {lang === "th" ? "นับจากวันรับพัสดุ หากลองแล้วไม่พอดีเปลี่ยนฟรีทันที" : "From parcel delivery date; instant free exchange if fit is off."}
                </div>
              </div>

              {/* Stat 2: 3,500 Pcs/Month */}
              <div className={`border-t pt-5 mt-5 ${
                isLight ? "border-[#E2E8F0]" : "border-[#262830]"
              }`}>
                <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}>
                  {lang === "th" ? "3,500 ตัว / เดือน" : "3,500 Pcs / Month"}
                </div>
                <div className={`text-xs sm:text-sm font-medium mt-1 ${
                  isLight ? "text-[#0F172A]" : "text-white/90"
                }`}>
                  {lang === "th" ? "กำลังผลิตเวิร์กช็อป Highbury" : "Highbury Workshop Capacity"}
                </div>
                <div className={`text-xs mt-0.5 ${
                  isLight ? "text-[#64748B]" : "text-[#9496A1]"
                }`}>
                  {lang === "th" ? "สายการผลิตพร้อมรองรับยูนิฟอร์มองค์กรและงานปักโลโก้" : "Dedicated production line for corporate orders & logo embroidery."}
                </div>
              </div>

              {/* Stat 3: 100% Quality Inspected */}
              <div className={`border-t pt-5 mt-5 ${
                isLight ? "border-[#E2E8F0]" : "border-[#262830]"
              }`}>
                <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}>
                  100%
                </div>
                <div className={`text-xs sm:text-sm font-medium mt-1 ${
                  isLight ? "text-[#0F172A]" : "text-white/90"
                }`}>
                  {lang === "th" ? "QC ตรวจสอบรายตัวก่อนจัดส่ง" : "Piece-by-Piece QC Inspection"}
                </div>
                <div className={`text-xs mt-0.5 ${
                  isLight ? "text-[#64748B]" : "text-[#9496A1]"
                }`}>
                  {lang === "th" ? "ตรวจเช็กฝีเข็ม ตะเข็บกระดุม และการรีดก่อนส่งถึงมือคุณ" : "Individual check on stitch density, buttons, and iron finish."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
