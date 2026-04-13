"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react";

const schema = z.object({
  titleTh: z.string().min(1, "กรุณาระบุหัวข้อ"),
  titleEn: z.string().min(1),
  excerpt: z.string().optional(),
  isPublished: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminBlogEditor({ post, authorId }: { post: any; authorId: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const isNew = !post;

  const editor = useEditor({
    extensions: [StarterKit],
    content: post?.contentTh ?? "<p>เขียนเนื้อหาที่นี่...</p>",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      titleTh: post?.titleTh ?? "",
      titleEn: post?.titleEn ?? "",
      excerpt: post?.excerpt ?? "",
      isPublished: post?.status === "PUBLISHED",
    },
  });

  async function onSubmit(values: FormValues) {
    setSaving(true);
    const content = editor?.getHTML() ?? "";
    try {
      const url = isNew ? "/api/admin/blog" : `/api/admin/blog/${post.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, contentTh: content, authorId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("บันทึกสำเร็จ");
      router.push("/admin/blog");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="titleTh" render={({ field }) => (
            <FormItem>
              <FormLabel>หัวข้อ (ไทย) *</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="titleEn" render={({ field }) => (
            <FormItem>
              <FormLabel>Title (English) *</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="excerpt" render={({ field }) => (
          <FormItem>
            <FormLabel>บทสรุปย่อ</FormLabel>
            <FormControl><Textarea rows={2} {...field} /></FormControl>
          </FormItem>
        )} />

        {/* Rich Text Editor */}
        <div className="space-y-2">
          <label className="text-sm font-medium">เนื้อหา</label>
          <div className="border rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={editor?.isActive("bold") ? "bg-muted" : ""}
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={editor?.isActive("italic") ? "bg-muted" : ""}
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor?.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
              >
                <Heading2 className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={editor?.isActive("bulletList") ? "bg-muted" : ""}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={editor?.isActive("orderedList") ? "bg-muted" : ""}
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
            </div>
            <EditorContent
              editor={editor}
              className="prose dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px]"
            />
          </div>
        </div>

        <FormField control={form.control} name="isPublished" render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            <FormLabel className="!mt-0">เผยแพร่</FormLabel>
          </FormItem>
        )} />

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>ยกเลิก</Button>
          <Button type="submit" disabled={saving}>{saving ? "กำลังบันทึก..." : "บันทึก"}</Button>
        </div>
      </form>
    </Form>
  );
}
