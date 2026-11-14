"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wind, Scissors, ShieldCheck } from "lucide-react";

interface CraftStoryProps {
  lang?: "th" | "en";
}

export default function CraftStory({ lang = "th" }: CraftStoryProps) {
  return (
    <section id="about" className="w-full py-24 sm:py-32 bg-white text-[#0A0B0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column (Quantum Style: Tag, Headline, Paragraph, Black Pill, 3 Features) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-semibold tracking-[0.25em] text-[#64748B] uppercase">
              ABOUT · เรื่องราวของ HIGHBURY
            </div>

            <h2 className="text-4xl sm:text-5xl font-medium tracking-[-0.03em] text-[#0A0B0E] leading-[1.1]">
              {lang === "th" ? (
                <>
                  มิติใหม่ของงานตัดเย็บ
                  <br />
                  ที่ใส่สบายได้ทุกวัน
                </>
              ) : (
                <>
                  A New Era
                  <br />
                  of Everyday Tailoring
                </>
              )}
            </h2>

            <p className="text-base text-[#475569] leading-relaxed max-w-lg">
              {lang === "th"
                ? "Highbury ผสานศาสตร์ช่างเสื้อเชิ้ตประณีตเข้ากับนวัตกรรมเนื้อผ้ารีดง่าย ผลิตในเวิร์กช็อปที่มีกำลังผลิตกว่า 3,500 ตัวต่อเดือน ออกแบบสัดส่วนช่วงไหล่ อก และวงแขนให้เข้ากับสรีระคนไทยโดยเฉพาะ เพื่อความมั่นใจในทุกวันทำงาน"
                : "Highbury combines bespoke tailoring craftsmanship with modern easy-care fabric engineering. Handcrafted in our dedicated workshop with over 3,500 shirts monthly capacity, every piece is sculpted specifically for the Asian torso."}
            </p>

            <div className="pt-2">
              <Link href="#models" className="v3-btn-black">
                <span>{lang === "th" ? "เรื่องราวงานตัดเย็บ" : "Our Story"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3 Minimal Feature Items Below (Quantum Style) */}
            <div className="pt-10 border-t border-[#E2E8F0] grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Wind className="w-5 h-5 text-[#0A0B0E]" />
                <div className="text-xs font-semibold text-[#0A0B0E]">
                  {lang === "th" ? "ระบายอากาศ 3 เท่า" : "Ultra Breathability"}
                </div>
                <div className="text-[10px] text-[#64748B]">
                  {lang === "th" ? "ไม่อมเหงื่อ แห้งไว" : "All-Day Freshness"}
                </div>
              </div>

              <div className="space-y-2">
                <Scissors className="w-5 h-5 text-[#0A0B0E]" />
                <div className="text-xs font-semibold text-[#0A0B0E]">
                  {lang === "th" ? "สรีระคนไทย" : "Asian Ergonomic Fit"}
                </div>
                <div className="text-[10px] text-[#64748B]">
                  {lang === "th" ? "ไหล่ อก พอดีตัว" : "Tailored Proportions"}
                </div>
              </div>

              <div className="space-y-2">
                <ShieldCheck className="w-5 h-5 text-[#0A0B0E]" />
                <div className="text-xs font-semibold text-[#0A0B0E]">
                  {lang === "th" ? "คืนทรง รีดง่าย" : "Wrinkle Resistant"}
                </div>
                <div className="text-[10px] text-[#64748B]">
                  {lang === "th" ? "ประหยัดเวลารีด" : "Easy-Care Finish"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Photography (Quantum Style) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-[#0A0B0E]">
              <Image
                src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop"
                alt="Highbury Tailoring Studio"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
