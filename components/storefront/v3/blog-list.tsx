"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Sparkles,
  BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogPost } from "@/lib/mock-blog";
import { useStorefrontV3Safe } from "../storefront-shell";

interface BlogListProps {
  posts: BlogPost[];
}

const ITEMS_PER_PAGE = 6;

export default function BlogList({ posts }: BlogListProps) {
  const v3 = useStorefrontV3Safe();
  const theme = v3?.theme || "dark";
  const lang = v3?.lang || "th";
  const isLight = theme === "light";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract unique categories with post counts
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    posts.forEach((p) => {
      map.set(p.category, (map.get(p.category) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [posts]);

  // Filter posts by category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") return posts;
    return posts.filter((p) => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);

  // Paginated slice
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    // Smooth scroll to container top
    if (containerRef.current) {
      const topOffset = containerRef.current.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (containerRef.current) {
      const topOffset = containerRef.current.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  // Determine if we should show the prominent featured hero post:
  // Only on Page 1 when "all" categories is selected and we have at least 1 post
  const isFeaturedView = selectedCategory === "all" && currentPage === 1;
  const featuredPost = isFeaturedView && paginatedPosts.length > 0 ? paginatedPosts[0] : null;
  const gridPosts = isFeaturedView ? paginatedPosts.slice(1) : paginatedPosts;

  return (
    <div ref={containerRef} className="space-y-10 sm:space-y-14">
      {/* 1. Category Filter Bar */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#262830]/60">
        {/* Category Pills (Horizontal Scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#FFB900] text-[#07080B] shadow-md shadow-[#FFB900]/20 font-bold scale-[1.02]"
                : isLight
                ? "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] border border-[#E2E8F0]"
                : "bg-[#13161D] text-[#9496A1] hover:text-white hover:bg-[#1A1D26] border border-[#262830]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === "th" ? "ทั้งหมด" : "All Articles"}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === "all"
                  ? "bg-black/20 text-black"
                  : isLight
                  ? "bg-[#E2E8F0] text-[#475569]"
                  : "bg-white/10 text-[#E7E7E7]"
              }`}
            >
              {posts.length}
            </span>
          </button>

          {categories.map(({ name, count }) => {
            const isSelected = selectedCategory === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => handleCategoryChange(name)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#FFB900] text-[#07080B] shadow-md shadow-[#FFB900]/20 font-bold scale-[1.02]"
                    : isLight
                    ? "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] border border-[#E2E8F0]"
                    : "bg-[#13161D] text-[#9496A1] hover:text-white hover:bg-[#1A1D26] border border-[#262830]"
                }`}
              >
                <span>{name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-black/20 text-black"
                      : isLight
                      ? "bg-[#E2E8F0] text-[#475569]"
                      : "bg-white/10 text-[#E7E7E7]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Counter Info */}
        <div className="text-xs text-[#9496A1] shrink-0 font-medium self-end sm:self-center">
          {lang === "th"
            ? `แสดง ${filteredPosts.length} บทความ`
            : `Showing ${filteredPosts.length} articles`}
        </div>
      </section>

      {/* 2. Featured / Hero Post (Page 1 of All) */}
      {featuredPost && (
        <section>
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <Card
              className={`p-0 gap-0 ring-0 overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-300 md:grid md:grid-cols-12 ${
                isLight
                  ? "border-[#E2E8F0] bg-white hover:border-[#FFB900] shadow-md hover:shadow-xl"
                  : "border-[#262830] bg-[#13161D] hover:border-[#FFB900]/50 shadow-xl hover:shadow-2xl"
              }`}
            >
              <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-auto md:min-h-[380px] h-full w-full overflow-hidden bg-[#0E1015] md:col-span-6 lg:col-span-7">
                <Image
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 58vw"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFB900] text-black shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === "th" ? "บทความแนะนำ" : "Featured"}</span>
                  </div>
                </div>
              </div>
              <CardContent
                className={`p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center md:col-span-6 lg:col-span-5 ${
                  isLight ? "bg-white" : "bg-[#13161D]"
                }`}
              >
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                    <Badge
                      variant="default"
                      className="bg-[#FFB900]/15 text-[#FFB900] border border-[#FFB900]/30 hover:bg-[#FFB900]/25 px-3 py-1 text-xs font-semibold"
                    >
                      {featuredPost.category}
                    </Badge>
                    <time
                      dateTime={featuredPost.date}
                      className="inline-flex items-center gap-1.5 text-[#9496A1] font-medium"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(featuredPost.date).toLocaleDateString(
                        lang === "th" ? "th-TH" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </time>
                  </div>
                  <h2
                    className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-snug group-hover:text-[#FFB900] transition-colors line-clamp-3 ${
                      isLight ? "text-[#0F172A]" : "text-white"
                    }`}
                  >
                    {featuredPost.title}
                  </h2>
                  <p
                    className={`text-sm sm:text-base leading-relaxed line-clamp-3 ${
                      isLight ? "text-[#475569]" : "text-[#E7E7E7]"
                    }`}
                  >
                    {featuredPost.excerpt}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#FFB900] group-hover:translate-x-1 transition-transform">
                      <span>{lang === "th" ? "อ่านบทความเต็ม" : "Read Full Story"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>
      )}

      {/* 3. Posts Grid */}
      {gridPosts.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {gridPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
              <Card
                className={`h-full p-0 gap-0 ring-0 overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col ${
                  isLight
                    ? "border-[#E2E8F0] bg-white hover:border-[#FFB900] shadow-sm hover:shadow-xl hover:-translate-y-1"
                    : "border-[#262830] bg-[#13161D] hover:border-[#FFB900]/40 shadow-md hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0E1015]">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardContent
                  className={`flex-1 p-6 sm:p-7 flex flex-col ${
                    isLight ? "bg-white" : "bg-[#13161D]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs mb-3.5">
                    <Badge
                      variant="default"
                      className="bg-[#FFB900]/15 text-[#FFB900] border border-[#FFB900]/30 hover:bg-[#FFB900]/25 px-2.5 py-0.5 text-[11px] font-semibold"
                    >
                      {post.category}
                    </Badge>
                    <span className="text-[#9496A1]">•</span>
                    <time dateTime={post.date} className="text-[#9496A1] font-medium">
                      {new Date(post.date).toLocaleDateString(
                        lang === "th" ? "th-TH" : "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </time>
                  </div>
                  <h2
                    className={`text-lg sm:text-xl font-bold leading-snug mb-2.5 group-hover:text-[#FFB900] transition-colors line-clamp-2 ${
                      isLight ? "text-[#0F172A]" : "text-white"
                    }`}
                  >
                    {post.title}
                  </h2>
                  <p
                    className={`text-sm leading-relaxed line-clamp-3 mb-5 flex-1 ${
                      isLight ? "text-[#64748B]" : "text-[#9496A1]"
                    }`}
                  >
                    {post.excerpt}
                  </p>
                  <div
                    className={`mt-auto pt-4 border-t ${
                      isLight ? "border-[#F1F5F9]" : "border-[#262830]"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FFB900] group-hover:translate-x-1 transition-transform">
                      <span>{lang === "th" ? "อ่านต่อ" : "Read more"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      ) : (
        /* Empty State */
        <div
          className={`py-16 text-center rounded-3xl border ${
            isLight ? "border-[#E2E8F0] bg-[#F8FAFC]" : "border-[#262830] bg-[#13161D]"
          }`}
        >
          <BookOpen className="w-10 h-10 text-[#FFB900] mx-auto mb-3 opacity-60" />
          <h3 className={`text-lg font-bold mb-1 ${isLight ? "text-[#0F172A]" : "text-white"}`}>
            {lang === "th" ? "ไม่พบบทความในหมวดหมู่นี้" : "No articles found in this category"}
          </h3>
          <p className="text-sm text-[#9496A1] mb-5">
            {lang === "th"
              ? "ลองเลือกดูหมวดหมู่อื่นๆ หรือดูบทความทั้งหมดของเรา"
              : "Try choosing another category or explore all our articles"}
          </p>
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#FFB900] text-black shadow-md hover:bg-[#FFB900]/90 transition-colors"
          >
            <span>{lang === "th" ? "ดูบทความทั้งหมด" : "View All Articles"}</span>
          </button>
        </div>
      )}

      {/* 4. Pagination Controls */}
      {totalPages > 1 && (
        <section className="pt-8 sm:pt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#262830]/60">
          <div className="text-xs text-[#9496A1]">
            {lang === "th"
              ? `หน้า ${currentPage} จากทั้งหมด ${totalPages} หน้า (รวม ${filteredPosts.length} บทความ)`
              : `Page ${currentPage} of ${totalPages} (${filteredPosts.length} articles total)`}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Previous Page */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className={`inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentPage === 1
                  ? "opacity-35 cursor-not-allowed text-[#9496A1]"
                  : isLight
                  ? "bg-white text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] shadow-xs cursor-pointer"
                  : "bg-[#13161D] text-white hover:bg-[#1C2029] border border-[#262830] cursor-pointer"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === "th" ? "ก่อนหน้า" : "Previous"}</span>
            </button>

            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#FFB900] text-[#07080B] shadow-md shadow-[#FFB900]/25 scale-105"
                      : isLight
                      ? "bg-white text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]"
                      : "bg-[#13161D] text-[#9496A1] hover:text-white hover:bg-[#1C2029] border border-[#262830]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Page */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className={`inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentPage === totalPages
                  ? "opacity-35 cursor-not-allowed text-[#9496A1]"
                  : isLight
                  ? "bg-white text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] shadow-xs cursor-pointer"
                  : "bg-[#13161D] text-white hover:bg-[#1C2029] border border-[#262830] cursor-pointer"
              }`}
            >
              <span className="hidden sm:inline">{lang === "th" ? "ถัดไป" : "Next"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
