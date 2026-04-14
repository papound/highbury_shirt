import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { blogPosts } from "@/lib/mock-blog";

export const metadata = {
  title: "บทความ",
  description: "อ่านบทความและเคล็ดลับดีๆ เกี่ยวกับเสื้อเชิ้ต การแต่งตัว และการดูแลรักษา",
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 space-y-12">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">บทความของเรา</h1>
        <p className="text-lg text-muted-foreground">
          สาระน่ารู้ เคล็ดลับการแต่งตัว และเบื้องหลังการผลิตเสื้อเชิ้ตคุณภาพ
        </p>
      </section>

      {/* Featured / First Post */}
      {blogPosts.length > 0 && (
        <section>
          <Link href={`/blog/${blogPosts[0].slug}`} className="group block">
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all md:grid md:grid-cols-2">
              <div className="relative h-64 md:h-full w-full">
                <Image
                  src={blogPosts[0].imageUrl}
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <CardContent className="p-8 md:p-12 flex flex-col justify-center bg-slate-50 group-hover:bg-slate-100/50 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                      {blogPosts[0].category}
                    </Badge>
                    <time dateTime={blogPosts[0].date} className="text-muted-foreground font-medium">
                      {new Date(blogPosts[0].date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold group-hover:text-blue-700 transition-colors line-clamp-2">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="pt-2">
                    <span className="font-semibold text-blue-600 group-hover:text-blue-800">
                      อ่านต่อ →
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
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
              <Card className="h-full overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardContent className="flex-1 p-6 flex flex-col bg-white">
                  <div className="flex items-center gap-3 text-xs mb-3">
                    <span className="font-medium text-blue-600">{post.category}</span>
                    <span className="text-slate-300">•</span>
                    <time dateTime={post.date} className="text-muted-foreground">
                      {new Date(post.date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto">
                    <span className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                      อ่านต่อ
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
