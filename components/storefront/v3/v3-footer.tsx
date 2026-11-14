"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, MessageSquare, Ruler } from "lucide-react";
import { useStorefrontV3Safe } from "../storefront-shell";

export default function V3Footer() {
  const v3 = useStorefrontV3Safe();
  const lang = v3?.lang || "th";

  return (
    <footer className="w-full bg-[#07080B] text-[#9496A1] py-14 sm:py-16 border-t border-[#262830] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid: Brand, Quick Links, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-10 border-b border-[#262830]">
          {/* Brand Info (Col 1-5) */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-block text-base font-bold tracking-[0.2em] text-white uppercase font-sans hover:opacity-90 transition-opacity"
            >
              HIGHBURY INTERNATIONAL
            </Link>
            <p className="text-xs sm:text-sm text-[#9496A1] leading-relaxed max-w-md">
              {lang === "th"
                ? "เสื้อเชิ้ตสำเร็จรูปคุณภาพสูง สำหรับผู้ชายและผู้หญิง รับผลิต-สั่งทำ OEM ตอบโจทย์ทุกความต้องการ"
                : "Premium ready-made shirts for men and women. Custom OEM manufacturing available."}
            </p>
            <div className="pt-2">
              <Link
                href="https://lin.ee/T8tlget"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#262830] bg-[#13161D] text-xs font-medium text-white hover:border-[#3D4252] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#FFB900]" />
                <span>{lang === "th" ? "ติดต่อสั่งทำผ่าน LINE OA" : "Contact via LINE OA"}</span>
              </Link>
            </div>
          </div>

          {/* Quick Links (Col 6-8) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
              {lang === "th" ? "ลิงค์ด่วน" : "Quick Links"}
            </h3>
            <ul className="space-y-2 text-xs font-medium text-[#E7E7E7]">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  {lang === "th" ? "สินค้าทั้งหมด" : "All Products"}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  {lang === "th" ? "บทความ" : "Blog"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {lang === "th" ? "เกี่ยวกับเรา" : "About Us"}
                </Link>
              </li>
              {v3?.openSizeGuide && (
                <li>
                  <button
                    type="button"
                    onClick={v3.openSizeGuide}
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Ruler className="w-3 h-3 text-[#FFB900]" />
                    <span>{lang === "th" ? "ตารางเทียบไซส์" : "Size Guide"}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Us (Col 9-12) */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
              {lang === "th" ? "ติดต่อเรา" : "Contact Us"}
            </h3>
            <ul className="space-y-2.5 text-xs text-[#9496A1]">
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#FFB900] shrink-0" />
                <a
                  href="tel:0863116292"
                  className="hover:text-white text-[#E7E7E7] transition-colors"
                >
                  086-311-6292
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#FFB900] shrink-0" />
                <a
                  href="mailto:thong_than@hotmail.com"
                  className="hover:text-white text-[#E7E7E7] transition-colors break-all"
                >
                  thong_than@hotmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#FFB900] shrink-0 mt-0.5" />
                <span className="text-[#E7E7E7]">
                  {lang === "th" ? "กรุงเทพมหานคร ประเทศไทย" : "Bangkok, Thailand"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row: Legal Copyright & Policies */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9496A1]">
          <div>
            © {new Date().getFullYear()} Highbury International.{" "}
            {lang === "th" ? "สงวนลิขสิทธิ์" : "All rights reserved."}
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">
              {lang === "th" ? "ข้อกำหนดและเงื่อนไข" : "Terms"}
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              {lang === "th" ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
