"use client";

import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Shirt,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Clock,
  Sparkles,
  Scale,
} from "lucide-react";
import { useStorefrontV3Safe } from "../storefront-shell";

export default function TermsContent() {
  const v3 = useStorefrontV3Safe();
  const theme = v3?.theme || "dark";
  const lang = v3?.lang || "th";
  const isLight = theme === "light";

  return (
    <div className="w-full pb-20 sm:pb-28">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="flex justify-center mb-6">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                : "bg-[#13161D] hover:bg-[#1A1E27] border-[#262830] text-[#9496A1] hover:text-white"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === "th" ? "กลับหน้าหลัก" : "Back to Home"}</span>
          </Link>
        </div>

        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5 transition-colors border shadow-xs"
          style={{
            backgroundColor: isLight ? "#F1F5F9" : "rgba(255, 255, 255, 0.05)",
            borderColor: isLight ? "#E2E8F0" : "rgba(255, 255, 255, 0.15)",
            color: isLight ? "#0F172A" : "#E7E7E7",
          }}
        >
          <Scale className="w-3.5 h-3.5 text-[#FFB900]" />
          <span>{lang === "th" ? "TERMS OF SERVICE" : "TERMS OF SERVICE"}</span>
        </div>

        {/* Title */}
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight ${
            isLight ? "text-[#0F172A]" : "text-white"
          }`}
        >
          {lang === "th"
            ? "ข้อกำหนดและเงื่อนไขการใช้บริการ"
            : "Terms and Conditions of Service"}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
            isLight ? "text-[#475569]" : "text-[#9496A1]"
          }`}
        >
          {lang === "th"
            ? "ข้อกำหนดฉบับนี้อธิบายสิทธิ หน้าที่ และเงื่อนไขเกี่ยวกับการสั่งซื้อเสื้อเชิ้ตสำเร็จรูป การสั่งผลิต OEM ตลอดจนการใช้งานระบบบนเว็บไซต์ Highbury International"
            : "These terms govern your purchase of ready-to-wear shirts, custom OEM tailoring, and the use of services provided by Highbury International."}
        </p>

        {/* Updated Date */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#9496A1]">
          <Clock className="w-3.5 h-3.5 text-[#FFB900]" />
          <span>
            {lang === "th"
              ? "ปรับปรุงล่าสุด: 16 พฤศจิกายน 2569"
              : "Last updated: November 16, 2026"}
          </span>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isLight
                ? "bg-[#F8FAFC] border-[#E2E8F0]"
                : "bg-[#13161D] border-[#262830]"
            }`}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#FFB900]/15 text-[#FFB900] mb-3">
              <Shirt className="w-4 h-4" />
            </div>
            <h3
              className={`text-sm font-semibold mb-1 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {lang === "th" ? "มาตรฐาน Asian Fit" : "Tailored Asian Fit"}
            </h3>
            <p className="text-xs text-[#9496A1] leading-relaxed">
              {lang === "th"
                ? "แพทเทิร์นที่ออกแบบสำหรับสรีระคนไทย สวมใส่สบาย คัตติ้งเนี้ยบ"
                : "Crafted specifically for the Asian physique with precise tailoring."}
            </p>
          </div>

          <div
            className={`p-5 rounded-2xl border transition-all ${
              isLight
                ? "bg-[#F8FAFC] border-[#E2E8F0]"
                : "bg-[#13161D] border-[#262830]"
            }`}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#FFB900]/15 text-[#FFB900] mb-3">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h3
              className={`text-sm font-semibold mb-1 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {lang === "th" ? "เปลี่ยนไซส์ได้ใน 7 วัน" : "7-Day Sizing Exchange"}
            </h3>
            <p className="text-xs text-[#9496A1] leading-relaxed">
              {lang === "th"
                ? "เสื้อสำเร็จรูปสามารถเปลี่ยนขนาดไซส์ได้เมื่อสินค้าอยู่ในสภาพสมบูรณ์"
                : "Eligible unworn ready-to-wear shirts can be exchanged within 7 days."}
            </p>
          </div>

          <div
            className={`p-5 rounded-2xl border transition-all ${
              isLight
                ? "bg-[#F8FAFC] border-[#E2E8F0]"
                : "bg-[#13161D] border-[#262830]"
            }`}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#FFB900]/15 text-[#FFB900] mb-3">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3
              className={`text-sm font-semibold mb-1 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {lang === "th" ? "ตรวจสอบสลิปแม่นยำ" : "Verified Payment"}
            </h3>
            <p className="text-xs text-[#9496A1] leading-relaxed">
              {lang === "th"
                ? "ระบบตรวจสอบการชำระเงินโอนบัญชีและพร้อมเพย์เพื่อความโปร่งใส"
                : "Automated slip validation ensuring secure and fast dispatch."}
            </p>
          </div>
        </div>

        {/* Section 1: Agreement & Parties */}
        <section
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${
            isLight
              ? "bg-[#FFFFFF] border-[#E2E8F0] shadow-sm"
              : "bg-[#13161D] border-[#262830]"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-lg bg-[#FFB900]/20 text-[#FFB900] flex items-center justify-center text-xs font-bold">
              1
            </span>
            <h2
              className={`text-lg sm:text-xl font-bold ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th"
                ? "คู่สัญญาและการยอมรับข้อกำหนด"
                : "Contracting Parties & Acceptance"}
            </h2>
          </div>
          <div
            className={`space-y-3 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "ข้อกำหนดและเงื่อนไขฉบับนี้ เป็นข้อตกลงระหว่างผู้ใช้งาน (“ท่าน” หรือ “ลูกค้า”) กับ Highbury International (“เรา”, “ร้านค้า”) เมื่อท่านเข้าเยี่ยมชม สั่งซื้อสินค้า สมัครสมาชิก หรือติดต่อผ่านทางเว็บไซต์หรือช่องทางสื่อสารของเรา ถือว่าท่านได้รับทราบและยินยอมผูกพันตามข้อกำหนดทั้งหมดนี้โดยไม่มีเงื่อนไข"
                : "These terms constitute a legally binding agreement between you ('Customer' or 'User') and Highbury International ('we', 'us'). By accessing the site, ordering products, or registering an account, you unconditionally agree to abide by these terms."}
            </p>
            <p>
              {lang === "th"
                ? "หากท่านกระทำการในนามองค์กรธุรกิจ นิติบุคคล หรือหน่วยงาน (เช่น งานสั่งผลิตเสื้อเชิ้ต OEM หรือยูนิฟอร์มพนักงาน) ท่านรับรองว่ามีอำนาจในการผูกพันนิติบุคคลดังกล่าวตามกฎหมาย"
                : "If you represent an organization or corporation for custom OEM tailoring or corporate uniforms, you warrant that you possess the requisite authority to bind that entity."}
            </p>
          </div>
        </section>

        {/* Section 2: Account & Security */}
        <section
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${
            isLight
              ? "bg-[#FFFFFF] border-[#E2E8F0] shadow-sm"
              : "bg-[#13161D] border-[#262830]"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-lg bg-[#FFB900]/20 text-[#FFB900] flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h2
              className={`text-lg sm:text-xl font-bold ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th" ? "บัญชีผู้ใช้และความปลอดภัย" : "User Accounts & Security"}
            </h2>
          </div>
          <div
            className={`space-y-3 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "ท่านตกลงที่จะให้ข้อมูลที่เป็นความจริง ถูกต้อง และเป็นปัจจุบันในการลงทะเบียนบัญชีหรือการสั่งซื้อสินค้า และมีหน้าที่รักษาความลับของชื่อผู้ใช้งานและรหัสผ่านของท่าน"
                : "You agree to provide true, accurate, and up-to-date credentials upon registration or checkout, and are responsible for safeguarding your login credentials."}
            </p>
            <p>
              {lang === "th"
                ? "ท่านต้องรับผิดชอบต่อกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของท่าน หากพบหรือสงสัยว่ามีการเข้าถึงบัญชีโดยไม่ได้รับอนุญาต โปรดติดต่อทีมงานของเราทันที"
                : "You remain accountable for all activities conducted under your user credentials. Please alert us immediately upon discovering any unauthorized security breaches."}
            </p>
          </div>
        </section>

        {/* Section 3: Products, Sizing & Custom Orders */}
        <section
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${
            isLight
              ? "bg-[#FFFFFF] border-[#E2E8F0] shadow-sm"
              : "bg-[#13161D] border-[#262830]"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-lg bg-[#FFB900]/20 text-[#FFB900] flex items-center justify-center text-xs font-bold">
              3
            </span>
            <h2
              className={`text-lg sm:text-xl font-bold ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th"
                ? "ข้อมูลสินค้า ตารางขนาดไซส์ และงานสั่งผลิต OEM"
                : "Products, Sizing Specifications & OEM Orders"}
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <div className="space-y-2">
              <strong className={isLight ? "text-slate-800" : "text-white"}>
                {lang === "th" ? "เสื้อเชิ้ตสำเร็จรูป (Ready-to-Wear):" : "Ready-to-Wear Shirts:"}
              </strong>
              <p>
                {lang === "th"
                  ? "เสื้อเชิ้ตสำเร็จรูปของ Highbury ผลิตขึ้นตามมาตรฐานแพทเทิร์น Asian Fit รายละเอียดขนาด (รอบอก, ไหล่, ความยาวแขน, ความยาวเสื้อ) จะระบุไว้อย่างชัดเจนในตารางเทียบไซส์ (Smart Size Guide) ขอแนะนำให้ลูกค้าวัดสรีระก่อนทำการสั่งซื้อ"
                  : "All ready-to-wear shirts are cut according to our Asian Fit tailoring standards. Exact measurements are published in our Smart Size Guide. Customers are strongly encouraged to consult the sizing chart prior to ordering."}
              </p>
            </div>

            <div className="space-y-2">
              <strong className={isLight ? "text-slate-800" : "text-white"}>
                {lang === "th" ? "การแสดงผลสีของสินค้า:" : "Color Representation:"}
              </strong>
              <p>
                {lang === "th"
                  ? "เราพยายามแสดงสีของผ้าและสินค้าให้ใกล้เคียงความเป็นจริงที่สุด อย่างไรก็ตาม สีจริงของเนื้อผ้าอาจมีความแตกต่างเล็กน้อย (ประมาณ 5-10%) ตามสภาพแสงและการตั้งค่าการแสดงผลของหน้าจอแต่ละอุปกรณ์"
                  : "We take great care in showcasing true fabric colors. Slight discrepancies (5-10%) may arise due to monitor calibrations and studio lighting conditions."}
              </p>
            </div>

            <div className="space-y-2">
              <strong className={isLight ? "text-slate-800" : "text-white"}>
                {lang === "th" ? "งานสั่งผลิต OEM / สั่งทำพิเศษ (Made-to-Order):" : "Custom OEM Manufacturing:"}
              </strong>
              <p>
                {lang === "th"
                  ? "สำหรับงานสั่งผลิตเฉพาะองค์กรหรือการปักโลโก้แบรนด์ การผลิตจะเริ่มขึ้นหลังจากที่ลูกค้าได้ตรวจสอบและอนุมัติตัวอย่างผ้า แพทเทิร์น และแบบงานปักเป็นลายลักษณ์อักษรแล้วเท่านั้น โดยระยะเวลาการผลิตจะเป็นไปตามที่ระบุในใบเสนอราคา"
                  : "Bespoke corporate uniform production or custom embroidery commences strictly following written sample approval. Delivery lead times will be governed by the applicable quotation agreement."}
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Ordering, Pricing & Slip Verification */}
        <section
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${
            isLight
              ? "bg-[#FFFFFF] border-[#E2E8F0] shadow-sm"
              : "bg-[#13161D] border-[#262830]"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-lg bg-[#FFB900]/20 text-[#FFB900] flex items-center justify-center text-xs font-bold">
              4
            </span>
            <h2
              className={`text-lg sm:text-xl font-bold ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th"
                ? "การสั่งซื้อ ราคา และการตรวจสอบการชำระเงิน"
                : "Ordering, Pricing & Payment Verification"}
            </h2>
          </div>
          <div
            className={`space-y-3 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "ราคาสินค้าทั้งหมดแสดงเป็นสกุลเงินบาท (THB) ทางร้านขอสงวนสิทธิ์ในการปรับเปลี่ยนราคา โปรโมชั่น หรือแก้ไขข้อผิดพลาดทางเทคนิคด้านราคาโดยจะแจ้งให้ทราบก่อนการยืนยันคำสั่งซื้อ"
                : "All prices are quoted in Thai Baht (THB). We reserve the right to amend pricing, promotions, or rectify typographical pricing errors prior to order confirmation."}
            </p>
            <p>
              {lang === "th"
                ? "การชำระเงินสามารถทำได้ผ่านการโอนบัญชีธนาคารหรือพร้อมเพย์ โดยลูกค้าต้องอัปโหลดสลิปหลักฐานการโอนเงินที่มีรหัส QR ที่ชัดเจน ระบบจะทำการตรวจสอบความถูกต้องของสลิปโดยอัตโนมัติ (Slip Verification) คำสั่งซื้อจะได้รับการยืนยันเมื่อยอดเงินตรงตามมูลค่าสินค้าจริง"
                : "Payment is processed via direct bank wire or PromptPay QR. Customers must upload an authentic payment slip with a legible QR code for automated verification. Orders are confirmed only when payment is validated."}
            </p>
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                isLight
                  ? "bg-red-50/70 border-red-200 text-red-900"
                  : "bg-red-950/20 border-red-900/40 text-red-300"
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <p className="text-xs leading-relaxed">
                {lang === "th"
                  ? "คำเตือน: การใช้สลิปปลอม สลิปที่ตัดต่อ หรือสลิปที่ใช้ซ้ำ ถือเป็นการกระทำความผิดตามกฎหมายอาญาและ พ.ร.บ. ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ ระบบจะระงับคำสั่งซื้อและดำเนินคดีตามกฎหมายทันที"
                  : "Notice: Submission of counterfeit, duplicated, or falsified transaction slips is a criminal offense under Thai Law and the Computer Crimes Act. Fraudulent orders will be permanently cancelled and reported to law enforcement."}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Shipping & Delivery */}
        <section
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${
            isLight
              ? "bg-[#FFFFFF] border-[#E2E8F0] shadow-sm"
              : "bg-[#13161D] border-[#262830]"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-lg bg-[#FFB900]/20 text-[#FFB900] flex items-center justify-center text-xs font-bold">
              5
            </span>
            <h2
              className={`text-lg sm:text-xl font-bold ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th" ? "การจัดส่งและการรับสินค้า" : "Shipping & Parcel Delivery"}
            </h2>
          </div>
          <div
            className={`space-y-3 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "สำหรับสินค้าเสื้อเชิ้ตสำเร็จรูปที่มีพร้อมจัดส่ง ร้านค้าจะดำเนินการแพ็กและจัดส่งพัสดุภายใน 1-3 วันทำการหลังได้รับการยืนยันการชำระเงิน และจะอัปเดตหมายเลขพัสดุ (Tracking Number) ให้ท่านสามารถตรวจสอบสถานะได้ทันที"
                : "In-stock ready-to-wear garments are dispatched within 1 to 3 business days following payment verification. Tracking numbers are updated in your order history."}
            </p>
            <p>
              {lang === "th"
                ? "กรุณาตรวจสอบสภาพกล่องพัสดุเมื่อได้รับจากเจ้าหน้าที่ขนส่ง หากกล่องมีรอยฉีกขาดหรือชำรุดอย่างรุนแรง แนะนำให้ถ่ายภาพหรือวิดีโอขณะแกะกล่องไว้เป็นหลักฐานเพื่อความสะดวกในการประสานงาน"
                : "Please inspect parcel packaging upon courier receipt. In case of conspicuous damage, we recommend recording an unboxing video to assist swift carrier claim resolutions."}
            </p>
          </div>
        </section>

        {/* Section 6: Return, Exchange & Refund Policy */}
        <section
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${
            isLight
              ? "bg-[#FFFFFF] border-[#E2E8F0] shadow-sm"
              : "bg-[#13161D] border-[#262830]"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-lg bg-[#FFB900]/20 text-[#FFB900] flex items-center justify-center text-xs font-bold">
              6
            </span>
            <h2
              className={`text-lg sm:text-xl font-bold ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th"
                ? "นโยบายการเปลี่ยนไซส์ การคืนสินค้า และการคืนเงิน"
                : "Return, Sizing Exchange & Refund Policy"}
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            {/* Condition 1: Sizing Exchange */}
            <div
              className={`p-4 rounded-xl border ${
                isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#0E1015] border-[#262830]"
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-semibold text-xs text-[#FFB900]">
                <RotateCcw className="w-4 h-4" />
                <span>{lang === "th" ? "เงื่อนไขการเปลี่ยนขนาดไซส์ (สินค้าสำเร็จรูป)" : "Sizing Exchange Rules"}</span>
              </div>
              <ul className="text-xs text-[#9496A1] space-y-1.5 list-disc pl-4">
                <li>
                  {lang === "th"
                    ? "สามารถแจ้งขอเปลี่ยนขนาดไซส์ได้ภายใน 7 วัน นับตั้งแต่วันที่พัสดุจัดส่งสำเร็จ"
                    : "Requests must be initiated within 7 calendar days of delivered status."}
                </li>
                <li>
                  {lang === "th"
                    ? "สินค้าต้องอยู่ในสภาพเดิม 100% ไม่ผ่านการซักรีด ไม่ผ่านการสวมใส่ใช้งาน ไม่มีกลิ่นน้ำหอม และป้ายตราสินค้า (Hangtags) ต้องติดอยู่ครบถ้วน"
                    : "Garments must remain 100% pristine, unworn, unwashed, odor-free, with all original tags attached."}
                </li>
                <li>
                  {lang === "th"
                    ? "ผู้ซื้อเป็นผู้รับผิดชอบค่าจัดส่งพัสดุกลับมายังร้านค้า และค่าจัดส่งสินค้าชิ้นใหม่ตามอัตราปกติ"
                    : "Customer is responsible for roundtrip return shipping expenses for size exchanges."}
                </li>
              </ul>
            </div>

            {/* Condition 2: Defective items */}
            <div
              className={`p-4 rounded-xl border ${
                isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#0E1015] border-[#262830]"
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-semibold text-xs text-[#FFB900]">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === "th" ? "กรณีสินค้าชำรุดหรือมีตำหนิจากการผลิต" : "Manufacturing Defects"}</span>
              </div>
              <p className="text-xs text-[#9496A1] leading-relaxed">
                {lang === "th"
                  ? "หากสินค้ามีตำหนิจากการตัดเย็บ หรือทางร้านจัดส่งผิดรุ่น ผิดไซส์ หรือผิดสี Highbury International ยินดีเปลี่ยนสินค้าชิ้นใหม่ให้ทันที โดยร้านค้ารับผิดชอบค่าจัดส่งทั้งหมด"
                  : "If a shirt exhibits sewing defects or an incorrect order variant was sent, we will replace the garment promptly, with all shipping costs covered by us."}
              </p>
            </div>

            {/* Condition 3: Non-returnable */}
            <div
              className={`p-4 rounded-xl border ${
                isLight
                  ? "bg-amber-50/70 border-amber-200 text-amber-900"
                  : "bg-[#FFB900]/10 border-[#FFB900]/30 text-[#FFB900]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 font-semibold text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{lang === "th" ? "สินค้าที่ไม่สามารถรับเปลี่ยนหรือคืนได้" : "Non-Returnable Items"}</span>
              </div>
              <p className="text-xs leading-relaxed">
                {lang === "th"
                  ? "สินค้าที่ผ่านการซักแล้ว, สินค้าที่มีการปรับแก้ทรงหรือตัดเย็บดัดแปลง, สินค้าจัดรายการลดล้างสต็อก (Clearance Sale) และสินค้าสั่งผลิตพิเศษ OEM ที่ปักหรือสกรีนชื่อหรือโลโก้องค์กรเฉพาะบุคคล จะไม่สามารถขอเปลี่ยนหรือคืนเงินได้ เว้นแต่เป็นความบกพร่องที่พิสูจน์ได้ว่าไม่เป็นไปตามสเปกที่ตกลงกันไว้"
                  : "Laundered garments, altered pieces, clearance items, and bespoke OEM custom uniforms with organization logos are strictly non-refundable and non-exchangeable unless defective against approved specs."}
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Intellectual Property */}
        <section
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${
            isLight
              ? "bg-[#FFFFFF] border-[#E2E8F0] shadow-sm"
              : "bg-[#13161D] border-[#262830]"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-lg bg-[#FFB900]/20 text-[#FFB900] flex items-center justify-center text-xs font-bold">
              7
            </span>
            <h2
              className={`text-lg sm:text-xl font-bold ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th" ? "ทรัพย์สินทางปัญญา" : "Intellectual Property Rights"}
            </h2>
          </div>
          <div
            className={`space-y-3 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "เครื่องหมายการค้า โลโก้ Highbury International รูปถ่ายสินค้า กราฟิก บทความ วิดีโอ และงานสร้างสรรค์ทั้งหมดบนเว็บไซต์นี้ เป็นทรัพย์สินทางปัญญาและลิขสิทธิ์ของ Highbury International ห้ามมิให้ผู้ใดคัดลอก ดัดแปลง ทำซ้ำ หรือนำไปเผยแพร่เพื่อประโยชน์เชิงพาณิชย์โดยไม่ได้รับความยินยอมเป็นลายลักษณ์อักษร"
                : "All trademarks, logos, photography, typography, and site content remain the exclusive intellectual property of Highbury International. Reproduction without explicit written authorization is prohibited."}
            </p>
          </div>
        </section>

        {/* Section 8: Limitation of Liability */}
        <section
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${
            isLight
              ? "bg-[#FFFFFF] border-[#E2E8F0] shadow-sm"
              : "bg-[#13161D] border-[#262830]"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-lg bg-[#FFB900]/20 text-[#FFB900] flex items-center justify-center text-xs font-bold">
              8
            </span>
            <h2
              className={`text-lg sm:text-xl font-bold ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th" ? "การจำกัดความรับผิดและเหตุสุดวิสัย" : "Limitation of Liability"}
            </h2>
          </div>
          <div
            className={`space-y-3 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "เราไม่รับผิดชอบต่อความสูญหาย ความล่าช้า หรือความเสียหายอันสืบเนื่องมาจากเหตุสุดวิสัย เช่น ภัยธรรมชาติ สภาพอากาศรุนแรง การนัดหยุดงาน ข้อจำกัดด้านการขนส่งของภาครัฐ หรือความล่าช้าของผู้ให้บริการขนส่งภายนอกที่อยู่นอกเหนือการควบคุมตามสมควรของเรา"
                : "We shall not be liable for delayed shipments or indirect damages stemming from force majeure events, natural disasters, courier labor strikes, or unforeseen regulatory transit embargoes beyond reasonable control."}
            </p>
          </div>
        </section>

        {/* Section 9: Governing Law */}
        <section
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${
            isLight
              ? "bg-[#FFFFFF] border-[#E2E8F0] shadow-sm"
              : "bg-[#13161D] border-[#262830]"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-lg bg-[#FFB900]/20 text-[#FFB900] flex items-center justify-center text-xs font-bold">
              9
            </span>
            <h2
              className={`text-lg sm:text-xl font-bold ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th" ? "กฎหมายที่ใช้บังคับ" : "Governing Law"}
            </h2>
          </div>
          <div
            className={`space-y-3 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "ข้อกำหนดและเงื่อนไขการใช้บริการนี้ ให้ใช้บังคับและตีความตามกฎหมายแห่งราชอาณาจักรไทย ข้อพิพาทใด ๆ ที่เกิดขึ้นเกี่ยวกับการซื้อขายหรือการใช้บริการจะอยู่ภายใต้เขตอำนาจของศาลไทย"
                : "These terms are governed by and construed in accordance with the laws of the Kingdom of Thailand, with dispute jurisdiction lying in competent Thai courts."}
            </p>
          </div>
        </section>

        {/* Section 10: Contact Card (Modeled after TokenMe contact card) */}
        <section
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border relative overflow-hidden ${
            isLight
              ? "bg-gradient-to-br from-slate-50 to-slate-100 border-[#E2E8F0]"
              : "bg-gradient-to-br from-[#13161D] to-[#0A0C10] border-[#262830]"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#FFB900] uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                <span>{lang === "th" ? "ติดต่อฝ่ายบริการลูกค้า" : "Customer Service & Legal"}</span>
              </div>
              <h3
                className={`text-xl sm:text-2xl font-bold ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}
              >
                Highbury International
              </h3>
              <p
                className={`text-xs sm:text-sm max-w-xl ${
                  isLight ? "text-slate-600" : "text-[#9496A1]"
                }`}
              >
                {lang === "th"
                  ? "หากมีข้อสงสัยเกี่ยวกับข้อกำหนด การสั่งซื้อ การเปลี่ยนสินค้า หรือการสั่งผลิต OEM สามารถติดต่อเราได้ทันที"
                  : "If you have questions regarding our terms, sizing changes, or OEM orders, please contact our team."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-[#9496A1]">
                  <Phone className="w-3.5 h-3.5 text-[#FFB900] shrink-0" />
                  <a
                    href="tel:0863116292"
                    className="hover:text-white transition-colors"
                  >
                    086-311-6292
                  </a>
                </div>
                <div className="flex items-center gap-2 text-[#9496A1]">
                  <Mail className="w-3.5 h-3.5 text-[#FFB900] shrink-0" />
                  <a
                    href="mailto:thong_than@hotmail.com"
                    className="hover:text-white transition-colors"
                  >
                    thong_than@hotmail.com
                  </a>
                </div>
                <div className="flex items-start gap-2 text-[#9496A1] sm:col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FFB900] shrink-0 mt-0.5" />
                  <span>
                    {lang === "th"
                      ? "กรุงเทพมหานคร ประเทศไทย"
                      : "Bangkok, Thailand"}
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-2.5 sm:min-w-[200px]">
              <Link
                href="https://lin.ee/T8tlget"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#06C755] hover:bg-[#05B34C] text-white text-xs font-semibold shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{lang === "th" ? "ติดต่อทาง LINE OA" : "Chat on LINE"}</span>
              </Link>
              <Link
                href="/privacy"
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border text-xs font-semibold transition-all ${
                  isLight
                    ? "bg-white hover:bg-slate-50 border-slate-300 text-slate-800"
                    : "bg-[#181B24] hover:bg-[#202430] border-[#262830] text-white"
                }`}
              >
                <span>{lang === "th" ? "ดูนโยบายความเป็นส่วนตัว" : "Privacy Policy"}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFB900]" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
