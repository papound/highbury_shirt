import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { blogPosts } from "@/lib/mock-blog";
import { getBaseUrl, siteConfig } from "@/lib/seo";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
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

      {/* Featured / First Post */}
      {blogPosts.length > 0 && (
        <section>
          <Link href={`/blog/${blogPosts[0].slug}`} className="group block">
            <Card className="p-0 gap-0 ring-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-[#262830] hover:border-[#FFB900]/40 bg-[#13161D] shadow-xl hover:shadow-2xl transition-all duration-300 md:grid md:grid-cols-12">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-auto md:min-h-[360px] h-full w-full overflow-hidden bg-[#0E1015] md:col-span-6 lg:col-span-7">
                <Image
                  src={blogPosts[0].imageUrl}
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 58vw"
                  priority
                />
              </div>
              <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-[#13161D] md:col-span-6 lg:col-span-5">
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                    <Badge
                      variant="default"
                      className="bg-[#FFB900]/15 text-[#FFB900] border border-[#FFB900]/30 hover:bg-[#FFB900]/25 px-3 py-1 text-xs font-semibold"
                    >
                      {blogPosts[0].category}
                    </Badge>
                    <time
                      dateTime={blogPosts[0].date}
                      className="inline-flex items-center gap-1.5 text-[#9496A1] font-medium"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(blogPosts[0].date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-snug text-white group-hover:text-[#FFB900] transition-colors line-clamp-3">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-sm sm:text-base text-[#E7E7E7] leading-relaxed line-clamp-3">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#FFB900] group-hover:translate-x-1 transition-transform">
                      <span>อ่านต่อ</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>
      )}

      {/* Remaining Posts Grid */}
      {blogPosts.length > 1 && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.slice(1).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
              <Card className="h-full p-0 gap-0 ring-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-[#262830] hover:border-[#FFB900]/40 bg-[#13161D] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0E1015]">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardContent className="flex-1 p-6 sm:p-7 flex flex-col bg-[#13161D]">
                  <div className="flex items-center gap-2.5 text-xs mb-3.5">
                    <Badge
                      variant="default"
                      className="bg-[#FFB900]/15 text-[#FFB900] border border-[#FFB900]/30 hover:bg-[#FFB900]/25 px-2.5 py-0.5 text-[11px] font-semibold"
                    >
                      {post.category}
                    </Badge>
                    <span className="text-[#9496A1]">•</span>
                    <time dateTime={post.date} className="text-[#9496A1] font-medium">
                      {new Date(post.date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold leading-snug mb-2.5 text-white group-hover:text-[#FFB900] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-[#9496A1] text-sm leading-relaxed line-clamp-3 mb-5 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-[#262830]">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FFB900] group-hover:translate-x-1 transition-transform">
                      <span>อ่านต่อ</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
