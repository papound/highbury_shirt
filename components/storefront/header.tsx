import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import HeaderActions from "@/components/storefront/header-actions";

const navLinks = [
  { href: "/products", labelTh: "สินค้า", labelEn: "Products" },
  { href: "/blog", labelTh: "บทความ", labelEn: "Blog" },
  { href: "/about", labelTh: "เกี่ยวกับเรา", labelEn: "About" },
];

export default async function StorefrontHeader({
  locale = "th",
}: {
  locale?: "th" | "en";
}) {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start items-center">
          <Link href="/" className="flex items-center gap-2 shrink-0 transition-opacity hover:opacity-90">
            <Image
              src="/images/logo/highbury-logo.png"
              alt="Highbury International"
              width={160}
              height={55}
              className="object-contain h-10 md:h-12 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex flex-none items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-[15px] font-medium text-slate-600 hover:text-blue-700 transition-colors py-2 group"
            >
              {locale === "th" ? link.labelTh : link.labelEn}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100 ease-out duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end">
          <HeaderActions locale={locale} isLoggedIn={!!session?.user} />
        </div>
      </div>
    </header>
  );
}