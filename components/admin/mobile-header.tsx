"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_ITEMS, type NavItem } from "./sidebar-nav";

interface MobileHeaderProps {
  role: string;
  name: string;
  email: string;
}

export default function MobileHeader({ role, name, email }: MobileHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const visibleItems: NavItem[] = (NAV_ITEMS as NavItem[]).filter(
    (item: NavItem) => !item.roles || item.roles.includes(role)
  );

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 bg-sidebar border-b border-sidebar-border">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-60 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border flex flex-col"
        >
          {/* Logo */}
          <div className="px-5 py-4 border-b border-sidebar-border shrink-0">
            <Link
              href="/admin/dashboard"
              onClick={() => setOpen(false)}
              className="font-bold text-lg tracking-tight text-white"
            >
              HBI Admin
            </Link>
            <p className="text-xs text-white/50 mt-0.5">Highbury International</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {visibleItems.map((item: NavItem) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-sidebar-border">
            <div className="text-xs text-white/50 mb-0.5 truncate">{name}</div>
            <div className="text-xs text-white/30 truncate mb-2">{email}</div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10 gap-2"
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/admin/login" });
              }}
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/admin/dashboard" className="font-bold text-white tracking-tight">
        HBI Admin
      </Link>
    </header>
  );
}
