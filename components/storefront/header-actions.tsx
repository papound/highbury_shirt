"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, Menu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CartBadge from "@/components/storefront/cart-badge";

const navLinks = [
  { href: "/products", labelTh: "สินค้า", labelEn: "Products" },
  { href: "/blog", labelTh: "บทความ", labelEn: "Blog" },
  { href: "/about", labelTh: "เกี่ยวกับเรา", labelEn: "About" },
];

interface HeaderActionsProps {
  locale: "th" | "en";
  isLoggedIn: boolean;
}

export default function HeaderActions({ locale, isLoggedIn }: HeaderActionsProps) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      {/* Language Toggle */}
      <Button variant="ghost" size="sm" asChild>
        <Link href={locale === "th" ? "?lang=en" : "?lang=th"}>
          <Globe className="h-4 w-4 mr-1" />
          {locale === "th" ? "EN" : "TH"}
        </Link>
      </Button>

      {/* Cart */}
      <Button variant="ghost" size="icon" asChild className="relative">
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5" />
          <CartBadge />
        </Link>
      </Button>

      {/* User Account */}
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-9 w-9 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <User className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/account/orders")}>
              {locale === "th" ? "ออเดอร์ของฉัน" : "My Orders"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/account/profile")}>
              {locale === "th" ? "โปรไฟล์" : "Profile"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                await fetch("/api/auth/signout", { method: "POST" });
                window.location.href = "/";
              }}
            >
              {locale === "th" ? "ออกจากระบบ" : "Sign Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button size="sm" asChild>
          <Link href="/auth/login">
            {locale === "th" ? "เข้าสู่ระบบ" : "Login"}
          </Link>
        </Button>
      )}

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger className="inline-flex items-center justify-center rounded-md h-9 w-9 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden">
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="flex flex-col gap-4 mt-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium hover:text-primary"
              >
                {locale === "th" ? link.labelTh : link.labelEn}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
