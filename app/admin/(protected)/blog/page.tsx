import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">บทความ</h1>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4 mr-1" /> เขียนบทความ
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">ยังไม่มีบทความ</p>
        )}
        {posts.map((post) => (
          <div key={post.id} className="border rounded-xl p-4 bg-card flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{post.titleTh}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {post.author?.name} · {new Date(post.createdAt).toLocaleDateString("th-TH")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
                {post.status === "PUBLISHED" ? "เผยแพร่" : "Draft"}
              </Badge>
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/blog/${post.id}`}>แก้ไข</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
