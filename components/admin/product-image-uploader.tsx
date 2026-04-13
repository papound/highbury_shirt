"use client";

import { useRef, useState } from "react";
import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const { uploadFiles } = genUploader<OurFileRouter>({ package: "custom" });

export interface ProductImage {
  url: string;
  isPrimary: boolean;
}

interface ProductImageUploaderProps {
  value: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

export default function ProductImageUploader({ value, onChange }: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFiles(files: File[]) {
    if (!files.length) return;
    setUploading(true);
    setProgress(0);
    try {
      const results = await uploadFiles("productImage", {
        files,
        onUploadProgress: ({ progress: p }) => setProgress(Math.round(p)),
      });
      const newImages: ProductImage[] = results.map((r) => ({
        url: r.ufsUrl ?? r.url,
        isPrimary: false,
      }));
      const merged = [...value, ...newImages];
      // If none is primary yet, set the first one as primary
      if (!merged.some((img) => img.isPrimary) && merged.length > 0) {
        merged[0].isPrimary = true;
      }
      onChange(merged);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(index: number) {
    const next = value.filter((_, i) => i !== index);
    // Re-assign primary if we removed the primary one
    if (value[index].isPrimary && next.length > 0) {
      next[0].isPrimary = true;
    }
    onChange(next);
  }

  function setPrimary(index: number) {
    onChange(value.map((img, i) => ({ ...img, isPrimary: i === index })));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    handleFiles(files);
  }

  return (
    <div className="space-y-3">
      {/* Thumbnails */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((img, i) => (
            <div key={img.url} className="relative group w-24 h-24 rounded-lg overflow-hidden border bg-muted">
              <Image src={img.url} alt={`รูปสินค้า ${i + 1}`} fill className="object-cover" />
              {/* Primary badge */}
              {img.isPrimary && (
                <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                  หลัก
                </div>
              )}
              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {!img.isPrimary && (
                  <button
                    type="button"
                    title="ตั้งเป็นรูปหลัก"
                    onClick={() => setPrimary(i)}
                    className="bg-white/20 hover:bg-white/30 rounded-md p-1.5 text-white transition-colors"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  title="ลบรูป"
                  onClick={() => remove(i)}
                  className="bg-red-500/80 hover:bg-red-500 rounded-md p-1.5 text-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
          uploading ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        {uploading ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">กำลังอัพโหลด...</p>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{progress}%</p>
          </div>
        ) : (
          <div className="space-y-2">
            <ImagePlus className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">ลากรูปมาวาง หรือคลิกเพื่อเลือกไฟล์</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP — สูงสุด 4MB/รูป, ได้สูงสุด 10 รูป</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="w-3.5 h-3.5 mr-1" />
              เลือกรูปภาพ
            </Button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(Array.from(e.target.files ?? []))}
      />
    </div>
  );
}
