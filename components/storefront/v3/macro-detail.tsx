"use client";

import Image from "next/image";
import Link from "next/link";

interface MacroDetailProps {
  lang?: "th" | "en";
}

export default function MacroDetail({ lang = "th" }: MacroDetailProps) {
  return (
    <section id="craftsmanship" className="w-full py-20 sm:py-28 bg-[#07080B] text-white border-b border-[#262830]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading, Concrete facts */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white leading-tight">
              {lang === "th" ? (
                <>
                  ความประณีต
                  <br />
                  ในทุกรายละเอียดโครงสร้าง
                </>
              ) : (
                <>
                  Precision
                  <br />
                  in Every Detail
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#E7E7E7] leading-relaxed max-w-lg">
              {lang === "th"
                ? "โครงสร้างปกเสื้อเสริมผ้ากาวคุณภาพเยอรมันที่ผ่านการทดสอบการซัก สะบัดแขวนแล้วปกยังคงรูปสวย ไม่แบะย้วย กระดุมทุกเม็ดเย็บย้ำด้วยด้ายเหนียวพิเศษ ป้องกันปัญหากระดุมหลุดระหว่างวันทำงาน"
                : "Reinforced collar structure with German interlining engineered to withstand repeated washing without collar collapse. Every button is cross-stitched with reinforced thread to eliminate unraveling."}
            </p>

            <div className="pt-2">
              <Link href="#models" className="v3-btn-secondary">
                <span>{lang === "th" ? "ดูแบบเสื้อทั้งหมด" : "View All Shirts"}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Local Highbury photo asset (No hotlinked stock photo) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/11] rounded-lg overflow-hidden border border-[#262830] bg-[#13161D]">
              <Image
                src="/images/hero-main.jpg"
                alt="Highbury Asian Fit Tailoring Details"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[62%_25%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
