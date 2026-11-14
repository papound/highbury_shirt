"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MacroDetailProps {
  lang?: "th" | "en";
}

export default function MacroDetail({ lang = "th" }: MacroDetailProps) {
  return (
    <section id="craftsmanship" className="w-full py-24 sm:py-32 bg-white text-[#0A0B0E] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column (Quantum Style: Tag, Headline, Paragraph, Black Pill) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-semibold tracking-[0.25em] text-[#64748B] uppercase">
              TECHNOLOGY · เทคโนโลยีงานตัดเย็บ
            </div>

            <h2 className="text-4xl sm:text-5xl font-medium tracking-[-0.03em] text-[#0A0B0E] leading-[1.1]">
              {lang === "th" ? (
                <>
                  ความประณีต
                  <br />
                  ในทุกรายละเอียด
                </>
              ) : (
                <>
                  Precision
                  <br />
                  in Every Detail
                </>
              )}
            </h2>

            <p className="text-base text-[#475569] leading-relaxed max-w-lg">
              {lang === "th"
                ? "ตั้งแต่โครงสร้างปกเสื้ออัดกาวเยอรมันที่ไม่ยุบตัว การตัดเย็บทรงพอดีตัวสรีระ ไปจนถึงการเย็บย้ำกระดุมทนทาน Highbury ใส่ใจในทุกรายละเอียดเชิงวิศวกรรมการตัดเย็บเสื้อเชิ้ต"
                : "From heat-bonded German collar interlinings that never buckle to ergonomic Asian-fit sculpting and reinforced buttons, Highbury integrates structural garment engineering into every single cut."}
            </p>

            <div className="pt-2">
              <Link href="#models" className="v3-btn-black">
                <span>{lang === "th" ? "เจาะลึกงานตัดเย็บ" : "Explore Technology"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Ultra Macro Visual (Quantum Cockpit Equivalent) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl bg-[#0A0B0E]">
              <Image
                src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1200&auto=format&fit=crop"
                alt="Highbury Collar and Fabric Macro Detail"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
