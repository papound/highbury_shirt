import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[#0A2540] text-white text-[13px] py-2 px-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left / Center Message */}
        <div className="flex-1 flex items-center justify-center md:justify-start gap-2 text-center md:text-left">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 text-xs">
            <Sparkles className="w-3 h-3" />
          </span>
          <span className="font-medium text-white/95">
            <strong className="font-semibold text-amber-300">โปรโมชั่นพิเศษ:</strong>{" "}
            สั่งซื้อเสื้อเชิ้ต 3 ตัว แถมฟรี 1 ตัวทันที
          </span>
          <span className="hidden lg:inline text-white/40">|</span>
          <span className="hidden lg:inline text-white/80">
            เปลี่ยนไซส์ได้ฟรีภายใน 7 วัน
          </span>
        </div>

        {/* Right Action */}
        <div className="hidden sm:flex items-center gap-4 text-xs shrink-0">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-white/90 hover:text-white transition-[color] duration-150 underline-offset-4 hover:underline"
          >
            <span>ช้อปเลย</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
