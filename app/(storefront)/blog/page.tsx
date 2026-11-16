import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { blogPosts } from "@/lib/mock-blog";
import { getBaseUrl, siteConfig } from "@/lib/seo";
import BlogList from "@/components/storefront/v3/blog-list";

export const metadata: Metadata = {
  title: "บทความและสาระน่ารู้เรื่องเสื้อเชิ้ต",
  description: "รวมบทความ สาระน่ารู้ เคล็ดลับการแต่งตัว การเลือกเนื้อผ้า และเบื้องหลังงานผลิตเสื้อเชิ้ตคุณภาพสูง Highbury",
  alternates: {
    canonical: `${getBaseUrl()}/blog`,
  },
  openGraph: {
    title: "บทความและสาระน่ารู้เรื่องเสื้อเชิ้ต | Highbury International",
    description: "รวมบทความ สาระน่ารู้ เคล็ดลับการแต่งตัว การเลือกเนื้อผ้า และเบื้องหลังงานผลิตเสื้อเชิ้ตคุณภาพสูง",
    url: `${getBaseUrl()}/blog`,
    images: [
      {
        url: `${getBaseUrl()}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "Highbury Blog",
      },
    ],
  },
};

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-14">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#262830] bg-[#13161D] text-[#E7E7E7]">
          <BookOpen className="w-3.5 h-3.5 text-[#FFB900]" />
          <span>HIGHBURY JOURNAL & INSIGHTS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          บทความของเรา
        </h1>
        <p className="text-base sm:text-lg text-[#9496A1] leading-relaxed">
          สาระน่ารู้ เคล็ดลับการแต่งตัว การเลือกเนื้อผ้า และเบื้องหลังการผลิตเสื้อเชิ้ตคุณภาพ
        </p>
      </section>

      {/* Interactive Blog List with Category Filters & Pagination */}
      <BlogList posts={blogPosts} />
    </div>
  );
}
