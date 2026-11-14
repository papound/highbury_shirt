"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CraftStoryProps {
  lang?: "th" | "en";
}

export default function CraftStory({ lang = "th" }: CraftStoryProps) {
  return (
    <section id="about" className="w-full py-20 sm:py-28 bg-[#0E1015] text-white border-b border-[#262830]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading, Concrete facts, Real spec list (No repeated icon cards) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white leading-tight">
              {lang === "th" ? (
                <>
                  มิติใหม่ของงานตัดเย็บ
                  <br />
                  ที่ใส่สบายได้ทุกวันทำงาน
                </>
              ) : (
                <>
                  A New Era
                  <br />
                  of Everyday Tailoring
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#E7E7E7] leading-relaxed max-w-xl">
              {lang === "th"
                ? "Highbury พัฒนาแพทเทิร์นเสื้อเชิ้ตสำเร็จรูปสำหรับสรีระคนไทยโดยเฉพาะ คำนวณความกว้างช่วงไหล่ ความลึกของวงแขน และความยาวเสื้อที่สอดเข้ากางเกงได้พอดี ผลิตในเวิร์กช็อปที่มีกำลังผลิต 3,500 ตัวต่อเดือน"
                : "Highbury develops ready-to-wear shirt patterns sculpted specifically for the Asian torso. Calibrated shoulder widths, armhole depths, and tuck-in lengths crafted in our 3,500 pcs/month workshop."}
            </p>

            {/* Real concrete engineering breakdown (Anti-Slop: replaces 3 icon cards with real metrics) */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#262830]">
              <div className="bg-[#13161D] p-4 rounded-lg border border-[#262830]">
                <div className="text-xs font-semibold text-[#FFB900] uppercase tracking-wider">
                  {lang === "th" ? "โครงสร้างปก" : "Collar Weave"}
                </div>
                <div className="text-sm font-medium text-white mt-1">
                  {lang === "th" ? "ผ้าอัดกาวเยอรมัน" : "German Interlining"}
                </div>
                <div className="text-xs text-[#9496A1] mt-0.5">
                  {lang === "th" ? "ปกตั้งอยู่ทรง ไม่แบะย้วย" : "Retains crisp posture"}
                </div>
              </div>

              <div className="bg-[#13161D] p-4 rounded-lg border border-[#262830]">
                <div className="text-xs font-semibold text-[#FFB900] uppercase tracking-wider">
                  {lang === "th" ? "แพทเทิร์น" : "Asian Torso"}
                </div>
                <div className="text-sm font-medium text-white mt-1">
                  {lang === "th" ? "สัดส่วนคนไทย" : "Calibrated Fit"}
                </div>
                <div className="text-xs text-[#9496A1] mt-0.5">
                  {lang === "th" ? "วงแขนกระชับ ไม่รั้งตัว" : "Zero shoulder pull"}
                </div>
              </div>

              <div className="bg-[#13161D] p-4 rounded-lg border border-[#262830]">
                <div className="text-xs font-semibold text-[#FFB900] uppercase tracking-wider">
                  {lang === "th" ? "การรีด" : "Easy Care"}
                </div>
                <div className="text-sm font-medium text-white mt-1">
                  {lang === "th" ? "คืนทรงหลังซัก" : "Wrinkle Recovery"}
                </div>
                <div className="text-xs text-[#9496A1] mt-0.5">
                  {lang === "th" ? "ประหยัดเวลารีด 50%" : "50% less ironing time"}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link href="#models" className="v3-btn-white">
                <span>{lang === "th" ? "เลือกดูคอลเลกชันสินค้า" : "Explore Collection"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Local Highbury photo asset (No hotlinked stock photo) */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#262830] bg-[#13161D]">
              <Image
                src="/images/hero-main.jpg"
                alt="Highbury Asian Fit Tailoring"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-[70%_center]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
