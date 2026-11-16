"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare, Phone, Sparkles } from "lucide-react";
import { useStorefrontV3Safe } from "../storefront-shell";

interface PreFooterCtaProps {
  onOpenSizeGuide?: () => void;
  lang?: "th" | "en";
}

export default function PreFooterCta({
  onOpenSizeGuide,
  lang: propLang,
}: PreFooterCtaProps) {
  const v3 = useStorefrontV3Safe();
  const theme = v3?.theme || "dark";
  const lang = propLang || v3?.lang || "th";
  const isLight = theme === "light";

  return (
    <section id="about" className="relative w-full py-16 sm:py-20 lg:py-28 overflow-hidden scroll-mt-20">
      {/* Top Edge Blend (Seamless Transition from Standards Landscape) */}
      <div
        className={`absolute inset-x-0 top-0 h-14 sm:h-16 lg:h-20 pointer-events-none z-1 transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-b from-white/25 via-white/8 to-transparent"
            : "bg-gradient-to-b from-[#07080B]/25 via-[#07080B]/8 to-transparent"
        }`}
      />

      {/* Ambient Subtle Background */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-b from-[#F8FAFC]/50 via-[#F1F5F9]/80 to-[#E2E8F0]/30"
            : "bg-gradient-to-b from-transparent via-[#0E1015]/60 to-[#07080B]"
        }`}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Liquid Glass Translucent Card with OEM Highlights (order-2 on mobile, order-1 on lg) */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-start">
            <div
              className="w-full max-w-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-300"
              style={{
                backgroundColor: isLight ? "rgba(255, 255, 255, 0.84)" : "rgba(10, 12, 16, 0.78)",
                backdropFilter: "blur(22px) saturate(180%)",
                WebkitBackdropFilter: "blur(22px) saturate(180%)",
                borderColor: isLight ? "rgba(226, 232, 240, 0.9)" : "rgba(255, 255, 255, 0.14)",
                boxShadow: isLight
                  ? "inset 0 1px 1px 0 rgba(255, 255, 255, 0.95), 0 24px 48px -15px rgba(15, 23, 42, 0.10)"
                  : "inset 0 1px 1px 0 rgba(255, 255, 255, 0.18), 0 24px 48px -12px rgba(0, 0, 0, 0.55)",
              }}
            >
              {/* Highlight 1: Custom Logo Embroidery */}
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    isLight ? "text-[#0F172A]" : "text-white"
                  }`}>
                    {lang === "th" ? "พร้อมปักโลโก้" : "Custom Logo"}
                  </span>
                </div>
                <div className={`text-xs sm:text-sm font-medium mt-1 ${
                  isLight ? "text-[#0F172A]" : "text-white/90"
                }`}>
                  {lang === "th" ? "บริการปักโลโก้ประจำองค์กร คมชัด ทนทาน" : "High-Precision Computer Embroidery"}
                </div>
                <div className={`text-xs mt-0.5 ${
                  isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                }`}>
                  {lang === "th"
                    ? "ฝีเข็มละเอียด เส้นไหมเงางาม สีตรงตามโลโก้ ไม่หลุดลุ่ยตลอดอายุการใช้งาน"
                    : "Tight stitch density with color-matched thread that endures daily wear."}
                </div>
              </div>

              {/* Highlight 2: Brand CI Matching & Asian Fit */}
              <div className={`border-t pt-5 mt-5 ${
                isLight ? "border-slate-200/80" : "border-white/10"
              }`}>
                <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}>
                  {lang === "th" ? "ตาม CI องค์กร" : "Brand CI"}
                </div>
                <div className={`text-xs sm:text-sm font-medium mt-1 ${
                  isLight ? "text-[#0F172A]" : "text-white/90"
                }`}>
                  {lang === "th" ? "เลือกเนื้อผ้า ปกเสื้อ และเฉดสีเฉพาะของแบรนด์" : "Custom Fabrics, Collars & Colorways"}
                </div>
                <div className={`text-xs mt-0.5 ${
                  isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                }`}>
                  {lang === "th"
                    ? "มีเนื้อผ้า Cotton, CVC, Oxford และ Twill ระบายอากาศดี คัตติ้งเนี้ยบ ไม่ร้อน"
                    : "Breathable, wrinkle-resistant fabrics tailored for comfort in tropical climates."}
                </div>
              </div>

              {/* Highlight 3: Capacity & Free Samples */}
              <div className={`border-t pt-5 mt-5 ${
                isLight ? "border-slate-200/80" : "border-white/10"
              }`}>
                <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}>
                  {lang === "th" ? "3,500+ ตัว" : "3,500+ Pcs"}
                </div>
                <div className={`text-xs sm:text-sm font-medium mt-1 ${
                  isLight ? "text-[#0F172A]" : "text-white/90"
                }`}>
                  {lang === "th" ? "กำลังผลิตต่อเดือน พร้อมส่งตัวอย่างให้ลองไซส์ฟรี" : "Monthly Capacity & Free Sizing Kits"}
                </div>
                <div className={`text-xs mt-0.5 ${
                  isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                }`}>
                  {lang === "th"
                    ? "ควบคุม QC รายตัว 100% รองรับทั้งทีม SME และองค์กรขนาดใหญ่ ส่งมอบตรงเวลา"
                    : "100% individual QC inspection. Sample sizing sets delivered before production."}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Heading, Subtitle & Action Pills (order-1 on mobile, order-2 on lg) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 max-w-xl lg:ml-auto">
            {/* Section Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wider uppercase ${
                isLight
                  ? "bg-slate-100 border-slate-300 text-slate-800"
                  : "bg-white/10 border-white/20 text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFB900]" />
              <span>
                {lang === "th"
                  ? "บริการผลิตเสื้อเชิ้ต OEM & ยูนิฟอร์มองค์กร"
                  : "Corporate OEM & Custom Uniforms"}
              </span>
            </div>

            {/* Display Heading */}
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th" ? (
                <>
                  ยกระดับภาพลักษณ์องค์กร
                  <br />
                  สั่งผลิตเสื้อเชิ้ต OEM พร้อมปักโลโก้แบรนด์คุณ.
                </>
              ) : (
                <>
                  Elevate Your Corporate Identity
                  <br />
                  Premium OEM Tailoring & Custom Embroidery.
                </>
              )}
            </h2>

            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isLight ? "text-[#475569]" : "text-[#E7E7E7]"
              }`}
            >
              {lang === "th"
                ? "Highbury International รับผลิตเสื้อเชิ้ตฟอร์มพนักงานและยูนิฟอร์มองค์กรมาตรฐานโรงงาน คัตติ้งประณีต เข้ารูปพอดีสรีระ (Asian Fit) พร้อมบริการปักโลโก้ด้วยเครื่องจักรคอมพิวเตอร์ความละเอียดสูง คมชัด สวยงาม ทนทานทุกการซัก ปรับแต่งเนื้อผ้าและเฉดสีตาม CI แบรนด์ของคุณได้อย่างสมบูรณ์แบบ พร้อมส่งตัวอย่างเทียบไซส์ฟรี"
                : "Highbury International delivers premium OEM corporate uniforms and employee shirts. Featuring tailored Asian Fit, precision high-definition computer logo embroidery, and custom fabrics & color matching tailored to your exact brand CI."}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="https://lin.ee/T8tlget"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 group cursor-pointer border ${
                  isLight
                    ? "bg-[#163666] !text-white border-[#163666] hover:bg-[#112a52] shadow-xs"
                    : "bg-white text-[#07080B] border-white hover:bg-white/90"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-[#FFB900]" />
                <span className={isLight ? "!text-white" : ""}>
                  {lang === "th" ? "ปรึกษาผลิต OEM & ขอใบเสนอราคา" : "Request OEM Quotation"}
                </span>
                <ArrowRight
                  className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${
                    isLight ? "!text-white" : ""
                  }`}
                />
              </Link>

              <a
                href="tel:0863116292"
                className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isLight
                    ? "bg-white text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F8FAFC]"
                    : "bg-transparent text-white border border-white/25 hover:bg-white/10"
                }`}
              >
                <Phone className="w-4 h-4 text-[#FFB900]" />
                <span>
                  {lang === "th"
                    ? "โทรปรึกษาฝ่ายขาย 086-311-6292"
                    : "Call Sales: 086-311-6292"}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
