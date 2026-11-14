import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[#163666] text-white text-[13px] py-2 px-4 border-b border-[#0A2B5E]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left message (still, clean text, no sparkles, no middle dots) */}
        <div className="flex-1 flex items-center justify-center md:justify-start gap-3 text-center md:text-left">
          <span className="font-semibold text-white">โปรโมชั่น:</span>
          <span className="text-white/95">
            สั่งซื้อเสื้อเชิ้ต 3 ตัว แถมฟรี 1 ตัว, บริการเปลี่ยนไซส์ฟรีภายใน 7 วัน
          </span>
        </div>

        {/* Right Action */}
        <div className="hidden sm:flex items-center gap-1 text-xs shrink-0">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-white/90 hover:text-white underline-offset-4 hover:underline"
          >
            <span>ดูสินค้าทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
