"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <section id="details" className={`relative w-full min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden scroll-mt-20 transition-colors duration-300 ${
      isLight ? "bg-white" : "bg-[#07080B]"
    }`}>
      {/* Background Image: Shifted to right with soft feather mask on left edge */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[78%] xl:w-[74%] pointer-events-none z-0 v3-macro-image-mask">
        <Image
          src="/images/macro-detail.jpg"
          alt="Highbury Asian Fit Tailoring Details"
          fill
          sizes="100vw"
          className="object-cover object-[75%_top] lg:object-[80%_top]"
          priority
        />
      </div>

      {/* Top Edge Blend (Seamless Transition from Previous Section) */}
      <div
        className={`absolute inset-x-0 top-0 h-14 sm:h-16 lg:h-20 pointer-events-none z-1 transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-b from-white/25 via-white/8 to-transparent"
            : "bg-gradient-to-b from-[#07080B]/25 via-[#07080B]/8 to-transparent"
        }`}
      />

      {/* Bottom Edge Blend (Seamless Transition into Next Section) */}
      <div
        className={`absolute inset-x-0 bottom-0 h-14 sm:h-16 lg:h-20 pointer-events-none z-1 transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-t from-white/25 via-white/8 to-transparent"
            : "bg-gradient-to-t from-[#07080B]/25 via-[#07080B]/8 to-transparent"
        }`}
      />

      {/* Smooth Gradient Fade Layer (Seamless dissolve from solid background into studio ambient) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 max-lg:hidden z-1"
        style={{
          background: isLight
            ? "linear-gradient(to right, #FFFFFF 0%, #FFFFFF 22%, rgba(255, 255, 255, 0.98) 32%, rgba(255, 255, 255, 0.8) 44%, rgba(255, 255, 255, 0.3) 58%, transparent 72%)"
            : "linear-gradient(to right, #07080B 0%, #07080B 22%, rgba(7, 8, 11, 0.98) 32%, rgba(7, 8, 11, 0.8) 44%, rgba(7, 8, 11, 0.3) 58%, transparent 72%)",
        }}
      />
      {/* Mobile Fade Layer */}
      <div
        className={`lg:hidden absolute inset-0 pointer-events-none transition-colors duration-300 z-1 ${
          isLight
            ? "bg-gradient-to-t from-white via-white/90 via-45% to-transparent"
            : "bg-gradient-to-t from-[#07080B] via-[#07080B]/90 via-45% to-transparent"
        }`}
      />

      {/* Content Container aligned with site grid (Compact width so right models are unobstructed) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="max-w-md lg:max-w-[420px] space-y-5">
          {/* Big Display Heading (No tiny eyebrow clutter) */}
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

          {/* Direct, Concise Explanatory Paragraph (Halved copy, factual) */}
          <p
            className={`text-sm sm:text-base leading-relaxed ${
              isLight ? "text-[#475569]" : "text-[#E7E7E7]"
            }`}
          >
            {lang === "th"
              ? "ปกอัดกาวสองชั้นตั้งทรงคมชัด ฝีเข็ม 16–18 เข็มต่อนิ้ว และกระดุม 4 รูเย็บย้ำแน่นหนาเพื่อความทนทาน"
              : "Dual-fused collar stance, 16–18 SPI dense stitching, and cross-stitched 4-hole buttons for lasting durability."}
          </p>

          {/* 3 Sleek Liquid Glass Spec Cards */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div
              className="p-3 sm:p-3.5 rounded-xl border transition-all duration-300"
              style={{
                backgroundColor: isLight ? "rgba(255, 255, 255, 0.76)" : "rgba(10, 12, 16, 0.70)",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                borderColor: isLight ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.12)",
                boxShadow: isLight
                  ? "inset 0 1px 1px 0 rgba(255, 255, 255, 0.95), 0 8px 20px -6px rgba(0, 0, 0, 0.04)"
                  : "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), 0 10px 25px -8px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div className={`text-base sm:text-lg font-bold tracking-tight ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                16–18
              </div>
              <div className={`text-[11px] font-semibold mt-1 ${isLight ? "text-[#334155]" : "text-white/90"}`}>
                {lang === "th" ? "ฝีเข็มต่อนิ้ว (SPI)" : "SPI Density"}
              </div>
              <div className={`text-[10px] mt-0.5 leading-snug line-clamp-1 ${isLight ? "text-[#475569]" : "text-[#D1D5DB]"}`}>
                {lang === "th" ? "ตะเข็บแน่น เรียบเนียน" : "Clean drape"}
              </div>
            </div>

            <div
              className="p-3 sm:p-3.5 rounded-xl border transition-all duration-300"
              style={{
                backgroundColor: isLight ? "rgba(255, 255, 255, 0.76)" : "rgba(10, 12, 16, 0.70)",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                borderColor: isLight ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.12)",
                boxShadow: isLight
                  ? "inset 0 1px 1px 0 rgba(255, 255, 255, 0.95), 0 8px 20px -6px rgba(0, 0, 0, 0.04)"
                  : "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), 0 10px 25px -8px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div className={`text-base sm:text-lg font-bold tracking-tight ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                2-Layer
              </div>
              <div className={`text-[11px] font-semibold mt-1 ${isLight ? "text-[#334155]" : "text-white/90"}`}>
                {lang === "th" ? "ปกอัดกาวคู่" : "Dual Fused"}
              </div>
              <div className={`text-[10px] mt-0.5 leading-snug line-clamp-1 ${isLight ? "text-[#475569]" : "text-[#D1D5DB]"}`}>
                {lang === "th" ? "ปกตั้งทรง ไม่ย้วย" : "Crisp stance"}
              </div>
            </div>

            <div
              className="p-3 sm:p-3.5 rounded-xl border transition-all duration-300"
              style={{
                backgroundColor: isLight ? "rgba(255, 255, 255, 0.76)" : "rgba(10, 12, 16, 0.70)",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                borderColor: isLight ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.12)",
                boxShadow: isLight
                  ? "inset 0 1px 1px 0 rgba(255, 255, 255, 0.95), 0 8px 20px -6px rgba(0, 0, 0, 0.04)"
                  : "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), 0 10px 25px -8px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div className={`text-base sm:text-lg font-bold tracking-tight ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                4-Hole
              </div>
              <div className={`text-[11px] font-semibold mt-1 ${isLight ? "text-[#334155]" : "text-white/90"}`}>
                {lang === "th" ? "กระดุม 4 รู" : "Cross-Stitched"}
              </div>
              <div className={`text-[10px] mt-0.5 leading-snug line-clamp-1 ${isLight ? "text-[#475569]" : "text-[#D1D5DB]"}`}>
                {lang === "th" ? "เย็บย้ำแน่นหนา" : "High strength"}
              </div>
            </div>
          </div>

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
              <span className={isLight ? "!text-white" : ""}>{lang === "th" ? "ดูแบบเสื้อทั้งหมด" : "View All Shirts"}</span>
              <ArrowRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${isLight ? "!text-white" : ""}`} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
