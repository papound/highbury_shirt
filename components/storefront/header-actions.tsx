"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, Menu, Globe, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="flex items-center justify-end gap-1 md:gap-2">
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors h-10 w-10"
        title={locale === "th" ? "เปลี่ยนโหมดสี" : "Toggle theme"}
      >
        {mounted && theme === "dark" ? (
          <Sun className="h-[20px] w-[20px] text-amber-400" />
        ) : (
          <Moon className="h-[20px] w-[20px] text-blue-500" />
        )}
      </Button>

      {/* Language Toggle */}
      <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-muted-foreground hover:text-primary hover:bg-muted rounded-full px-3">
        <Link href={locale === "th" ? "?lang=en" : "?lang=th"}>
          <Globe className="h-[18px] w-[18px] mr-1.5" />
          <span className="font-medium text-[13px]">{locale === "th" ? "EN" : "TH"}</span>
        </Link>
      </Button>

      {/* Cart */}
      <Button variant="ghost" size="icon" asChild className="relative rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors h-10 w-10">
        <Link href="/cart">
          <ShoppingCart className="h-[22px] w-[22px]" />
          <CartBadge />
        </Link>
      </Button>

      {/* User Account */}
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors h-10 w-10 focus-visible:outline-none">
            <User className="h-[22px] w-[22px]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 font-medium rounded-xl p-1.5 shadow-lg border-border">
            <DropdownMenuItem onClick={() => router.push("/account/orders")} className="rounded-lg cursor-pointer py-2.5">
              {locale === "th" ? "ออเดอร์ของฉัน" : "My Orders"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/account/profile")} className="rounded-lg cursor-pointer py-2.5">
              {locale === "th" ? "รายละเอียดบัญชี" : "Profile"}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border my-1" />
            <DropdownMenuItem
              className="text-rose-600 focus:bg-rose-500/10 focus:text-rose-600 rounded-lg cursor-pointer py-2.5"
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
        <Button size="sm" asChild className="ml-1 rounded-full px-4 bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm transition-all focus:ring-2 focus:ring-primary/20">
          <Link href="/admin/login">
            {locale === "th" ? "เข้าสู่ระบบ" : "Login"}
          </Link>
        </Button>
      )}

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger className="inline-flex md:hidden items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors h-10 w-10 ml-1 focus-visible:outline-none">
          <Menu className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6 border-l-0 shadow-2xl">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-start pb-6 mb-2 border-b border-border">
              {/* Optional: Add mobile logo or title here */}
              <span className="font-bold text-lg text-foreground">Menu</span>
            </div>
            
            <nav className="flex flex-col gap-2 flex-1 mt-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-foreground hover:text-primary hover:bg-muted px-4 py-3 rounded-xl transition-colors"
                >
                  {locale === "th" ? link.labelTh : link.labelEn}
                </Link>
              ))}
              
              <div className="h-px bg-border my-4" />
              
              {/* Language toggle for mobile */}
              <Link
                href={locale === "th" ? "?lang=en" : "?lang=th"}
                className="flex items-center text-base font-medium text-foreground hover:text-primary hover:bg-muted px-4 py-3 rounded-xl transition-colors"
              >
                <Globe className="h-5 w-5 mr-3 text-muted-foreground" />
                {locale === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
              </Link>
            </nav>
            
            {/* Optional footer for mobile menu */}
            <div className="mt-auto pt-6 text-xs text-center text-muted-foreground border-t border-border">
              © {new Date().getFullYear()} Highbury International
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
