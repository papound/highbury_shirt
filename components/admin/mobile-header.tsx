"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LogOut, Menu, AlertTriangle } from "lucide-react";
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
  const [confirmLogout, setConfirmLogout] = useState(false);

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
          <div className="px-6 py-5 border-b border-sidebar-border/50 shrink-0 flex items-center justify-between">
            <div>
              <Link
                href="/admin/dashboard"
                onClick={() => setOpen(false)}
                className="font-bold text-xl tracking-tight text-white flex items-center gap-2"
              >
                <div className="bg-brand-blue w-8 h-8 rounded-md flex items-center justify-center bg-blue-600 text-white shadow-sm">
                  H
                </div>
                HB Admin
              </Link>
              <p className="text-xs text-sidebar-foreground/60 mt-1 ml-10">Highbury International</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
            <div className="text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-3 px-2">Main Menu</div>
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
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                    active
                      ? "bg-blue-600/10 text-blue-400"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md" />
                  )}
                  <Icon className={cn(
                    "w-4 h-4 shrink-0 transition-colors", 
                    active ? "text-blue-500" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                  )} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border/50">
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm text-sm">
                {name ? name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="text-sm font-semibold text-sidebar-foreground truncate">{name}</div>
                <div className="text-xs text-sidebar-foreground/50 truncate flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                  {role}
                </div>
              </div>
            </div>

            {!confirmLogout ? (
              <button
                onClick={() => setConfirmLogout(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 group"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                ออกจากระบบ
              </button>
            ) : (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 space-y-2.5">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold">ยืนยันออกจากระบบ?</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setOpen(false); signOut({ callbackUrl: "/admin/login" }); }}
                    className="flex-1 py-1.5 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                  >
                    ออกจากระบบ
                  </button>
                  <button
                    onClick={() => setConfirmLogout(false)}
                    className="flex-1 py-1.5 text-xs font-semibold bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground rounded-md transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/admin/dashboard" className="font-bold text-white tracking-tight flex items-center gap-2">
        <div className="bg-brand-blue w-6 h-6 rounded-md flex items-center justify-center bg-blue-600 text-white shadow-sm text-xs">
          H
        </div>
        HB Admin
      </Link>
    </header>
  );
}
