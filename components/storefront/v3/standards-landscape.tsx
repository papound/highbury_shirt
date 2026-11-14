"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Factory, CheckCircle2 } from "lucide-react";
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
            {/* Reference-style Category Tracker (e.g. STANDARDS+) */}
            <div
              className={`text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase ${
                isLight ? "text-[#64748B]" : "text-[#9496A1]"
              }`}
            >
              STANDARDS+
            </div>

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
                ? "เรามุ่งมั่นขจัดปัญหาเสื้อไม่พอดีตัว เสื้อเชิ้ตทุกตัวผ่านการตรวจเช็กก่อนบรรจุ พร้อมการรับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน และเวิร์กช็อปของเราพร้อมรองรับการสั่งตัดยูนิฟอร์มองค์กรด้วยมาตรฐานขั้นสูง"
                : "We eliminate ill-fitting workwear with dedicated quality controls. Backed by our 7-day hassle-free size exchange guarantee and dedicated 3,500 pcs/month OEM tailoring capacity."}
            </p>

            {/* Quantum Pill Button (Exact Reference Styling) */}
            <div className="pt-2">
              <Link
                href="https://lin.ee/T8tlget"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md group cursor-pointer ${
                  isLight
                    ? "bg-[#0F172A] text-white hover:bg-[#1E293B]"
                    : "bg-black text-white border border-white/20 hover:bg-white/10"
                }`}
              >
                <span>{lang === "th" ? "ปรึกษาสั่งตัดยูนิฟอร์มผ่าน LINE" : "Consult Corporate Tailoring via LINE"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Frosted Glass Card with 3 Metrics */}
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
              {/* Stat 1: 0 Risk */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    0
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                    {lang === "th" ? "ความเสี่ยงเรื่องไซส์ (เปลี่ยนฟรีใน 7 วัน)" : "Sizing Risk (7-Day Free Exchange)"}
                  </div>
                </div>
              </div>

              {/* Stat 2: 3,500 Pcs/Month */}
              <div className="flex items-start gap-4 border-t border-white/15 pt-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                  <Factory className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    3,500
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                    {lang === "th" ? "ตัว / เดือน กำลังผลิตเวิร์กช็อป" : "Pcs / Month Workshop Capacity"}
                  </div>
                </div>
              </div>

              {/* Stat 3: 100% Quality Inspected */}
              <div className="flex items-start gap-4 border-t border-white/15 pt-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    100%
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">
                    {lang === "th" ? "QC ตรวจสอบทุกตัวก่อนจัดส่ง" : "QC Inspection Before Delivery"}
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
