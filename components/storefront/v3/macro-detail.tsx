"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Check, CheckCircle2 } from "lucide-react";
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
    <section className="w-full py-12 sm:py-16 lg:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading, Concrete facts */}
          <div className="lg:col-span-6 space-y-6">
            {/* Category Tracker Tag (Exact Quantum Style) */}
            <div
              className={`text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase ${
                isLight ? "text-[#64748B]" : "text-[#9496A1]"
              }`}
            >
              PRECISION+
            </div>

            {/* Display Heading */}
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

            <p
              className={`text-sm sm:text-base leading-relaxed max-w-lg ${
                isLight ? "text-[#475569]" : "text-[#E7E7E7]"
              }`}
            >
              {lang === "th"
                ? "โครงสร้างปกเสื้อออกแบบเป็นพิเศษเพื่อให้ตั้งอยู่ทรงสวยงาม ซักสะบัดแขวนแทบไม่ต้องรีด พร้อมการเย็บย้ำกระดุมแน่นหนาเพื่อความทนทานในการใช้งานทุกวัน"
                : "Engineered collar construction that retains its sharp posture wash after wash, paired with reinforced button fastening for everyday durability."}
            </p>

            {/* 3 Detail Feature Callouts */}
            <div className="space-y-3 pt-2">
              <div
                className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
                  isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#13161D] border-[#262830]"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#FFB900]/15 text-[#FFB900] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                    {lang === "th" ? "ฝีเข็มละเอียด 16-18 เข็ม/นิ้ว" : "High Stitch Density (16-18 SPI)"}
                  </div>
                  <div className={`text-xs mt-0.5 ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                    {lang === "th" ? "ตะเข็บแน่น เรียบเนียน ไม่ระคายเคืองผิว" : "Ultra-fine stitch count delivers sleek drape"}
                  </div>
                </div>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
                  isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#13161D] border-[#262830]"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#FFB900]/15 text-[#FFB900] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                    {lang === "th" ? "ปกเสริมผ้าเคมีอัดกาวสองชั้น" : "Dual-Fused Reinforced Collar"}
                  </div>
                  <div className={`text-xs mt-0.5 ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                    {lang === "th" ? "ปกตั้งสวย ไม่แบะย้วย แม้ไม่ผูกเนกไท" : "Preserves crisp collar stance wash after wash"}
                  </div>
                </div>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
                  isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#13161D] border-[#262830]"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#FFB900]/15 text-[#FFB900] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                    {lang === "th" ? "กระดุมเย็บย้ำ 4 รู แน่นหนา" : "Reinforced 4-Hole Button Stitches"}
                  </div>
                  <div className={`text-xs mt-0.5 ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                    {lang === "th" ? "ทนแรงดึงสูง ไม่หลุดง่ายขณะใช้งาน" : "High tensile strength retention for daily use"}
                  </div>
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
                    : "bg-white text-[#07080B] hover:bg-white/90"
                }`}
              >
                <span>{lang === "th" ? "ดูแบบเสื้อทั้งหมด" : "View All Shirts"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Local Highbury Photo with Floating Frosted Glass Badge */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div
              className={`relative w-full max-w-[500px] aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl transition-all ${
                isLight ? "border-[#E2E8F0] bg-[#F8FAFC]" : "border-white/15 bg-[#13161D]"
              }`}
            >
              <Image
                src="/images/macro-detail.jpg"
                alt="Highbury Asian Fit Tailoring Details"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover object-center"
              />

              {/* Floating Frosted Glass Badge over Photo (Matches Standards Section) */}
              <div
                className="absolute bottom-5 left-5 right-5 sm:left-5 sm:right-auto p-3.5 sm:p-4 rounded-xl shadow-2xl flex items-center gap-3.5"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.55)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  color: "#FFFFFF",
                }}
              >
                <div className="w-9 h-9 rounded-lg bg-[#FFB900]/20 border border-[#FFB900]/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#FFB900]" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#FFB900] uppercase tracking-wider">
                    {lang === "th" ? "โครงสร้างเนื้อผ้าและการทอ" : "Macro Fabric Architecture"}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-white mt-0.5">
                    {lang === "th" ? "เส้นใยและรอยเย็บที่ผ่านการควบคุมคุณภาพ 100%" : "Every weave & seam inspected before dispatch"}
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
