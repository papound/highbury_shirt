"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Factory, CheckCircle2 } from "lucide-react";

interface StandardsLandscapeProps {
  lang?: "th" | "en";
}

export default function StandardsLandscape({ lang = "th" }: StandardsLandscapeProps) {
  return (
    <section id="standards" className="relative w-full py-28 sm:py-36 bg-[#0E1015] text-white overflow-hidden border-b border-white/10">
      {/* Background cinematic landscape atmosphere matching Quantum coastal highway scene */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(46, 144, 250, 0.3) 0%, transparent 60%), radial-gradient(circle at 80% 30%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column (Quantum Style: Tag, Headline, Paragraph, Button) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold tracking-[0.25em] text-emerald-400 uppercase">
              STANDARDS & OEM · มาตรฐานการผลิต
            </div>

            <h2 className="text-4xl sm:text-5xl font-medium tracking-[-0.03em] text-white leading-[1.1]">
              {lang === "th" ? (
                <>
                  ขับเคลื่อนด้วย
                  <br />
                  มาตรฐานคุณภาพไร้ที่ติ
                </>
              ) : (
                <>
                  Driven by
                  <br />
                  a Higher Standard
                </>
              )}
            </h2>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl">
              {lang === "th"
                ? "เรามุ่งมั่นขจัดปัญหาเสื้อไม่พอดีตัว เสื้อเชิ้ตทุกตัวผ่านการตรวจเช็กก่อนบรรจุ พร้อมการรับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน และเวิร์กช็อปของเราพร้อมรองรับการสั่งตัดยูนิฟอร์มองค์กรด้วยมาตรฐานขั้นสูง"
                : "We are committed to eliminating ill-fitting workwear and elevating professional confidence. Backed by our 7-day hassle-free size exchange guarantee and dedicated 3,500 pcs/month OEM tailoring capacity."}
            </p>

            <div className="pt-2">
              <Link href="https://lin.ee/highbury" target="_blank" rel="noopener noreferrer" className="v3-btn-white">
                <span>{lang === "th" ? "ปรึกษาสั่งตัดยูนิฟอร์ม OEM" : "Our Impact & Corporate OEM"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Metric Stats with Icons (Quantum Style) */}
          <div className="lg:col-span-5 space-y-8 sm:space-y-10 lg:pl-10">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-emerald-400 shrink-0 mt-1">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="font-mono text-3xl sm:text-4xl font-semibold text-white">
                  0
                </div>
                <div className="text-xs font-medium text-white/50 tracking-wider uppercase mt-1">
                  {lang === "th" ? "Size Mismatch Risk (เปลี่ยนไซส์ฟรีใน 7 วัน)" : "Size Mismatch Risk (7-Day Free Exchange)"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-blue-400 shrink-0 mt-1">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <div className="font-mono text-3xl sm:text-4xl font-semibold text-white">
                  3,500+
                </div>
                <div className="text-xs font-medium text-white/50 tracking-wider uppercase mt-1">
                  {lang === "th" ? "Monthly Output (กำลังผลิตมาตรฐาน/เดือน)" : "Monthly Tailoring Output (Pcs/Month)"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-amber-400 shrink-0 mt-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="font-mono text-3xl sm:text-4xl font-semibold text-white">
                  100%
                </div>
                <div className="text-xs font-medium text-white/50 tracking-wider uppercase mt-1">
                  {lang === "th" ? "Hand-Inspected (ตรวจคุณภาพก่อนจัดส่ง)" : "Hand-Inspected Quality Control"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
