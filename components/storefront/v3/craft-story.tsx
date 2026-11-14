"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Scissors, ShieldCheck, Sparkles, Shirt } from "lucide-react";
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
    <section id="craftsmanship" className="w-full py-12 sm:py-16 lg:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading, Sourced facts, Real spec list */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category Tracker Tag (Exact Quantum Style) */}
            <div
              className={`text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase ${
                isLight ? "text-[#64748B]" : "text-[#9496A1]"
              }`}
            >
              CRAFTSMANSHIP+
            </div>

            {/* Display Heading */}
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

            <p
              className={`text-sm sm:text-base leading-relaxed max-w-xl ${
                isLight ? "text-[#475569]" : "text-[#E7E7E7]"
              }`}
            >
              {lang === "th"
                ? "Highbury พัฒนาแพทเทิร์นเสื้อเชิ้ตสำเร็จรูปสำหรับสรีระคนไทยโดยเฉพาะ คำนวณความกว้างช่วงไหล่ ความลึกของวงแขน และความยาวเสื้อที่สอดเข้ากางเกงได้พอดี ผลิตในเวิร์กช็อปที่มีกำลังผลิต 3,500 ตัวต่อเดือน"
                : "Highbury develops ready-to-wear shirt patterns sculpted specifically for the Asian torso. Calibrated shoulder widths, armhole depths, and tuck-in lengths crafted in our 3,500 pcs/month workshop."}
            </p>

            {/* 3 Real Concrete Engineering Breakdown Cards */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isLight
                    ? "bg-[#F8FAFC] border-[#E2E8F0] shadow-xs"
                    : "bg-[#13161D] border-[#262830] shadow-md"
                }`}
              >
                <div className="text-[11px] font-semibold text-[#FFB900] uppercase tracking-wider">
                  {lang === "th" ? "01 โครงสร้างปก" : "01 COLLAR"}
                </div>
                <div className={`text-sm font-semibold mt-1 ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                  {lang === "th" ? "เสริมทรงพิเศษ" : "Reinforced Posture"}
                </div>
                <div className={`text-xs mt-0.5 ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                  {lang === "th" ? "ปกตั้งสวย ไม่แบะย้วย" : "Retains crisp shape"}
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border transition-all ${
                  isLight
                    ? "bg-[#F8FAFC] border-[#E2E8F0] shadow-xs"
                    : "bg-[#13161D] border-[#262830] shadow-md"
                }`}
              >
                <div className="text-[11px] font-semibold text-[#FFB900] uppercase tracking-wider">
                  {lang === "th" ? "02 แพทเทิร์น" : "02 ASIAN FIT"}
                </div>
                <div className={`text-sm font-semibold mt-1 ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                  {lang === "th" ? "สัดส่วนคนไทย" : "Calibrated Fit"}
                </div>
                <div className={`text-xs mt-0.5 ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                  {lang === "th" ? "วงแขนกระชับ ไม่รั้งตัว" : "Zero shoulder pull"}
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border transition-all ${
                  isLight
                    ? "bg-[#F8FAFC] border-[#E2E8F0] shadow-xs"
                    : "bg-[#13161D] border-[#262830] shadow-md"
                }`}
              >
                <div className="text-[11px] font-semibold text-[#FFB900] uppercase tracking-wider">
                  {lang === "th" ? "03 การรีด" : "03 EASY CARE"}
                </div>
                <div className={`text-sm font-semibold mt-1 ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                  {lang === "th" ? "คืนทรงหลังซัก" : "Wrinkle Recovery"}
                </div>
                <div className={`text-xs mt-0.5 ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                  {lang === "th" ? "ประหยัดเวลารีด 50%" : "50% less ironing time"}
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
                <span>{lang === "th" ? "เลือกดูคอลเลกชันสินค้า" : "Explore Collection"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Local Highbury Photo with Floating Frosted Glass Badge */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              className={`relative w-full max-w-[480px] aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl transition-all ${
                isLight ? "border-[#E2E8F0] bg-[#F8FAFC]" : "border-white/15 bg-[#13161D]"
              }`}
            >
              <Image
                src="/images/craft-story.jpg"
                alt="Highbury Asian Fit Tailoring Craftsmanship"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
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
                  <Scissors className="w-4 h-4 text-[#FFB900]" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#FFB900] uppercase tracking-wider">
                    {lang === "th" ? "เวิร์กช็อปมาตรฐานสูง" : "Workshop Standard"}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-white mt-0.5">
                    {lang === "th" ? "3,500 ตัว / เดือน ผลิตในไทย 100%" : "3,500 Pcs/Mo Tailored in Thailand"}
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
