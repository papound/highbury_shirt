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
    <section id="standards" className="w-full py-12 sm:py-16 lg:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Landscape Panoramic Card with Coastal Highway Backdrop */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden min-h-[560px] lg:min-h-[620px] border border-white/15 shadow-2xl flex items-center">
          {/* Background Image: Highbury Coastal Road Photoshoot */}
          <Image
            src="/images/standards-landscape.jpg"
            alt="Highbury Standards Coastal Highway Tailoring"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-[70%_center] lg:object-center"
            priority
          />

          {/* Smooth Gradient Fade Layer (Matches Reference Left-to-Right Dissolve) */}
          <div
            className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
              isLight
                ? "bg-gradient-to-r from-white via-white/95 via-40% to-transparent max-lg:bg-gradient-to-t max-lg:from-white/95 max-lg:via-white/80 max-lg:to-transparent"
                : "bg-gradient-to-r from-[#07080B] via-[#07080B]/95 via-40% to-transparent max-lg:bg-gradient-to-t max-lg:from-[#07080B]/95 max-lg:via-[#07080B]/80 max-lg:to-transparent"
            }`}
          />

          {/* Content Layer */}
          <div className="relative z-10 w-full p-6 sm:p-10 lg:p-16">
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
                      มาตรฐานคุณภาพตรวจสอบได้.
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
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-[#07080B] text-white hover:bg-[#1E293B] shadow-lg transition-all duration-200 border border-white/10 group cursor-pointer"
                  >
                    <span>{lang === "th" ? "ปรึกษาสั่งตัดยูนิฟอร์มผ่าน LINE" : "Corporate Uniform Inquiry (LINE)"}</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Floating Frosted Glass Card (Exact Reference Replica) */}
              <div className="lg:col-span-5 flex justify-start lg:justify-end">
                <div
                  className="w-full max-w-[340px] sm:max-w-[370px] rounded-2xl p-6 sm:p-8 shadow-2xl transition-all"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.52)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderColor: "rgba(255, 255, 255, 0.18)",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    color: "#FFFFFF",
                  }}
                >
                  <div className="space-y-6 sm:space-y-8">
                    {/* Stat Item 1: 0 Tailpipe / Zero Size Risk */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1 shrink-0" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                        <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <div>
                        <div
                          className="text-3xl sm:text-4xl font-light tracking-tight leading-none"
                          style={{ color: "#FFFFFF" }}
                        >
                          0
                        </div>
                        <div
                          className="text-xs text-white/80 mt-1.5 font-normal leading-snug"
                          style={{ color: "rgba(255, 255, 255, 0.82)" }}
                        >
                          {lang === "th"
                            ? "ความเสี่ยงเรื่องไซส์ (เปลี่ยนฟรีใน 7 วัน)"
                            : "Zero Size Risk (7-Day Free Exchange)"}
                        </div>
                      </div>
                    </div>

                    {/* Stat Item 2: 3,500 Pcs/Month */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1 shrink-0" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                        <Factory className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <div>
                        <div
                          className="text-3xl sm:text-4xl font-light tracking-tight leading-none"
                          style={{ color: "#FFFFFF" }}
                        >
                          3,500
                        </div>
                        <div
                          className="text-xs text-white/80 mt-1.5 font-normal leading-snug"
                          style={{ color: "rgba(255, 255, 255, 0.82)" }}
                        >
                          {lang === "th"
                            ? "ตัว / เดือน กำลังผลิตเวิร์กช็อป"
                            : "Pcs / Month Workshop Capacity"}
                        </div>
                      </div>
                    </div>

                    {/* Stat Item 3: 100% Pre-dispatch QC */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1 shrink-0" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                        <CheckCircle2 className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <div>
                        <div
                          className="text-3xl sm:text-4xl font-light tracking-tight leading-none"
                          style={{ color: "#FFFFFF" }}
                        >
                          100%
                        </div>
                        <div
                          className="text-xs text-white/80 mt-1.5 font-normal leading-snug"
                          style={{ color: "rgba(255, 255, 255, 0.82)" }}
                        >
                          {lang === "th"
                            ? "QC ตรวจสอบทุกตัวก่อนจัดส่ง"
                            : "Pre-dispatch Garment Inspection"}
                        </div>
                      </div>
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
