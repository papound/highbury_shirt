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
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/logo/highbury-logo.png"
            alt="Highbury International"
            width={140}
            height={48}
            className="object-contain h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {locale === "th" ? link.labelTh : link.labelEn}
            </Link>
          ))}
        </nav>

        {/* Right Actions (client component — handles cart badge, dropdown, mobile menu) */}
        <HeaderActions locale={locale} isLoggedIn={!!session?.user} />
      </div>
    </header>
  );
}