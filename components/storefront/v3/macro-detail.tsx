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
    <section id="details" className="relative w-full min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden scroll-mt-20">
      {/* Background Image: Both Woman and Man clearly visible on right side */}
      <Image
        src="/images/macro-detail.jpg"
        alt="Highbury Asian Fit Tailoring Details"
        fill
        sizes="100vw"
        className="object-cover object-[92%_top] sm:object-[90%_top] lg:object-[88%_top]"
      />

      {/* Smooth Gradient Fade Layer (Tighter to left edge so Woman and Man are fully illuminated) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-r from-white via-white/90 via-35% to-transparent max-lg:bg-gradient-to-t max-lg:from-white/95 max-lg:via-white/80 max-lg:to-transparent"
            : "bg-gradient-to-r from-[#07080B] via-[#07080B]/90 via-35% to-transparent max-lg:bg-gradient-to-t max-lg:from-[#07080B]/95 max-lg:via-[#07080B]/80 max-lg:to-transparent"
        }`}
      />

      {/* Content Container aligned with site grid (Constrained so right models are unobstructed) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="max-w-lg lg:max-w-[480px] space-y-6">
          {/* Reference-style Category Tracker */}
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
            className={`text-sm sm:text-base leading-relaxed ${
              isLight ? "text-[#475569]" : "text-[#E7E7E7]"
            }`}
          >
            {lang === "th"
              ? "โครงสร้างปกเสื้อออกแบบเป็นพิเศษเพื่อให้ตั้งอยู่ทรงสวยงาม ซักสะบัดแขวนแทบไม่ต้องรีด พร้อมการเย็บย้ำกระดุมแน่นหนาเพื่อความทนทานในการใช้งานทุกวัน"
              : "Engineered collar construction that retains its sharp posture wash after wash, paired with reinforced 4-hole button fastening for everyday durability."}
          </p>

          {/* 3 Sleek Integrated Frosted Spec Cards (Compact layout to keep both models visible) */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div
              className="p-3 sm:p-3.5 rounded-xl shadow-lg transition-all"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderColor: "rgba(255, 255, 255, 0.18)",
                borderWidth: "1px",
                borderStyle: "solid",
                color: "#FFFFFF",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB900]" />
                <div className="text-base sm:text-lg font-bold tracking-tight text-white">
                  16–18
                </div>
              </div>
              <div className="text-[11px] font-semibold text-white/90">
                {lang === "th" ? "ฝีเข็มละเอียด" : "SPI Count"}
              </div>
              <div className="text-[10px] text-white/60 mt-0.5 leading-snug line-clamp-1">
                {lang === "th" ? "ตะเข็บแน่น เรียบเนียน" : "Clean drape"}
              </div>
            </div>

            <div
              className="p-3 sm:p-3.5 rounded-xl shadow-lg transition-all"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderColor: "rgba(255, 255, 255, 0.18)",
                borderWidth: "1px",
                borderStyle: "solid",
                color: "#FFFFFF",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFB900]" />
                <div className="text-base sm:text-lg font-bold tracking-tight text-white">
                  2-Layer
                </div>
              </div>
              <div className="text-[11px] font-semibold text-white/90">
                {lang === "th" ? "ปกอัดกาวคู่" : "Dual Fused"}
              </div>
              <div className="text-[10px] text-white/60 mt-0.5 leading-snug line-clamp-1">
                {lang === "th" ? "ปกตั้งสวย ไม่ย้วย" : "Crisp stance"}
              </div>
            </div>

            <div
              className="p-3 sm:p-3.5 rounded-xl shadow-lg transition-all"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderColor: "rgba(255, 255, 255, 0.18)",
                borderWidth: "1px",
                borderStyle: "solid",
                color: "#FFFFFF",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB900]" />
                <div className="text-base sm:text-lg font-bold tracking-tight text-white">
                  4-Hole
                </div>
              </div>
              <div className="text-[11px] font-semibold text-white/90">
                {lang === "th" ? "กระดุม 4 รู" : "Reinforced"}
              </div>
              <div className="text-[10px] text-white/60 mt-0.5 leading-snug line-clamp-1">
                {lang === "th" ? "เย็บย้ำแน่นหนา" : "High strength"}
              </div>
            </div>
          </div>

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
              <span>{lang === "th" ? "ดูแบบเสื้อทั้งหมด" : "View All Shirts"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
