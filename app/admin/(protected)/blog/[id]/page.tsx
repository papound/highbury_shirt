import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import AdminBlogEditor from "@/components/admin/blog-editor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogPostPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";
  const session = await auth();

  const post = isNew
    ? null
    : await prisma.blogPost.findUnique({ where: { id } });

  if (!isNew && !post) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{isNew ? "บทความใหม่" : "แก้ไขบทความ"}</h1>
      <AdminBlogEditor post={post} authorId={session?.user?.id ?? ""} />
    </div>
  );
}
