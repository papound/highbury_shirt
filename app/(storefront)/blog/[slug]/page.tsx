import type { Metadata } from "next";
import { blogPosts } from "@/lib/mock-blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import JsonLd from "@/components/shared/json-ld";
import {
  getBaseUrl,
  siteConfig,
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "บทความไม่พบ" };

  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
  const ogImageUrl = post.imageUrl.startsWith("http")
    ? post.imageUrl
    : `${baseUrl}${post.imageUrl}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | Highbury International`,
      description: post.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.date,
      authors: [siteConfig.name],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: siteConfig.locale,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Highbury International`,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleJsonLd = generateArticleSchema({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    date: post.date,
    imageUrl: post.imageUrl,
    authorName: siteConfig.name,
  });

  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: "หน้าแรก", url: "/" },
    { name: "บทความ", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-14">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Top Back Navigation */}
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#9496A1] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>กลับไปหน้าบทความทั้งหมด</span>
        </Link>
      </div>

      {/* Header */}
      <header className="max-w-3xl mx-auto text-center space-y-5">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge
            className="bg-[#FFB900]/15 text-[#FFB900] border border-[#FFB900]/30 hover:bg-[#FFB900]/25 px-3 py-1 text-xs font-semibold"
          >
            {post.category}
          </Badge>
          <time
            dateTime={post.date}
            className="inline-flex items-center gap-1.5 text-sm text-[#9496A1] font-medium"
          >
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.date).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-snug text-white">
          {post.title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-[#E7E7E7] leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      {/* Featured Image */}
      <figure className="relative aspect-[16/10] sm:aspect-video w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border border-[#262830] bg-[#0E1015] shadow-2xl">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
      </figure>

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl sm:rounded-3xl border border-[#262830] bg-[#13161D] p-6 sm:p-10 md:p-12 shadow-lg">
          <ReactMarkdown
            components={{
              h2: ({ ...props }) => (
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mt-8 first:mt-0 mb-4 leading-snug"
                  {...props}
                />
              ),
              h3: ({ ...props }) => (
                <h3
                  className="text-lg sm:text-xl font-bold text-white mt-7 mb-3 flex items-center gap-2 leading-snug"
                  {...props}
                />
              ),
              hr: () => <hr className="my-8 sm:my-10 border-t border-[#262830]" />,
              p: ({ children }) => (
                <p className="text-base sm:text-lg text-[#E7E7E7] leading-relaxed mb-5 last:mb-0">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2.5 mb-6 text-base sm:text-lg text-[#E7E7E7] marker:text-[#FFB900]">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2.5 mb-6 text-base sm:text-lg text-[#E7E7E7] marker:text-[#FFB900]">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold text-white">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-[#9496A1]">{children}</em>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[#FFB900] bg-[#0E1015] py-3 px-5 rounded-r-xl my-6 text-[#E7E7E7]">
                  {children}
                </blockquote>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Footer / Navigation */}
        <footer className="mt-10 pt-8 border-t border-[#262830] flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm sm:text-base text-[#FFB900] hover:underline transition-colors font-semibold"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            กลับไปหน้าบทความทั้งหมด
          </Link>
          <Link href="/products" className="v3-btn-white text-xs sm:text-sm">
            <span>เลือกชมคอลเลกชันเสื้อเชิ้ต</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </footer>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pt-8 sm:pt-12 border-t border-[#262830] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white">บทความอื่นๆ ที่น่าสนใจ</h2>
            <Link
              href="/blog"
              className="text-sm font-semibold text-[#FFB900] hover:underline inline-flex items-center gap-1"
            >
              <span>ดูทั้งหมด</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <Link key={related.slug} href={`/blog/${related.slug}`} className="group block h-full">
                <Card className="h-full p-0 gap-0 ring-0 overflow-hidden rounded-2xl border border-[#262830] hover:border-[#FFB900]/40 bg-[#13161D] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0E1015]">
                    <Image
                      src={related.imageUrl}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <CardContent className="flex-1 p-5 flex flex-col bg-[#13161D]">
                    <div className="flex items-center gap-2 text-xs mb-2.5">
                      <Badge
                        variant="default"
                        className="bg-[#FFB900]/15 text-[#FFB900] border border-[#FFB900]/30 hover:bg-[#FFB900]/25 px-2.5 py-0.5 text-[11px] font-semibold"
                      >
                        {related.category}
                      </Badge>
                      <span className="text-[#9496A1]">•</span>
                      <time dateTime={related.date} className="text-[#9496A1]">
                        {new Date(related.date).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold leading-snug mb-2 text-white group-hover:text-[#FFB900] transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-[#9496A1] text-xs sm:text-sm line-clamp-2 mb-4 flex-1">
                      {related.excerpt}
                    </p>
                    <div className="mt-auto">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#FFB900] group-hover:translate-x-1 transition-transform">
                        <span>อ่านต่อ</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
