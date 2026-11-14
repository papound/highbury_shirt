"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart";

interface HeaderV3Props {
  onOpenSizeGuide: () => void;
  lang: "th" | "en";
  onToggleLang: () => void;
}

export default function HeaderV3({ onOpenSizeGuide, lang, onToggleLang }: HeaderV3Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (typeof window === "undefined") return;

    const isHomePage = window.location.pathname === "/" || window.location.pathname === "/v3";
    if (!isHomePage) {
      router.push(`/#${targetId}`);
      return;
    }

    const element = document.getElementById(targetId);
    if (!element) return;

    // Gentle easeInOutCubic scroll over 900ms
    const startPosition = window.pageYOffset;
    const headerOffset = 70;
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    const distance = targetPosition - startPosition;
    const duration = 900;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(step);
      } else {
        window.history.pushState(null, "", `#${targetId}`);
      }
    };

    requestAnimationFrame(step);
  };

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
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-lg font-bold tracking-[0.2em] text-white hover:opacity-90 transition-opacity uppercase font-sans cursor-pointer"
            >
              HIGHBURY
            </a>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#models"
                onClick={(e) => scrollToSection(e, "models")}
                className="text-sm font-medium text-[#E7E7E7] hover:text-white transition-colors cursor-pointer"
              >
                {lang === "th" ? "คอลเลกชันสินค้า" : "Collection"}
              </a>
              <a
                href="#craftsmanship"
                onClick={(e) => scrollToSection(e, "craftsmanship")}
                className="text-sm font-medium text-[#E7E7E7] hover:text-white transition-colors cursor-pointer"
              >
                {lang === "th" ? "งานตัดเย็บ" : "Craftsmanship"}
              </a>
              <a
                href="#standards"
                onClick={(e) => scrollToSection(e, "standards")}
                className="text-sm font-medium text-[#E7E7E7] hover:text-white transition-colors cursor-pointer"
              >
                {lang === "th" ? "มาตรฐานโรงงาน" : "Standards"}
              </a>
              <a
                href="#about"
                onClick={(e) => scrollToSection(e, "about")}
                className="text-sm font-medium text-[#E7E7E7] hover:text-white transition-colors cursor-pointer"
              >
                {lang === "th" ? "เกี่ยวกับเรา" : "About"}
              </a>
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

              {/* Search Bar Pill (Replaces Smart Size Finder button as requested) */}
              <form
                onSubmit={handleSearch}
                className="hidden sm:flex items-center relative"
              >
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === "th" ? "ค้นหา เสื้อเชิ้ต, ทรง, ไซส์..." : "Search shirts, fit, size..."}
                  className="w-40 md:w-52 lg:w-64 pl-9.5 pr-4 py-1.5 rounded-full text-xs sm:text-sm bg-[#F2F4F8] hover:bg-white focus:bg-white text-[#07080B] placeholder:text-[#64748B] border border-white/20 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40 shadow-sm transition-all"
                />
              </form>

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
          {/* Mobile Search Bar */}
          <form
            onSubmit={(e) => {
              handleSearch(e);
              setMobileMenuOpen(false);
            }}
            className="relative mb-6"
          >
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "th" ? "ค้นหา เสื้อเชิ้ต, ทรง, ไซส์..." : "Search shirts, fit, size..."}
              className="w-full pl-9.5 pr-4 py-2.5 rounded-full text-sm bg-[#F2F4F8] text-[#07080B] placeholder:text-[#64748B] focus:outline-none focus:bg-white"
            />
          </form>

          <nav className="flex flex-col gap-5 text-base font-medium text-white">
            <a
              href="#models"
              onClick={(e) => {
                setMobileMenuOpen(false);
                scrollToSection(e, "models");
              }}
              className="text-[#E7E7E7] hover:text-white border-b border-[#262830] pb-3 cursor-pointer"
            >
              {lang === "th" ? "คอลเลกชันสินค้า" : "Collection"}
            </a>
            <a
              href="#craftsmanship"
              onClick={(e) => {
                setMobileMenuOpen(false);
                scrollToSection(e, "craftsmanship");
              }}
              className="text-[#E7E7E7] hover:text-white border-b border-[#262830] pb-3 cursor-pointer"
            >
              {lang === "th" ? "งานตัดเย็บประณีต" : "Craftsmanship"}
            </a>
            <a
              href="#standards"
              onClick={(e) => {
                setMobileMenuOpen(false);
                scrollToSection(e, "standards");
              }}
              className="text-[#E7E7E7] hover:text-white border-b border-[#262830] pb-3 cursor-pointer"
            >
              {lang === "th" ? "มาตรฐานการผลิต & OEM" : "Standards & OEM"}
            </a>
            <a
              href="#about"
              onClick={(e) => {
                setMobileMenuOpen(false);
                scrollToSection(e, "about");
              }}
              className="text-[#E7E7E7] hover:text-white border-b border-[#262830] pb-3 cursor-pointer"
            >
              {lang === "th" ? "เกี่ยวกับ Highbury" : "About Highbury"}
            </a>
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
