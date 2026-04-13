import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function StorefrontFooter({ locale = "th" }: { locale?: "th" | "en" }) {
  return (
    <footer className="bg-[var(--brand-dark)] text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Image
              src="/images/logo/highbury-logo-white.png"
              alt="Highbury International"
              width={140}
              height={48}
              className="object-contain mb-4"
            />
            <p className="text-white/70 text-sm leading-relaxed">
              {locale === "th"
                ? "เสื้อเชิ้ตสำเร็จรูปคุณภาพสูง สำหรับผู้ชายและผู้หญิง รับผลิต-สั่งทำ OEM ตอบโจทย์ทุกความต้องการ"
                : "Premium ready-made shirts for men and women. Custom OEM manufacturing available."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">
              {locale === "th" ? "ลิงค์ด่วน" : "Quick Links"}
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/products" className="hover:text-white transition-colors">{locale === "th" ? "สินค้าทั้งหมด" : "All Products"}</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">{locale === "th" ? "บทความ" : "Blog"}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{locale === "th" ? "เกี่ยวกับเรา" : "About Us"}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">
              {locale === "th" ? "ติดต่อเรา" : "Contact Us"}
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Phone className="h-3 w-3 shrink-0" />
                <a href="tel:028968066" className="hover:text-white transition-colors">02-896-8066 ต่อ 9</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3 w-3 shrink-0" />
                <a href="mailto:thong_than@hotmail.com" className="hover:text-white transition-colors">
                  thong_than@hotmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                <span>{locale === "th" ? "กรุงเทพมหานคร ประเทศไทย" : "Bangkok, Thailand"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Highbury International.{" "}
          {locale === "th" ? "สงวนลิขสิทธิ์" : "All rights reserved."}
        </div>
      </div>
    </footer>
  );
}
