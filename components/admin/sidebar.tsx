"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { LogOut, AlertTriangle } from "lucide-react";
import dynamic from "next/dynamic";
import { NAV_ITEMS } from "./sidebar-nav";
import { useState } from "react";

const MobileHeader = dynamic(() => import("./mobile-header"), { ssr: false });

interface AdminSidebarProps {
  role: string;
  name: string;
  email: string;
}

export default function AdminSidebar({ role, name, email }: AdminSidebarProps) {
  const pathname = usePathname();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  return (
    <>
      {/* ── Mobile top-bar (ssr:false to avoid Sheet portal hydration mismatch) ── */}
      <MobileHeader role={role} name={name} email={email} />

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-sidebar-border/50 flex items-center justify-between">
          <div>
            <Link href="/admin/dashboard" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
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
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
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
        {/* User footer */}
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

          {role === "SUPERADMIN" && process.env.NEXT_PUBLIC_GIT_REVISION && (
            <div className="px-1 mb-2">
              <span className="text-[10px] font-mono text-sidebar-foreground/30 select-all">
                rev {process.env.NEXT_PUBLIC_GIT_REVISION}
              </span>
            </div>
          )}

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
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
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
      </aside>
    </>
  );
}
