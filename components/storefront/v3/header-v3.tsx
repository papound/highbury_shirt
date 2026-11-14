"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Globe } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart";

interface HeaderV3Props {
  onOpenSizeGuide: () => void;
  lang: "th" | "en";
  onToggleLang: () => void;
}

export default function HeaderV3({ onOpenSizeGuide, lang, onToggleLang }: HeaderV3Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#07080B]/85 backdrop-blur-md border-b border-white/10 py-4 shadow-2xl"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Identity (Quantum Style: Bold, Spaced Uppercase) */}
            <Link
              href="/"
              className="text-lg sm:text-xl font-bold tracking-[0.22em] text-white hover:opacity-90 transition-opacity uppercase font-sans"
            >
              HIGHBURY
            </Link>

            {/* Center: Desktop Navigation Links (Bilingual) */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-9">
              <Link
                href="#models"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>{lang === "th" ? "คอลเลกชัน" : "Collection"}</span>
                <span className="text-[10px] text-white/40 uppercase">
                  {lang === "th" ? "Models" : "เสื้อเชิ้ต"}
                </span>
              </Link>
              <Link
                href="#craftsmanship"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>{lang === "th" ? "งานตัดเย็บ" : "Craftsmanship"}</span>
                <span className="text-[10px] text-white/40 uppercase">
                  {lang === "th" ? "Craft" : "ประณีต"}
                </span>
              </Link>
              <Link
                href="#standards"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>{lang === "th" ? "มาตรฐาน" : "Standards"}</span>
                <span className="text-[10px] text-white/40 uppercase">
                  {lang === "th" ? "OEM" : "คุณภาพ"}
                </span>
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>{lang === "th" ? "เกี่ยวกับเรา" : "About"}</span>
                <span className="text-[10px] text-white/40 uppercase">
                  {lang === "th" ? "Story" : "ประวัติ"}
                </span>
              </Link>
            </nav>

            {/* Right: Language Switcher, White Pill CTA & Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Language Switcher TH / EN */}
              <button
                type="button"
                onClick={onToggleLang}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border border-white/20 text-white/90 hover:text-white hover:border-white/40 hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5 text-white/70" />
                <span>{lang === "th" ? "TH / EN" : "EN / TH"}</span>
              </button>

              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="hidden sm:inline-flex v3-btn-white text-xs sm:text-sm py-2 px-5"
              >
                {lang === "th" ? "คำนวณไซส์ Smart Size" : "Smart Size Finder"}
              </button>

              <Link
                href="/cart"
                className="relative p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white text-[#0A0B0E] text-[10px] font-bold flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </Link>

              {/* Hamburger Menu Icon */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#07080B]/98 backdrop-blur-xl flex flex-col pt-24 px-6 md:hidden">
          <nav className="flex flex-col gap-5 text-lg font-medium text-white">
            <Link
              href="#models"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-white border-b border-white/10 pb-3 flex justify-between items-center"
            >
              <span>{lang === "th" ? "คอลเลกชันสินค้า" : "Collection"}</span>
              <span className="text-xs text-white/40 uppercase">Models</span>
            </Link>
            <Link
              href="#craftsmanship"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-white border-b border-white/10 pb-3 flex justify-between items-center"
            >
              <span>{lang === "th" ? "งานตัดเย็บประณีต" : "Craftsmanship"}</span>
              <span className="text-xs text-white/40 uppercase">Craft</span>
            </Link>
            <Link
              href="#standards"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-white border-b border-white/10 pb-3 flex justify-between items-center"
            >
              <span>{lang === "th" ? "มาตรฐานการผลิต & OEM" : "Standards & OEM"}</span>
              <span className="text-xs text-white/40 uppercase">Standards</span>
            </Link>
            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-white border-b border-white/10 pb-3 flex justify-between items-center"
            >
              <span>{lang === "th" ? "เกี่ยวกับ Highbury" : "About Highbury"}</span>
              <span className="text-xs text-white/40 uppercase">About</span>
            </Link>
          </nav>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSizeGuide();
              }}
              className="v3-btn-white w-full justify-center"
            >
              {lang === "th" ? "คำนวณไซส์ Smart Size Finder" : "Smart Size Finder"}
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleLang();
              }}
              className="v3-btn-glass w-full justify-center text-xs"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === "th" ? "เปลี่ยนภาษา (Switch to English)" : "Switch to Thai (เปลี่ยนเป็นภาษาไทย)"}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
