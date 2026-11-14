"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface StandardsLandscapeProps {
  lang?: "th" | "en";
}

export default function StandardsLandscape({ lang = "th" }: StandardsLandscapeProps) {
  return (
    <section id="standards" className="w-full py-20 sm:py-28 bg-[#0E1015] text-white border-b border-[#262830]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading, Sourced facts, Clean Button */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white leading-tight">
              {lang === "th" ? (
                <>
                  ขับเคลื่อนด้วย
                  <br />
                  มาตรฐานคุณภาพตรวจสอบได้
                </>
              ) : (
                <>
                  Driven by
                  <br />
                  Verifiable Standards
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#E7E7E7] leading-relaxed max-w-xl">
              {lang === "th"
                ? "เรามุ่งมั่นขจัดปัญหาเสื้อไม่พอดีตัว เสื้อเชิ้ตทุกตัวผ่านการตรวจเช็กก่อนบรรจุ พร้อมการรับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน และเวิร์กช็อปของเราพร้อมรองรับการสั่งตัดยูนิฟอร์มองค์กรด้วยมาตรฐานขั้นสูง"
                : "We eliminate ill-fitting workwear with dedicated quality controls. Backed by our 7-day hassle-free size exchange guarantee and dedicated 3,500 pcs/month OEM tailoring capacity."}
            </p>

            <div className="pt-2">
              <Link href="https://lin.ee/T8tlget" target="_blank" rel="noopener noreferrer" className="v3-btn-white">
                <span>{lang === "th" ? "ปรึกษาสั่งตัดยูนิฟอร์มผ่าน LINE" : "Corporate Uniform Inquiry (LINE)"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Sourced metric cards (Solid #13161D, 1px border #262830, NO icons on everything) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-lg bg-[#13161D] border border-[#262830]">
              <div className="font-mono text-2xl font-semibold text-white">
                0 ความเสี่ยงเรื่องไซส์
              </div>
              <div className="text-xs text-[#9496A1] mt-1">
                {lang === "th"
                  ? "เปลี่ยนไซส์ฟรีภายใน 7 วันหลังรับพัสดุ (กรณีลองแล้วไม่พอดี)"
                  : "Free size exchange within 7 days of delivery"}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#13161D] border border-[#262830]">
              <div className="font-mono text-2xl font-semibold text-white">
                3,500 ตัว / เดือน
              </div>
              <div className="text-xs text-[#9496A1] mt-1">
                {lang === "th"
                  ? "กำลังผลิตมาตรฐานเฉลี่ยรายเดือนของเวิร์กช็อป Highbury"
                  : "Standard monthly workshop tailoring capacity"}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#13161D] border border-[#262830]">
              <div className="font-mono text-2xl font-semibold text-white">
                100% QC ก่อนจัดส่ง
              </div>
              <div className="text-xs text-[#9496A1] mt-1">
                {lang === "th"
                  ? "ตรวจสอบตะเข็บ การติดกระดุม และความสะอาดทุกตัวก่อนส่งมอบ"
                  : "Every garment inspected for seams, buttons, and finish prior to dispatch"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
