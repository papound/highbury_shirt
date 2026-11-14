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
    <section id="about" className="w-full py-12 sm:py-16 lg:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Architectural Card Container (Quantum Style) */}
        <div
          className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border shadow-2xl transition-all duration-300 ${
            isLight
              ? "bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]/60 border-[#E2E8F0]"
              : "bg-gradient-to-br from-[#13161D] via-[#0E1015] to-[#07080B] border-white/15"
          }`}
        >
          {/* Ambient Glow Accents */}
          <div
            aria-hidden="true"
            className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 ${
              isLight ? "bg-[#2563EB]/10" : "bg-[#FFB900]/10"
            }`}
          />
          <div
            aria-hidden="true"
            className={`absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 ${
              isLight ? "bg-[#38BDF8]/10" : "bg-white/5"
            }`}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Heading, Subtitle & Action Pills */}
            <div className="lg:col-span-7 space-y-6 max-w-xl">
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
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/15 backdrop-blur-md"
                  }`}
                >
                  <Ruler className="w-4 h-4 text-[#FFB900]" />
                  <span>{lang === "th" ? "คำนวณไซส์ Smart Size Finder" : "Smart Size Finder"}</span>
                </button>
              </div>
            </div>

            {/* Right Column: 3 Sleek Frosted Guarantees / Service Badges */}
            <div className="lg:col-span-5 space-y-3.5">
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isLight
                    ? "bg-white/80 border-[#E2E8F0] shadow-xs backdrop-blur-sm"
                    : "bg-white/5 border-white/10 shadow-md backdrop-blur-md"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FFB900]/15 text-[#FFB900] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                      {lang === "th" ? "รับประกันเปลี่ยนไซส์ฟรี 7 วัน" : "7-Day Free Size Exchange"}
                    </div>
                    <div className={`text-xs mt-0.5 leading-relaxed ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                      {lang === "th"
                        ? "ลองใส่แล้วไม่พอดี เปลี่ยนไซส์ใหม่ได้ทันที ไม่มีค่าใช้จ่ายเพิ่มเติม"
                        : "Swap sizes hassle-free if your shirt doesn't fit like a second skin."}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border transition-all ${
                  isLight
                    ? "bg-white/80 border-[#E2E8F0] shadow-xs backdrop-blur-sm"
                    : "bg-white/5 border-white/10 shadow-md backdrop-blur-md"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FFB900]/15 text-[#FFB900] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                      {lang === "th" ? "แพทเทิร์นสรีระคนเอเชีย (Asian Fit)" : "Engineered Asian Fit Silhouette"}
                    </div>
                    <div className={`text-xs mt-0.5 leading-relaxed ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                      {lang === "th"
                        ? "สัดส่วนไหล่และวงแขนพอดี คล่องตัวในทุกการขยับ ไม่ตึงรั้ง"
                        : "Sculpted proportions deliver effortless mobility without uncomfortable pulling."}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border transition-all ${
                  isLight
                    ? "bg-white/80 border-[#E2E8F0] shadow-xs backdrop-blur-sm"
                    : "bg-white/5 border-white/10 shadow-md backdrop-blur-md"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FFB900]/15 text-[#FFB900] flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                      {lang === "th" ? "บริการสั่งผลิตยูนิฟอร์มองค์กร (OEM)" : "Corporate Uniform OEM Service"}
                    </div>
                    <div className={`text-xs mt-0.5 leading-relaxed ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                      {lang === "th"
                        ? "กำลังผลิต 3,500 ตัว/เดือน พร้อมบริการปักโลโก้และเลือกผ้าตาม CI"
                        : "Dedicated 3,500 pcs/month workshop with custom embroidery & fabric CI."}
                    </div>
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
