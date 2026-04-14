import { blogPosts } from "@/lib/mock-blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
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

  return (
    <article className="container mx-auto px-4 py-12 md:py-20 space-y-12">
      {/* Header */}
      <header className="max-w-3xl mx-auto text-center space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge className="bg-blue-600 hover:bg-blue-700">{post.category}</Badge>
          <time dateTime={post.date} className="text-muted-foreground font-medium">
            {new Date(post.date).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-snug">
          {post.title}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      {/* Featured Image */}
      <figure className="relative aspect-video w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-xl">
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
        <div className="prose prose-slate prose-lg md:prose-xl max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight 
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-md
          prose-blockquote:border-l-blue-600 prose-blockquote:bg-blue-50/50 prose-blockquote:py-2 prose-blockquote:pr-6 prose-blockquote:rounded-r-lg
          prose-li:marker:text-blue-500"
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Footer / Navigation */}
        <footer className="mt-16 pt-8 border-t border-slate-200">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            กลับไปหน้าบทความทั้งหมด
          </Link>
        </footer>
      </div>
    </article>
  );
}
