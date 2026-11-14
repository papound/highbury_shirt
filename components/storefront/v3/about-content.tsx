"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Shirt, 
  CheckCircle2, 
  Users, 
  Factory, 
  Phone, 
  MessageSquare, 
  Ruler, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Building2,
  Scissors,
  Check
} from "lucide-react";
import { useStorefrontV3Safe } from "../storefront-shell";

export default function AboutContent() {
  const v3 = useStorefrontV3Safe();
  const theme = v3?.theme || "dark";
  const lang = v3?.lang || "th";

  const isLight = theme === "light";

  return (
    <div className="w-full pb-20 sm:pb-28">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pb-20 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 transition-colors border shadow-xs"
          style={{
            backgroundColor: isLight ? "#F1F5F9" : "rgba(255, 255, 255, 0.05)",
            borderColor: isLight ? "#E2E8F0" : "rgba(255, 255, 255, 0.15)",
            color: isLight ? "#0F172A" : "#E7E7E7",
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FFB900]" />
          <span>{lang === "th" ? "เกี่ยวกับ HIGHBURY INTERNATIONAL" : "ABOUT HIGHBURY INTERNATIONAL"}</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.15] ${
          isLight ? "text-[#0F172A]" : "text-white"
        }`}>
          {lang === "th" ? (
            <>
              ผู้เชี่ยวชาญด้านเสื้อเชิ้ตสำเร็จรูป
              <br className="hidden sm:inline" />
              <span className="text-[#FFB900]"> มาตรฐานงานเทเลอร์สรีระคนไทย</span>
            </>
          ) : (
            <>
              Masters of Ready-to-Wear
              <br className="hidden sm:inline" />
              <span className="text-[#FFB900]"> Sculpted for the Asian Physique</span>
            </>
          )}
        </h1>

        <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
          isLight ? "text-[#475569]" : "text-[#E7E7E7]"
        }`}>
          {lang === "th"
            ? "ความใส่ใจในทุกฝีเข็ม เพื่อส่งมอบเสื้อเชิ้ตคุณภาพสูงที่ตอบโจทย์สรีระและไลฟ์สไตล์คนไทย สวมใส่สบายทุกวันทำงาน พร้อมบริการตัดเย็บมาตรฐานเวิร์กช็อป 3,500 ตัวต่อเดือน"
            : "Calibrated for everyday corporate performance. We merge bespoke tailoring aesthetics with modern manufacturing capacity of 3,500 pcs/month."}
        </p>
      </section>

      {/* 2. Story / Origin & Craftsmanship with Local Highbury Asset */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Real Highbury Craftsmanship Photo with Glass Metric Overlay */}
          <div className="lg:col-span-6">
            <div className={`relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border shadow-xl ${
              isLight ? "border-[#E2E8F0] bg-[#F8FAFC]" : "border-[#262830] bg-[#13161D]"
            }`}>
              <Image
                src="/images/craft-story.jpg"
                alt="Highbury Asian Fit Tailoring Craftsmanship"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover object-center"
                priority
              />

              {/* Floating Floating Quantum Glass Badge */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:left-4 p-3.5 rounded-xl bg-[#07080B]/85 backdrop-blur-md border border-white/20 text-white shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FFB900]/20 border border-[#FFB900]/40 flex items-center justify-center shrink-0">
                  <Factory className="w-5 h-5 text-[#FFB900]" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#FFB900] uppercase tracking-wider">
                    {lang === "th" ? "กำลังการผลิตมาตรฐาน" : "Workshop Capacity"}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white">
                    {lang === "th" ? "3,500 ตัว / เดือน (OEM & Retail)" : "3,500 Pcs / Month (OEM & Retail)"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Origin Narrative & 4 Measurable Metrics */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#FFB900]">
              <Scissors className="w-3.5 h-3.5" />
              <span>{lang === "th" ? "จุดเริ่มต้นแห่งความประณีต" : "OUR PHILOSOPHY"}</span>
            </div>

            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isLight ? "text-[#0F172A]" : "text-white"
            }`}>
              {lang === "th"
                ? "จากประสบการณ์ สู่ความเชี่ยวชาญด้านงานตัดเย็บ"
                : "From Bespoke Experience to Ready-to-Wear Mastery"}
            </h2>

            <div className={`space-y-4 text-sm sm:text-base leading-relaxed ${
              isLight ? "text-[#475569]" : "text-[#9496A1]"
            }`}>
              <p>
                {lang === "th"
                  ? "Highbury International ก่อตั้งขึ้นจากความมุ่งมั่นที่จะแก้ปัญหาเสื้อเชิ้ตสำเร็จรูปทั่วไป ที่มักพบปัญหาวงแขนรั้ง ช่วงไหล่ไม่พอดี หรือความยาวเสื้อที่ไม่เหมาะกับการสอดเข้ากางเกง เราจึงนำศาสตร์แห่งการตัดเย็บชั้นสูงมาปรับเป็นแพทเทิร์นเฉพาะสำหรับสรีระคนไทย (Asian Torso Ergonomics)"
                  : "Highbury International was born to eliminate the common flaws of off-the-rack shirts: tight armholes, stiff collars, and improper lengths. We adapted bespoke tailor geometry into precision patterns sculpted exclusively for the Asian torso."}
              </p>
              <p>
                {lang === "th"
                  ? "เราคัดสรรเนื้อผ้า Cotton ผสมคุณภาพสูงที่มีความทนทาน ซักแล้วคืนทรงง่าย รีดเรียบเร็ว พร้อมด้วยการควบคุมคุณภาพอย่างเข้มงวด 100% ทุกตัวก่อนออกจากเวิร์กช็อป เพื่อส่งมอบความมั่นใจในทุกบทบาทหน้าที่ของคุณ"
                  : "We select premium fine-spun cotton blends that deliver wrinkle resilience and exceptional breathability. Every single shirt undergoes a 100% pre-dispatch quality inspection before leaving our workshop."}
              </p>
            </div>

            {/* 4 Measurable Key Metrics Cards */}
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <div className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
                isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#13161D] border-[#262830]"
              }`}>
                <div className="text-2xl sm:text-3xl font-bold text-[#FFB900]">20+</div>
                <div className={`text-xs font-medium mt-1 ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                  {lang === "th" ? "ทรง & ไซส์ครอบคลุม" : "Sizes & Fits"}
                </div>
                <div className={`text-[11px] mt-0.5 ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                  {lang === "th" ? "S - 5XL ชายและหญิง" : "Men & Women S-5XL"}
                </div>
              </div>

              <div className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
                isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#13161D] border-[#262830]"
              }`}>
                <div className="text-2xl sm:text-3xl font-bold text-[#FFB900]">100k+</div>
                <div className={`text-xs font-medium mt-1 ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                  {lang === "th" ? "ความไว้วางใจ" : "Client Trust"}
                </div>
                <div className={`text-[11px] mt-0.5 ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                  {lang === "th" ? "ลูกค้าบุคคล & องค์กร" : "Delivered nationwide"}
                </div>
              </div>

              <div className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
                isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#13161D] border-[#262830]"
              }`}>
                <div className="text-2xl sm:text-3xl font-bold text-[#FFB900]">3,500</div>
                <div className={`text-xs font-medium mt-1 ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                  {lang === "th" ? "ตัว / เดือน" : "Pcs / Month"}
                </div>
                <div className={`text-[11px] mt-0.5 ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                  {lang === "th" ? "กำลังการผลิตเวิร์กช็อป" : "Workshop capacity"}
                </div>
              </div>

              <div className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
                isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#13161D] border-[#262830]"
              }`}>
                <div className="text-2xl sm:text-3xl font-bold text-[#FFB900]">7 Days</div>
                <div className={`text-xs font-medium mt-1 ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                  {lang === "th" ? "รับประกันเปลี่ยนไซส์ฟรี" : "Zero Size Risk"}
                </div>
                <div className={`text-[11px] mt-0.5 ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                  {lang === "th" ? "เปลี่ยนได้ภายใน 7 วัน" : "Free size exchange"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values / ปณิธานของเรา (Fixed Theme-Adaptive Styling: High Contrast in Dark & Light) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className={`rounded-3xl p-8 sm:p-12 lg:p-16 border transition-colors ${
          isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#0E1015] border-[#262830]"
        }`}>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#FFB900]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === "th" ? "คุณค่าและพันธกิจ" : "OUR CORE COMMITMENTS"}</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${
              isLight ? "text-[#0F172A]" : "text-white"
            }`}>
              {lang === "th" ? "ปณิธานของเรา" : "Our Commitments"}
            </h2>
            <p className={`text-sm sm:text-base ${
              isLight ? "text-[#64748B]" : "text-[#9496A1]"
            }`}>
              {lang === "th" 
                ? "3 หลักการสำคัญที่เรายึดมั่นและใส่ใจในทุกขั้นตอนการผลิตเสื้อเชิ้ตทุกตัว"
                : "The three pillars that guide our workshop from fabric selection to post-delivery care."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Value Card 1 */}
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
              isLight ? "bg-white border-[#E2E8F0] shadow-sm" : "bg-[#13161D] border-[#262830] shadow-lg"
            }`}>
              <div className="w-12 h-12 rounded-xl bg-[#FFB900]/15 border border-[#FFB900]/30 text-[#FFB900] flex items-center justify-center mb-6">
                <Shirt className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                {lang === "th" ? "คุณภาพและความทนทาน" : "Quality & Durability"}
              </h3>
              <p className={`text-sm leading-relaxed ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                {lang === "th"
                  ? "คัดสรรเส้นใย Cotton ทอละเอียด ระบายอากาศดีเยี่ยม โครงสร้างปกเสริมทรงพิเศษ (Reinforced Collar) ปกตั้งสวยตลอดวัน ไม่แบะย้วย ซักแล้วคืนทรงง่าย ประหยัดเวลารีด"
                  : "Precision-woven breathable cotton blends with reinforced fused collars that retain sharp posture wash after wash, cutting your ironing time by half."}
              </p>
            </div>

            {/* Value Card 2 */}
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
              isLight ? "bg-white border-[#E2E8F0] shadow-sm" : "bg-[#13161D] border-[#262830] shadow-lg"
            }`}>
              <div className="w-12 h-12 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#2563EB] flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                {lang === "th" ? "แพทเทิร์นสรีระเอเชีย" : "Asian Torso Fit"}
              </h3>
              <p className={`text-sm leading-relaxed ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                {lang === "th"
                  ? "ออกแบบแพทเทิร์นสำหรับคนไทยโดยเฉพาะ ทั้งความกว้างช่วงไหล่ ความลึกวงแขนที่ไม่รั้ง และความยาวเสื้อที่สอดเข้ากางเกงได้พอดี มั่นใจได้ในทุกอิริยาบถการเคลื่อนไหว"
                  : "Calibrated shoulder proportions, non-restrictive armholes, and tailored torso length designed specifically to stay securely tucked in throughout busy working days."}
              </p>
            </div>

            {/* Value Card 3 */}
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
              isLight ? "bg-white border-[#E2E8F0] shadow-sm" : "bg-[#13161D] border-[#262830] shadow-lg"
            }`}>
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                {lang === "th" ? "บริการด้วยความจริงใจ" : "Customer Assurance"}
              </h3>
              <p className={`text-sm leading-relaxed ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                {lang === "th"
                  ? "รับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน พร้อมทีมงานผู้เชี่ยวชาญให้คำแนะนำเรื่องไซส์และเนื้อผ้าอย่างตรงไปตรงมา และบริการรับผลิตยูนิฟอร์มองค์กรอย่างมืออาชีพ"
                  : "Enjoy our 7-day hassle-free size exchange guarantee with direct tailor consultations, fast delivery, and full corporate inquiry assistance."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Craftsmanship Anatomy & Workshop Specs (Visual Macro Detail Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#FFB900]">
              <Check className="w-3.5 h-3.5" />
              <span>{lang === "th" ? "มาตรฐานการตัดเย็บระดับสูง" : "TAILORING SPECIFICATIONS"}</span>
            </div>

            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isLight ? "text-[#0F172A]" : "text-white"
            }`}>
              {lang === "th"
                ? "ความประณีตที่สัมผัสได้ในทุกตะเข็บ"
                : "Precision You Can Feel in Every Seam"}
            </h2>

            <p className={`text-sm sm:text-base leading-relaxed ${
              isLight ? "text-[#475569]" : "text-[#9496A1]"
            }`}>
              {lang === "th"
                ? "เราไม่เพียงแค่นำเสนอเสื้อเชิ้ตที่ดูดีภายนอก แต่ให้ความสำคัญกับโครงสร้างภายในและการตัดเย็บระดับ Bespoke-grade ที่ทำให้เสื้อคงทน ทรงสวยสง่าแม้ผ่านการซักนับสิบครั้ง"
                : "Beyond aesthetics, true luxury lies in the architectural foundation of the shirt. We apply bespoke standards to ready-to-wear production."}
            </p>

            <div className="space-y-3.5 pt-2">
              <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#13161D] border-[#262830]"
              }`}>
                <div className="w-7 h-7 rounded-full bg-[#FFB900]/20 text-[#FFB900] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  1
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                    {lang === "th" ? "โครงสร้างปกเสริมทรงพิเศษ (Reinforced Fused Collar)" : "Reinforced Fused Collar"}
                  </div>
                  <div className={`text-xs mt-1 ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                    {lang === "th" ? "อัดผ้าเคมีคุณภาพสูง ทำให้ปกตั้งสวย ไม่แบะย้วย แม้ไม่ผูกเนกไท" : "Dual-fused interlining prevents curling and preserves crisp collar stance."}
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#13161D] border-[#262830]"
              }`}>
                <div className="w-7 h-7 rounded-full bg-[#FFB900]/20 text-[#FFB900] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  2
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                    {lang === "th" ? "ความถี่ฝีเข็มละเอียด 16-18 เข็ม/นิ้ว (High Stitch Density)" : "High Stitch Density (16-18 SPI)"}
                  </div>
                  <div className={`text-xs mt-1 ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                    {lang === "th" ? "ตะเข็บเย็บถี่แน่นหนา ตะเข็บเรียบเนียน ไม่ระคายเคืองผิว" : "Ultra-fine stitch count delivers exceptional seam durability and sleek drape."}
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#13161D] border-[#262830]"
              }`}>
                <div className="w-7 h-7 rounded-full bg-[#FFB900]/20 text-[#FFB900] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  3
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isLight ? "text-[#0F172A]" : "text-white"}`}>
                    {lang === "th" ? "กระดุมเย็บย้ำ 4 รู & รังดุมแน่นหนา" : "Reinforced 4-Hole Button Stitches"}
                  </div>
                  <div className={`text-xs mt-1 ${isLight ? "text-[#64748B]" : "text-[#9496A1]"}`}>
                    {lang === "th" ? "กระดุมคุณภาพสูง เย็บไขว้แน่นหนา ทนแรงดึง ไม่หลุดง่ายขณะใช้งาน" : "Cross-stitched 4-hole buttons tested for high tensile retention."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className={`relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden border shadow-xl ${
              isLight ? "border-[#E2E8F0] bg-[#F8FAFC]" : "border-[#262830] bg-[#13161D]"
            }`}>
              <Image
                src="/images/macro-detail.jpg"
                alt="Highbury Macro Tailoring Fabric Detail"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs font-semibold text-[#FFB900] uppercase tracking-wider">
                    {lang === "th" ? "รายละเอียดระดับมาโคร" : "Macro Precision"}
                  </div>
                  <div className="text-sm font-medium mt-0.5">
                    {lang === "th" ? "เส้นใยและรอยเย็บที่ผ่านการควบคุมคุณภาพ 100%" : "Every weave & seam inspected before dispatch"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Corporate & OEM Uniform Inquiry Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className={`rounded-3xl p-8 sm:p-12 border relative overflow-hidden ${
          isLight 
            ? "bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white border-[#334155]" 
            : "bg-gradient-to-br from-[#13161D] to-[#0A0C10] text-white border-[#262830]"
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#FFB900]/15 text-[#FFB900] border border-[#FFB900]/30">
                <Building2 className="w-3.5 h-3.5" />
                <span>{lang === "th" ? "บริการสั่งผลิตสำหรับองค์กร (Corporate Uniform OEM)" : "CORPORATE UNIFORM & OEM INQUIRIES"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {lang === "th"
                  ? "ยกระดับภาพลักษณ์องค์กรด้วยเสื้อเชิ้ตสั่งตัดมาตรฐานสูง"
                  : "Elevate Your Corporate Identity with Tailored Workwear"}
              </h2>
              <p className="text-sm sm:text-base text-[#E7E7E7] leading-relaxed max-w-xl">
                {lang === "th"
                  ? "เรารับผลิตเสื้อเชิ้ตยูนิฟอร์มพนักงาน สั่งทอสีเฉพาะตามแบรนด์ CI พร้อมบริการปักโลโก้ความละเอียดสูง ให้คำปรึกษาแพทเทิร์น และจัดทำตัวอย่างก่อนสั่งผลิตจริง"
                  : "From bespoke company color matching to precision logo embroidery, our workshop handles full-batch corporate orders with dedicated fit samples."}
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#E7E7E7]">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#FFB900]" />
                  <a href="tel:0863116292" className="hover:text-white underline underline-offset-4">086-311-6292</a>
                  <span>หรือ</span>
                  <a href="tel:028968066" className="hover:text-white underline underline-offset-4">02-896-8066 ต่อ 9</a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center items-stretch lg:items-end">
              <Link
                href="https://lin.ee/T8tlget"
                target="_blank"
                rel="noopener noreferrer"
                className="v3-btn-white w-full sm:w-auto text-center justify-center"
              >
                <MessageSquare className="w-4 h-4 text-[#07080B]" />
                <span>{lang === "th" ? "ปรึกษาสั่งผลิตผ่าน LINE OA" : "Inquire via LINE OA"}</span>
              </Link>
              {v3?.openSizeGuide && (
                <button
                  type="button"
                  onClick={v3.openSizeGuide}
                  className="v3-btn-glass w-full sm:w-auto text-center justify-center text-xs"
                >
                  <Ruler className="w-4 h-4 text-[#FFB900]" />
                  <span>{lang === "th" ? "คำนวณไซส์ Smart Size Finder" : "Smart Size Finder"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Closing Interactive Actions */}
      <section className="text-center max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
          isLight ? "text-[#0F172A]" : "text-white"
        }`}>
          {lang === "th" ? "สัมผัสประสบการณ์เสื้อเชิ้ตที่พอดีตัวคุณ" : "Experience the Flawless Fit"}
        </h2>
        <p className={`text-sm sm:text-base ${
          isLight ? "text-[#64748B]" : "text-[#9496A1]"
        }`}>
          {lang === "th"
            ? "เลือกชมคอลเลกชันเสื้อเชิ้ตพร้อมส่งของเราได้ทันที พร้อมรับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน"
            : "Browse our ready-to-wear shirt collection with 7-day complimentary size exchange guarantee."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/products"
            className="v3-btn-white w-full sm:w-auto justify-center"
          >
            <span>{lang === "th" ? "เลือกชมคอลเลกชันสินค้า" : "Explore Collection"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="https://lin.ee/T8tlget"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-6 py-3 rounded-full text-sm font-semibold border transition-all flex items-center justify-center gap-2 w-full sm:w-auto ${
              isLight
                ? "border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F1F5F9]"
                : "border-[#262830] bg-[#13161D] text-[#E7E7E7] hover:text-white hover:border-[#3D4252]"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#FFB900]" />
            <span>{lang === "th" ? "ติดต่อสอบถามผ่าน LINE" : "Contact via LINE"}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
