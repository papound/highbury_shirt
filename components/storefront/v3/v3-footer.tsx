"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function V3Footer() {
  return (
    <footer className="w-full bg-[#07080B] text-[#9496A1] py-14 sm:py-18 border-t border-[#262830] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Row: Brand & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-[#262830]">
          <div className="space-y-1">
            <Link
              href="/"
              className="text-base font-bold tracking-[0.2em] text-white uppercase font-sans"
            >
              HIGHBURY
            </Link>
            <p className="text-xs text-[#9496A1]">
              Tailored Asian-Fit Shirts for Modern Professionals
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-medium text-[#E7E7E7]">
            <Link href="#models" className="hover:text-white transition-colors">
              คอลเลกชันสินค้า
            </Link>
            <Link href="#craftsmanship" className="hover:text-white transition-colors">
              งานตัดเย็บ
            </Link>
            <Link href="#standards" className="hover:text-white transition-colors">
              มาตรฐานโรงงาน
            </Link>
            <Link href="#about" className="hover:text-white transition-colors">
              เกี่ยวกับเรา
            </Link>
            <Link href="https://lin.ee/T8tlget" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              LINE Official
            </Link>
          </nav>

          {/* LINE Button */}
          <div className="flex items-center gap-3">
            <Link
              href="https://lin.ee/T8tlget"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#262830] bg-[#13161D] text-xs font-semibold text-white hover:border-[#3D4252] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#FFB900]" />
              <span>ติดต่อทีมงาน</span>
            </Link>
          </div>
        </div>

        {/* Bottom Row: Legal Copyright & Terms */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9496A1]">
          <div>
            © {new Date().getFullYear()} Highbury International. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">
              ข้อกำหนดและเงื่อนไข
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              นโยบายความเป็นส่วนตัว
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
