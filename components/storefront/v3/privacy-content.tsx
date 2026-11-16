"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  Database,
  Truck,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  FileEdit,
  Share2,
} from "lucide-react";
import { useStorefrontV3Safe } from "../storefront-shell";

export default function PrivacyContent() {
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
          <ShieldCheck className="w-3.5 h-3.5 text-[#FFB900]" />
          <span>{lang === "th" ? "PRIVACY POLICY" : "PRIVACY POLICY"}</span>
        </div>

        {/* Title */}
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight ${
            isLight ? "text-[#0F172A]" : "text-white"
          }`}
        >
          {lang === "th" ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy"}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
            isLight ? "text-[#475569]" : "text-[#9496A1]"
          }`}
        >
          {lang === "th"
            ? "Highbury International ให้ความสำคัญสูงสุดต่อการคุ้มครองข้อมูลส่วนบุคคลของท่าน เอกสารนี้ชี้แจงประเภทข้อมูลที่เราเก็บรวบรวม วัตถุประสงค์ในการประมวลผล และสิทธิตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)"
            : "Highbury International values your privacy. This policy outlines how we collect, use, and protect your personal data in accordance with Thailand's Personal Data Protection Act (PDPA)."}
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
        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isLight
                ? "bg-[#F8FAFC] border-[#E2E8F0]"
                : "bg-[#13161D] border-[#262830]"
            }`}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#FFB900]/15 text-[#FFB900] mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3
              className={`text-sm font-semibold mb-1 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {lang === "th" ? "ปลอดภัยตามมาตรฐาน" : "Enterprise Security"}
            </h3>
            <p className="text-xs text-[#9496A1] leading-relaxed">
              {lang === "th"
                ? "เข้ารหัสข้อมูล SSL/TLS ตลอดการส่งผ่านข้อมูลและการจัดเก็บ"
                : "Encrypted transmission with modern SSL/TLS protocols."}
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
              <UserCheck className="w-4 h-4" />
            </div>
            <h3
              className={`text-sm font-semibold mb-1 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {lang === "th" ? "ไม่ขายข้อมูลเด็ดขาด" : "Never Sold or Rented"}
            </h3>
            <p className="text-xs text-[#9496A1] leading-relaxed">
              {lang === "th"
                ? "เราไม่เปิดเผยหรือขายข้อมูลส่วนตัวของท่านแก่บุคคลภายนอกเพื่อการค้า"
                : "We never monetize, rent, or sell your personal details to third parties."}
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
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3
              className={`text-sm font-semibold mb-1 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {lang === "th" ? "สิทธิตามกฎหมาย PDPA" : "Full PDPA Compliance"}
            </h3>
            <p className="text-xs text-[#9496A1] leading-relaxed">
              {lang === "th"
                ? "ท่านสามารถขอเข้าถึง แก้ไข ระงับ หรือลบข้อมูลได้ตลอดเวลา"
                : "Right to access, rectify, restrict, or erase your data at any time."}
            </p>
          </div>
        </div>

        {/* Section 1: Data Controller & Scope */}
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
                ? "ผู้ควบคุมข้อมูลและขอบเขตการบังคับใช้"
                : "Data Controller & Scope"}
            </h2>
          </div>
          <div
            className={`space-y-3 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "Highbury International (“เรา”, “ร้านค้า” หรือ “ผู้ควบคุมข้อมูลส่วนบุคคล”) เป็นผู้ควบคุมข้อมูลส่วนบุคคลสำหรับการใช้งานเว็บไซต์ highbury_shirt แคตตาล็อกสินค้าออนไลน์ ระบบคำสั่งซื้อ และบริการผลิตเสื้อเชิ้ตสำเร็จรูปและสั่งตัด OEM"
                : "Highbury International ('we', 'us', or 'the Data Controller') operates the website and services for highbury_shirt, providing ready-to-wear shirts and OEM bespoke manufacturing."}
            </p>
            <p>
              {lang === "th"
                ? "นโยบายความเป็นส่วนตัวฉบับนี้ครอบคลุมบุคคลที่เข้าชมเว็บไซต์ ผู้ที่ติดต่อสอบถามผ่านช่องทางออนไลน์ (รวมถึง LINE Official Account @highbury) ผู้สั่งซื้อสินค้าสำเร็จรูป ผู้ใช้บัญชีสมาชิก และลูกค้าที่ว่าจ้างผลิตเสื้อเชิ้ตสั่งตัดพิเศษ (Made-to-Order / OEM)"
                : "This policy applies to all visitors, registered members, retail purchasers, corporate OEM buyers, and individuals who communicate with us via our website or official channels."}
            </p>
          </div>
        </section>

        {/* Section 2: Data We Collect */}
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
              {lang === "th"
                ? "ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม"
                : "Personal Data We Collect"}
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "เราเก็บรวบรวมข้อมูลส่วนบุคคลเท่าที่จำเป็นต่อการดำเนินกิจกรรมและการให้บริการ ได้แก่:"
                : "We collect only the personal information strictly necessary for fulfilling our services and contractual commitments:"}
            </p>

            <ul className="space-y-3 pl-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FFB900] shrink-0 mt-0.5" />
                <div>
                  <strong className={isLight ? "text-slate-800" : "text-white"}>
                    {lang === "th"
                      ? "ข้อมูลบัญชีและการติดต่อ:"
                      : "Account & Contact Data:"}
                  </strong>{" "}
                  {lang === "th"
                    ? "ชื่อ-นามสกุล, ที่อยู่อีเมล, เบอร์โทรศัพท์, ที่อยู่สำหรับจัดส่งพัสดุ, ที่อยู่ออกใบเสร็จหรือใบกำกับภาษี, เลขประจำตัวผู้เสียภาษี (กรณีร้องขอ), บัญชี LINE User ID ที่เชื่อมโยงกับระบบ"
                    : "Name, email address, contact phone number, shipping address, billing address, tax identification number (if requested), and connected LINE User ID."}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FFB900] shrink-0 mt-0.5" />
                <div>
                  <strong className={isLight ? "text-slate-800" : "text-white"}>
                    {lang === "th"
                      ? "ข้อมูลคำสั่งซื้อและการชำระเงิน:"
                      : "Order & Transaction Data:"}
                  </strong>{" "}
                  {lang === "th"
                    ? "รายการสินค้าที่สั่งซื้อ, ขนาดไซส์เสื้อ, จำนวน, ยอดเงินชำระ, ภาพสลิปหลักฐานการโอนเงิน (Slip Verification), วันที่และเวลาการชำระเงิน และประวัติการสั่งซื้อย้อนหลัง"
                    : "Purchased items, sizing selections, quantities, payment totals, bank transfer slip images for verification, timestamps, and historical transaction logs."}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FFB900] shrink-0 mt-0.5" />
                <div>
                  <strong className={isLight ? "text-slate-800" : "text-white"}>
                    {lang === "th"
                      ? "ข้อมูลการผลิตสั่งทำพิเศษ (OEM):"
                      : "Custom Tailoring & OEM Specifications:"}
                  </strong>{" "}
                  {lang === "th"
                    ? "ข้อกำหนดสเปกเนื้อผ้า, ตารางขนาดสั่งตัดเฉพาะองค์กร, ไฟล์โลโก้หรือแบบงานปัก/สกรีน และข้อมูลผู้ประสานงานขององค์กร"
                    : "Fabric specifications, organizational size charts, embroidery/print artwork files, and corporate procurement coordinator contacts."}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FFB900] shrink-0 mt-0.5" />
                <div>
                  <strong className={isLight ? "text-slate-800" : "text-white"}>
                    {lang === "th"
                      ? "ข้อมูลทางเทคนิคและการใช้งานเว็บ:"
                      : "Technical & Browsing Data:"}
                  </strong>{" "}
                  {lang === "th"
                    ? "หมายเลข IP Address, ข้อมูลเบราว์เซอร์, ชนิดอุปกรณ์, ประวัติการเรียกดูหน้าสินค้า และคุกกี้เซสชันที่จำเป็นต่อระบบตะกร้าสินค้าและการรักษาความปลอดภัย"
                    : "IP address, browser type, device details, page interaction telemetry, and essential session cookies for shopping cart functionality."}
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: Purpose of Processing */}
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
                ? "วัตถุประสงค์และฐานทางกฎหมายในการใช้ข้อมูล"
                : "Purpose & Legal Basis of Processing"}
            </h2>
          </div>
          <div
            className={`space-y-3 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "เราประมวลผลข้อมูลส่วนบุคคลภายใต้ฐานความจำเป็นตามสัญญา (Contractual Obligation), หน้าที่ตามกฎหมาย (Legal Obligation), และประโยชน์อันชอบด้วยกฎหมาย (Legitimate Interests) ดังต่อไปนี้:"
                : "We process your personal information under contractual necessity, legal compliance, and legitimate business interests:"}
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>{lang === "th" ? "การจัดส่งสินค้าและบริการ:" : "Fulfillment:"}</strong>{" "}
                {lang === "th"
                  ? "จัดการคำสั่งซื้อ, ตัดเย็บตามขนาด, บรรจุหีบห่อ และส่งมอบสินค้าไปยังที่อยู่ที่ท่านระบุ"
                  : "Processing orders, custom tailoring, packaging, and parcel dispatch to your designated address."}
              </li>
              <li>
                <strong>{lang === "th" ? "การยืนยันยอดเงิน:" : "Payment Verification:"}</strong>{" "}
                {lang === "th"
                  ? "ตรวจสอบความถูกต้องของสลิปโอนเงินผ่านระบบอัตโนมัติ เพื่อป้องกันข้อผิดพลาดและการชำระเงินซ้ำซ้อน"
                  : "Verifying bank transfer slips against transaction data to confirm payment authenticity."}
              </li>
              <li>
                <strong>{lang === "th" ? "บริการลูกค้าและแจ้งสถานะ:" : "Customer Support:"}</strong>{" "}
                {lang === "th"
                  ? "แจ้งหมายเลขติดตามพัสดุ (Tracking Number), ให้คำแนะนำขนาดไซส์ (Smart Size Guide), และตอบข้อซักถามผ่าน LINE OA และโทรศัพท์"
                  : "Sending parcel tracking numbers, offering size advice, and answering queries via LINE OA and telephone."}
              </li>
              <li>
                <strong>{lang === "th" ? "ภาระหน้าที่ตามกฎหมาย:" : "Legal Obligations:"}</strong>{" "}
                {lang === "th"
                  ? "การออกใบเสร็จรับเงิน ใบกำกับภาษี และการจัดทำบัญชีตามกฎหมายการเงินและภาษีอากรแห่งประเทศไทย"
                  : "Issuing tax invoices, accounting records, and regulatory compliance under Thai taxation laws."}
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Third-Party Service Providers */}
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
                ? "ผู้ให้บริการภายนอกและการเปิดเผยข้อมูล"
                : "Third-Party Providers & Data Sharing"}
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "เราอาจส่งต่อข้อมูลส่วนบุคคลเฉพาะที่จำเป็นแก่พันธมิตรผู้ให้บริการที่เชื่อถือได้ เพื่อดำเนินงานตามคำสั่งซื้อของท่านอย่างราบรื่น ได้แก่:"
                : "We share only necessary data points with vetted third-party partners to fulfill your orders:"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div
                className={`p-4 rounded-xl border ${
                  isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#0E1015] border-[#262830]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 font-semibold text-xs text-[#FFB900]">
                  <Truck className="w-4 h-4" />
                  <span>{lang === "th" ? "ผู้ให้บริการขนส่งพัสดุ" : "Logistics & Couriers"}</span>
                </div>
                <p className="text-xs text-[#9496A1]">
                  {lang === "th"
                    ? "เช่น ไปรษณีย์ไทย, Flash Express หรือ Kerry Express เพื่อนำส่งพัสดุถึงมือท่าน"
                    : "Thailand Post, Flash Express, or Kerry Express for direct delivery."}
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#0E1015] border-[#262830]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 font-semibold text-xs text-[#FFB900]">
                  <CreditCard className="w-4 h-4" />
                  <span>{lang === "th" ? "ระบบตรวจสอบสลิปและธนาคาร" : "Payment Verification"}</span>
                </div>
                <p className="text-xs text-[#9496A1]">
                  {lang === "th"
                    ? "ผู้ให้บริการยืนยันความถูกต้องของสลิปโอนเงิน (SlipOK) และสถาบันการเงินที่เกี่ยวข้อง"
                    : "Automated slip verification gateways (SlipOK) and affiliated financial institutions."}
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#0E1015] border-[#262830]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 font-semibold text-xs text-[#FFB900]">
                  <MessageSquare className="w-4 h-4" />
                  <span>{lang === "th" ? "ระบบสื่อสารออนไลน์" : "Communication Services"}</span>
                </div>
                <p className="text-xs text-[#9496A1]">
                  {lang === "th"
                    ? "LINE Official Account สำหรับการให้บริการลูกค้าและอัปเดตสถานะออเดอร์"
                    : "LINE Official Account infrastructure for live support and notifications."}
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#0E1015] border-[#262830]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 font-semibold text-xs text-[#FFB900]">
                  <Database className="w-4 h-4" />
                  <span>{lang === "th" ? "คลาวด์และโฮสติ้ง" : "Cloud & Infrastructure"}</span>
                </div>
                <p className="text-xs text-[#9496A1]">
                  {lang === "th"
                    ? "ระบบคลาวด์มาตรฐานสากลที่มีระบบไฟร์วอลล์และการป้องกันข้อมูลรั่วไหล"
                    : "Cloud database and hosting systems with strict access security standards."}
                </p>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                isLight
                  ? "bg-amber-50/70 border-amber-200 text-amber-900"
                  : "bg-[#FFB900]/10 border-[#FFB900]/30 text-[#FFB900]"
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                {lang === "th"
                  ? "เราไม่มีนโยบายจำหน่าย แลกเปลี่ยน หรือส่งต่อข้อมูลส่วนบุคคลของท่านแก่บุคคลภายนอกเพื่อผลประโยชน์เชิงพาณิชย์ หรือการโฆษณาชวนเชื่อโดยเด็ดขาด"
                  : "We strictly uphold a policy against selling, leasing, or trading your personal data to any external advertising or data brokerage entities."}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Data Retention & Security */}
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
              {lang === "th"
                ? "การเก็บรักษาและความปลอดภัยของข้อมูล"
                : "Retention & Security Standards"}
            </h2>
          </div>
          <div
            className={`space-y-3 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "เราจัดเก็บข้อมูลบัญชี รายการคำสั่งซื้อ และหลักฐานธุรกรรมทางการเงินตราบเท่าที่จำเป็นต่อการให้บริการและการปฏิบัติตามภาระหน้าที่ทางกฎหมาย (เช่น ข้อกำหนดในการจัดเก็บเอกสารทางภาษีและบัญชีตามประมวลรัษฎากร 5-10 ปี) เมื่อพ้นระยะเวลาดังกล่าว ข้อมูลจะถูกทำลายหรือทำให้ไม่สามารถระบุตัวบุคคลได้"
                : "We retain account data and financial documentation for the period required to fulfill service obligations and statutory requirements under Thai tax law (typically 5 to 10 years). Data past its retention lifespan is securely purged or anonymized."}
            </p>
            <p>
              {lang === "th"
                ? "เราดำเนินมาตรการรักษาความปลอดภัยทั้งเชิงเทคนิค (Encryption, Role-based Permissions, Database Security) และเชิงบริหารจัดการเพื่อจำกัดการเข้าถึงเฉพาะเจ้าหน้าที่ที่เกี่ยวข้องโดยตรง"
                : "We maintain administrative and technical safeguards including encryption, least-privilege role boundaries, and audit logging to prevent unauthorized access or disclosure."}
            </p>
          </div>
        </section>

        {/* Section 6: Your PDPA Rights */}
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
                ? "สิทธิของเจ้าของข้อมูลส่วนบุคคล (PDPA Rights)"
                : "Your PDPA Rights"}
            </h2>
          </div>
          <div
            className={`space-y-4 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ท่านในฐานะเจ้าของข้อมูลส่วนบุคคลมีสิทธิตามกฎหมายดังนี้:"
                : "Under Thailand's Personal Data Protection Act B.E. 2562 (PDPA), you have the right to:"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                  isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#0E1015] border-[#262830]"
                }`}
              >
                <Eye className="w-4 h-4 text-[#FFB900] shrink-0 mt-0.5" />
                <div>
                  <strong className={isLight ? "text-slate-800" : "text-white"}>
                    {lang === "th" ? "สิทธิขอเข้าถึงและรับสำเนา:" : "Right of Access:"}
                  </strong>{" "}
                  {lang === "th"
                    ? "ขอเข้าถึงและรับสำเนาข้อมูลส่วนบุคคลของตนเองที่อยู่ในการดูแลของเรา"
                    : "Request access to and a copy of your personal data."}
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                  isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#0E1015] border-[#262830]"
                }`}
              >
                <FileEdit className="w-4 h-4 text-[#FFB900] shrink-0 mt-0.5" />
                <div>
                  <strong className={isLight ? "text-slate-800" : "text-white"}>
                    {lang === "th" ? "สิทธิขอแก้ไขข้อมูล:" : "Right to Rectification:"}
                  </strong>{" "}
                  {lang === "th"
                    ? "ขอให้แก้ไขข้อมูลที่ไม่ถูกต้อง ไม่สมบูรณ์ หรือไม่เป็นปัจจุบัน"
                    : "Request rectification of incomplete, incorrect, or outdated data."}
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                  isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#0E1015] border-[#262830]"
                }`}
              >
                <Trash2 className="w-4 h-4 text-[#FFB900] shrink-0 mt-0.5" />
                <div>
                  <strong className={isLight ? "text-slate-800" : "text-white"}>
                    {lang === "th" ? "สิทธิขอลบหรือทำลายข้อมูล:" : "Right to Erasure:"}
                  </strong>{" "}
                  {lang === "th"
                    ? "ขอให้ลบหรือทำลายข้อมูลเมื่อหมดความจำเป็นตามกฎหมาย"
                    : "Request deletion or anonymization when data is no longer necessary."}
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                  isLight ? "bg-[#F8FAFC] border-[#E2E8F0]" : "bg-[#0E1015] border-[#262830]"
                }`}
              >
                <Share2 className="w-4 h-4 text-[#FFB900] shrink-0 mt-0.5" />
                <div>
                  <strong className={isLight ? "text-slate-800" : "text-white"}>
                    {lang === "th" ? "สิทธิคัดค้านหรือเพิกถอนความยินยอม:" : "Right to Object / Withdraw:"}
                  </strong>{" "}
                  {lang === "th"
                    ? "คัดค้านการประมวลผล หรือเพิกถอนความยินยอมที่เคยให้ไว้ได้ทุกเมื่อ"
                    : "Object to processing or withdraw previously granted consent."}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#9496A1] pt-1">
              {lang === "th"
                ? "หากท่านประสงค์จะใช้สิทธิข้อใดข้อหนึ่ง สามารถติดต่อทีมงานของเราผ่านทางอีเมลหรือ LINE OA โดยเราอาจขอหลักฐานยืนยันตัวตนเพิ่มเติมเพื่อความปลอดภัยก่อนดำเนินการ"
                : "To exercise any of these rights, contact us via email or LINE OA. We may request identity verification before fulfilling your request."}
            </p>
          </div>
        </section>

        {/* Section 7: Cookies */}
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
              {lang === "th" ? "คุกกี้และการจัดเก็บเซสชัน" : "Cookies & Session Storage"}
            </h2>
          </div>
          <div
            className={`space-y-3 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "เว็บไซต์ของเราใช้คุกกี้ที่จำเป็น (Essential Cookies) สำหรับการทำงานของระบบสั่งซื้อ เช่น การจดจำสินค้าในตะกร้า การเข้าสู่ระบบ และการตั้งค่าธีมการแสดงผล ท่านสามารถกำหนดค่าหรือปฏิเสธคุกกี้ได้ผ่านการตั้งค่าในเบราว์เซอร์ของท่าน ทั้งนี้การปิดใช้งานคุกกี้บางประเภทอาจทำให้ฟังก์ชันบางส่วนของเว็บไซต์ไม่สมบูรณ์"
                : "Our site uses strictly essential cookies and browser session storage to maintain your shopping cart, preserve your theme preferences, and protect your login sessions. You can configure cookie permissions in your browser settings."}
            </p>
          </div>
        </section>

        {/* Section 8: Policy Updates */}
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
              {lang === "th" ? "การเปลี่ยนแปลงนโยบาย" : "Policy Changes"}
            </h2>
          </div>
          <div
            className={`space-y-3 text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#9496A1]"
            }`}
          >
            <p>
              {lang === "th"
                ? "เราอาจปรับปรุงหรือแก้ไขนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว เพื่อให้สอดคล้องกับแนวทางปฏิบัติและข้อกำหนดทางกฎหมายที่เปลี่ยนแปลงไป โดยจะแสดงวันที่แก้ไขล่าสุดบนหน้านี้เสมอ และขอแนะนำให้ท่านตรวจสอบหน้านี้เป็นระยะ"
                : "We may update this Privacy Policy periodically to reflect procedural or statutory changes. The revision date at the top will always reflect the latest active version."}
            </p>
          </div>
        </section>

        {/* Section 9: Contact Card (Modeled after TokenMe contact card) */}
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
                <span>{lang === "th" ? "ติดต่อเรื่องข้อมูลส่วนบุคคล" : "PDPA Inquiries"}</span>
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
                  ? "หากท่านมีคำถาม ข้อเสนอแนะ หรือต้องการใช้สิทธิเกี่ยวกับข้อมูลส่วนบุคคลของท่าน สามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลของเราได้ตามช่องทางด้านล่างนี้"
                  : "If you have questions, feedback, or wish to exercise your data rights, please contact our data protection team directly."}
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
                href="/terms"
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border text-xs font-semibold transition-all ${
                  isLight
                    ? "bg-white hover:bg-slate-50 border-slate-300 text-slate-800"
                    : "bg-[#181B24] hover:bg-[#202430] border-[#262830] text-white"
                }`}
              >
                <span>{lang === "th" ? "ดูข้อกำหนดและเงื่อนไข" : "Terms of Service"}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFB900]" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
