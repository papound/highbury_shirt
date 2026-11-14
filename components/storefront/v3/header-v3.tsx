"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, Search, Loader2, Sun, Moon } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart";

interface SearchResult {
  id: string;
  name: string;
  nameTh: string;
  slug: string;
  basePrice: number;
  category?: {
    name: string;
    nameTh: string;
  };
  images?: Array<{
    url: string;
    altText?: string | null;
  }>;
}

interface HeaderV3Props {
  onOpenSizeGuide: () => void;
  lang: "th" | "en";
  onToggleLang: () => void;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
}

export default function HeaderV3({
  onOpenSizeGuide,
  lang,
  onToggleLang,
  theme = "dark",
  onToggleTheme,
}: HeaderV3Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Debounced live partial search
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Partial search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      if (targetId === "models") {
        router.push("/products");
        return;
      }
      if (targetId === "about") {
        router.push("/about");
        return;
      }
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
            ? theme === "light"
              ? "bg-white/95 border-b border-[#E5E7EB] py-3.5 shadow-sm backdrop-blur-md"
              : "bg-[#07080B] border-b border-[#262830] py-3.5 shadow-lg"
            : theme === "light"
              ? "bg-gradient-to-b from-white/95 via-white/80 to-transparent py-5"
              : "bg-gradient-to-b from-[#07080B]/90 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Identity */}
            <Link
              href="/"
              onClick={(e) => {
                if (typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname === "/v3")) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={`text-lg font-bold tracking-[0.2em] ${
                theme === "light" ? "text-[#0F172A]" : "text-white"
              } hover:opacity-90 transition-opacity uppercase font-sans cursor-pointer shrink-0`}
            >
              HIGHBURY
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0">
              <a
                href="#models"
                onClick={(e) => scrollToSection(e, "models")}
                className={`text-sm xl:text-[15px] font-medium whitespace-nowrap ${
                  theme === "light" ? "text-[#334155] hover:text-[#0F172A]" : "text-[#E7E7E7] hover:text-white"
                } transition-colors cursor-pointer`}
              >
                {lang === "th" ? "คอลเลกชันสินค้า" : "Collection"}
              </a>
              <a
                href="#craftsmanship"
                onClick={(e) => scrollToSection(e, "craftsmanship")}
                className={`text-sm xl:text-[15px] font-medium whitespace-nowrap ${
                  theme === "light" ? "text-[#334155] hover:text-[#0F172A]" : "text-[#E7E7E7] hover:text-white"
                } transition-colors cursor-pointer`}
              >
                {lang === "th" ? "งานตัดเย็บ" : "Craftsmanship"}
              </a>
              <a
                href="#standards"
                onClick={(e) => scrollToSection(e, "standards")}
                className={`text-sm xl:text-[15px] font-medium whitespace-nowrap ${
                  theme === "light" ? "text-[#334155] hover:text-[#0F172A]" : "text-[#E7E7E7] hover:text-white"
                } transition-colors cursor-pointer`}
              >
                {lang === "th" ? "มาตรฐานโรงงาน" : "Standards"}
              </a>
              <a
                href="#about"
                onClick={(e) => scrollToSection(e, "about")}
                className={`text-sm xl:text-[15px] font-medium whitespace-nowrap ${
                  theme === "light" ? "text-[#334155] hover:text-[#0F172A]" : "text-[#E7E7E7] hover:text-white"
                } transition-colors cursor-pointer`}
              >
                {lang === "th" ? "เกี่ยวกับเรา" : "About"}
              </a>
            </nav>

            {/* Right: Quantum Pill Actions */}
            <div className="flex items-center gap-2 xl:gap-3 shrink-0">
              {/* Theme Switcher (Dark / Light Version) - Crisp White Pill Button */}
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="p-2 rounded-full text-xs font-semibold bg-white text-[#07080B] hover:bg-white/90 shadow-sm border border-white transition-all cursor-pointer flex items-center justify-center shrink-0"
                  aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                  title={
                    lang === "th"
                      ? theme === "light"
                        ? "สลับเป็นโหมดมืด (Dark Version)"
                        : "สลับเป็นโหมดสว่าง (Light Version)"
                      : theme === "light"
                      ? "Switch to Dark Mode"
                      : "Switch to Light Mode"
                  }
                >
                  {theme === "light" ? (
                    <Moon className="w-3.5 h-3.5 text-[#0F172A]" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-[#07080B]" />
                  )}
                </button>
              )}

              {/* Language Switcher (Quantum Pill Style) */}
              <button
                type="button"
                onClick={onToggleLang}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                  theme === "light"
                    ? "border-[#E5E7EB] bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]"
                    : "border-white/20 bg-white/5 text-[#E7E7E7] hover:text-white hover:border-white/40"
                }`}
                aria-label="Toggle Language"
              >
                {lang === "th" ? "TH / EN" : "EN / TH"}
              </button>

              {/* Search Bar Pill with Live Partial Search */}
              <div ref={searchContainerRef} className="relative hidden sm:block">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center relative"
                >
                  <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setShowDropdown(true);
                    }}
                    placeholder={lang === "th" ? "ค้นหา เสื้อเชิ้ต, ทรง, ไซส์..." : "Search shirts, fit, size..."}
                    className="w-32 sm:w-36 md:w-44 lg:w-48 xl:w-64 pl-9.5 pr-8 py-1.5 rounded-full text-xs sm:text-sm bg-[#F2F4F8] hover:bg-white focus:bg-white text-[#07080B] placeholder:text-[#64748B] border border-white/20 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40 shadow-sm transition-all select-text selection:bg-[#2563EB] selection:text-white"
                  />
                  {isSearching ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#64748B] animate-spin absolute right-3 pointer-events-none" />
                  ) : searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setShowDropdown(false);
                      }}
                      className="absolute right-2.5 p-0.5 rounded-full text-[#64748B] hover:text-[#07080B] transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </form>

                {/* Partial Search Results Dropdown */}
                {showDropdown && searchQuery.trim() && (
                  <div className="absolute top-full right-0 mt-2 w-80 md:w-96 rounded-2xl bg-[#13161D] border border-[#262830] shadow-2xl p-2.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-[#9496A1] uppercase tracking-wider border-b border-[#262830] flex items-center justify-between">
                      <span>{lang === "th" ? "ผลการค้นหาทันที" : "Instant Results"}</span>
                      {isSearching && (
                        <span className="text-[10px] text-[#FFB900]">
                          {lang === "th" ? "กำลังค้นหา..." : "Searching..."}
                        </span>
                      )}
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="py-1 divide-y divide-[#1C1E26]">
                        {searchResults.map((item) => (
                          <Link
                            key={item.id}
                            href={`/products/${item.slug}`}
                            onClick={() => {
                              setShowDropdown(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#07080B] border border-[#262830] shrink-0 relative">
                              {item.images?.[0]?.url ? (
                                <img
                                  src={item.images[0].url}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-[#9496A1]">
                                  Shirt
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-white group-hover:text-[#FFB900] transition-colors truncate">
                                {lang === "th" && item.nameTh ? item.nameTh : item.name}
                              </div>
                              <div className="text-[11px] text-[#9496A1] truncate">
                                {lang === "th" && item.category?.nameTh ? item.category.nameTh : item.category?.name}
                              </div>
                            </div>
                            <div className="text-xs font-bold text-[#FFB900] shrink-0">
                              ฿{item.basePrice.toLocaleString()}
                            </div>
                          </Link>
                        ))}

                        <Link
                          href={`/products?search=${encodeURIComponent(searchQuery.trim())}`}
                          onClick={() => setShowDropdown(false)}
                          className="block text-center py-2 text-xs font-medium text-[#E7E7E7] hover:text-[#FFB900] transition-colors pt-2.5"
                        >
                          {lang === "th"
                            ? `ดูผลการค้นหาทั้งหมดสำหรับ "${searchQuery}" →`
                            : `View all results for "${searchQuery}" →`}
                        </Link>
                      </div>
                    ) : !isSearching ? (
                      <div className="py-6 text-center text-xs text-[#9496A1]">
                        {lang === "th"
                          ? `ไม่พบสินค้าที่ตรงกับ "${searchQuery}"`
                          : `No products matching "${searchQuery}"`}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              <Link
                href="/cart"
                className={`relative p-2 rounded-full transition-colors flex items-center justify-center ${
                  theme === "light"
                    ? "text-[#0F172A] hover:bg-[#F1F5F9]"
                    : "text-[#E7E7E7] hover:text-white hover:bg-white/10"
                }`}
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
                className={`lg:hidden p-2 rounded-md transition-colors ${
                  theme === "light"
                    ? "text-[#0F172A] hover:bg-[#F1F5F9]"
                    : "text-[#E7E7E7] hover:text-white hover:bg-[#13161D]"
                }`}
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
        <div
          className={`fixed inset-0 z-40 flex flex-col pt-24 px-6 lg:hidden overflow-y-auto ${
            theme === "light" ? "bg-white text-[#0F172A]" : "bg-[#07080B] text-white"
          }`}
        >
          {/* Mobile Search Bar with Partial Search */}
          <div ref={mobileSearchRef} className="relative mb-6">
            <form
              onSubmit={(e) => {
                handleSearch(e);
                setMobileMenuOpen(false);
              }}
              className="relative"
            >
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true);
                }}
                placeholder={lang === "th" ? "ค้นหา เสื้อเชิ้ต, ทรง, ไซส์..." : "Search shirts, fit, size..."}
                className="w-full pl-9.5 pr-8 py-2.5 rounded-full text-sm bg-[#F2F4F8] text-[#07080B] placeholder:text-[#64748B] focus:outline-none focus:bg-white select-text selection:bg-[#2563EB] selection:text-white"
              />
              {isSearching ? (
                <Loader2 className="w-3.5 h-3.5 text-[#64748B] animate-spin absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              ) : searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-[#64748B] hover:text-[#07080B]"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </form>

            {/* Mobile Dropdown Results */}
            {showDropdown && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 max-h-[50vh] overflow-y-auto rounded-2xl bg-[#13161D] border border-[#262830] shadow-2xl p-2 z-50">
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-[#1C1E26]">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.slug}`}
                        onClick={() => {
                          setShowDropdown(false);
                          setMobileMenuOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#07080B] border border-[#262830] shrink-0">
                          {item.images?.[0]?.url ? (
                            <img
                              src={item.images[0].url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-[#9496A1]">
                              Shirt
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-white truncate">
                            {lang === "th" && item.nameTh ? item.nameTh : item.name}
                          </div>
                          <div className="text-[11px] text-[#9496A1] truncate">
                            {lang === "th" && item.category?.nameTh ? item.category.nameTh : item.category?.name}
                          </div>
                        </div>
                        <div className="text-xs font-bold text-[#FFB900] shrink-0">
                          ฿{item.basePrice.toLocaleString()}
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/products?search=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={() => {
                        setShowDropdown(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block text-center py-2.5 text-xs font-medium text-[#FFB900]"
                    >
                      {lang === "th"
                        ? `ดูผลการค้นหาทั้งหมด (${searchResults.length}) →`
                        : `View all results (${searchResults.length}) →`}
                    </Link>
                  </div>
                ) : !isSearching ? (
                  <div className="py-4 text-center text-xs text-[#9496A1]">
                    {lang === "th"
                      ? `ไม่พบสินค้าที่ตรงกับ "${searchQuery}"`
                      : `No products matching "${searchQuery}"`}
                  </div>
                ) : null}
              </div>
            )}
          </div>

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
            {onToggleTheme && (
              <button
                type="button"
                onClick={() => {
                  onToggleTheme();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-full text-xs font-semibold bg-white text-[#07080B] hover:bg-white/90 shadow-sm border border-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="w-4 h-4 text-[#07080B]" />
                    <span>{lang === "th" ? "เปลี่ยนเป็นโหมดมืด (Dark Version)" : "Switch to Dark Mode"}</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-[#07080B]" />
                    <span>{lang === "th" ? "เปลี่ยนเป็นโหมดสว่าง (Light Version)" : "Switch to Light Mode"}</span>
                  </>
                )}
              </button>
            )}
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
