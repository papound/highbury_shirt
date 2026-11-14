"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useStorefrontV3Safe } from "../storefront-shell";

interface MacroDetailProps {
  lang?: "th" | "en";
}

export default function MacroDetail({ lang: propLang }: MacroDetailProps) {
  const v3 = useStorefrontV3Safe();
  const theme = v3?.theme || "dark";
  const lang = propLang || v3?.lang || "th";
  const isLight = theme === "light";

  return (
    <section id="details" className="relative w-full min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden scroll-mt-20">
      {/* Background Image: Macro Detail Photoshoot (Edge-to-Edge, No Outer Border) */}
      <Image
        src="/images/macro-detail.jpg"
        alt="Highbury Asian Fit Tailoring Details"
        fill
        sizes="100vw"
        className="object-cover object-[75%_center] lg:object-center"
      />

      {/* Smooth Gradient Fade Layer (Matches Reference Left-to-Right Dissolve) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-r from-white via-white/95 via-45% to-transparent max-lg:bg-gradient-to-t max-lg:from-white/95 max-lg:via-white/80 max-lg:to-transparent"
            : "bg-gradient-to-r from-[#07080B] via-[#07080B]/95 via-45% to-transparent max-lg:bg-gradient-to-t max-lg:from-[#07080B]/95 max-lg:via-[#07080B]/80 max-lg:to-transparent"
        }`}
      />

      {/* Content Container aligned with site grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtitle & Action Button (Exact Reference Replica) */}
          <div className="lg:col-span-7 space-y-6 max-w-xl">
            {/* Reference-style Category Tracker (e.g. PRECISION+) */}
            <div
              className={`text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase ${
                isLight ? "text-[#64748B]" : "text-[#9496A1]"
              }`}
            >
              PRECISION+
            </div>

            {/* Big Display Heading */}
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th" ? (
                <>
                  ความประณีต
                  <br />
                  ในทุกรายละเอียดโครงสร้าง.
                </>
              ) : (
                <>
                  Precision
                  <br />
                  in Every Detail.
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
                ? "โครงสร้างปกเสื้อออกแบบเป็นพิเศษเพื่อให้ตั้งอยู่ทรงสวยงาม ซักสะบัดแขวนแทบไม่ต้องรีด พร้อมการเย็บย้ำกระดุมแน่นหนาเพื่อความทนทานในการใช้งานทุกวัน"
                : "Engineered collar construction that retains its sharp posture wash after wash, paired with reinforced 4-hole button fastening for everyday durability."}
            </p>

            {/* Quantum Pill Button (Exact Reference Styling) */}
            <div className="pt-2">
              <Link
                href="#models"
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md group cursor-pointer ${
                  isLight
                    ? "bg-[#0F172A] text-white hover:bg-[#1E293B]"
                    : "bg-black text-white border border-white/20 hover:bg-white/10"
                }`}
              >
                <span>{lang === "th" ? "ดูแบบเสื้อทั้งหมด" : "View All Shirts"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Frosted Glass Card with 3 Specs */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
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
              {/* Stat 1: SPI */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    16–18
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                    {lang === "th" ? "ฝีเข็มละเอียดพิเศษ (SPI Density)" : "Stitches Per Inch (SPI Density)"}
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/60 mt-0.5">
                    {lang === "th" ? "ตะเข็บแน่น เรียบเนียน ไม่ระคายเคืองผิว" : "High stitch density delivers clean drape and strength"}
                  </div>
                </div>
              </div>

              {/* Stat 2: 2-Layer Fused */}
              <div className="flex items-start gap-4 border-t border-white/15 pt-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    2-Layer
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                    {lang === "th" ? "โครงสร้างปกเสริมความคมชัด" : "Reinforced Double Fusing"}
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/60 mt-0.5">
                    {lang === "th" ? "ปกตั้งสวย ไม่แบะย้วย ทนทานต่อการซัก" : "Preserves crisp collar stance wash after wash"}
                  </div>
                </div>
              </div>

              {/* Stat 3: 4-Hole Buttons */}
              <div className="flex items-start gap-4 border-t border-white/15 pt-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    4-Hole
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                    {lang === "th" ? "กระดุมเย็บย้ำ 4 รู แน่นหนา" : "Reinforced 4-Hole Fastening"}
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/60 mt-0.5">
                    {lang === "th" ? "ทนแรงดึงสูง ไม่หลุดง่ายขณะใช้งาน" : "High tensile strength retention for daily use"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
