"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
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
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
          isScrolled
            ? "bg-[#07080B] border-b border-[#262830] py-3.5 shadow-lg"
            : "bg-gradient-to-b from-[#07080B]/90 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Identity */}
            <Link
              href="/"
              className="text-lg font-bold tracking-[0.2em] text-white hover:opacity-90 transition-opacity uppercase font-sans"
            >
              HIGHBURY
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#models"
                className="text-sm font-medium text-[#E7E7E7] hover:text-white transition-colors"
              >
                {lang === "th" ? "คอลเลกชันสินค้า" : "Collection"}
              </Link>
              <Link
                href="#craftsmanship"
                className="text-sm font-medium text-[#E7E7E7] hover:text-white transition-colors"
              >
                {lang === "th" ? "งานตัดเย็บ" : "Craftsmanship"}
              </Link>
              <Link
                href="#standards"
                className="text-sm font-medium text-[#E7E7E7] hover:text-white transition-colors"
              >
                {lang === "th" ? "มาตรฐานโรงงาน" : "Standards"}
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-[#E7E7E7] hover:text-white transition-colors"
              >
                {lang === "th" ? "เกี่ยวกับเรา" : "About"}
              </Link>
            </nav>

            {/* Right: Quantum Pill Actions */}
            <div className="flex items-center gap-3">
              {/* Language Switcher (Quantum Pill Style) */}
              <button
                type="button"
                onClick={onToggleLang}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20 bg-white/5 text-[#E7E7E7] hover:text-white hover:border-white/40 transition-colors cursor-pointer"
                aria-label="Toggle Language"
              >
                {lang === "th" ? "TH / EN" : "EN / TH"}
              </button>

              {/* Exact Quantum White Pill Button */}
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="hidden sm:inline-flex v3-btn-white text-xs sm:text-sm py-2 px-5"
              >
                {lang === "th" ? "คำนวณไซส์ Smart Size" : "Smart Size Finder"}
              </button>

              <Link
                href="/cart"
                className="relative p-2 rounded-full text-[#E7E7E7] hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-sm bg-[#FFB900] text-[#07080B] text-[10px] font-bold flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Icon */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-[#E7E7E7] hover:text-white hover:bg-[#13161D] transition-colors"
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
        <div className="fixed inset-0 z-40 bg-[#07080B] flex flex-col pt-24 px-6 md:hidden">
          <nav className="flex flex-col gap-5 text-base font-medium text-white">
            <Link
              href="#models"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#E7E7E7] hover:text-white border-b border-[#262830] pb-3"
            >
              {lang === "th" ? "คอลเลกชันสินค้า" : "Collection"}
            </Link>
            <Link
              href="#craftsmanship"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#E7E7E7] hover:text-white border-b border-[#262830] pb-3"
            >
              {lang === "th" ? "งานตัดเย็บประณีต" : "Craftsmanship"}
            </Link>
            <Link
              href="#standards"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#E7E7E7] hover:text-white border-b border-[#262830] pb-3"
            >
              {lang === "th" ? "มาตรฐานการผลิต & OEM" : "Standards & OEM"}
            </Link>
            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#E7E7E7] hover:text-white border-b border-[#262830] pb-3"
            >
              {lang === "th" ? "เกี่ยวกับ Highbury" : "About Highbury"}
            </Link>
          </nav>

          <div className="mt-8 pt-6 border-t border-[#262830] flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSizeGuide();
              }}
              className="v3-btn-primary w-full justify-center"
            >
              {lang === "th" ? "คำนวณไซส์ Smart Size Finder" : "Smart Size Finder"}
            </button>
            <button
              type="button"
              onClick={onToggleLang}
              className="v3-btn-secondary w-full justify-center text-xs"
            >
              {lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
