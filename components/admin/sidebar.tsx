"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Package,
  Tag,
  BarChart3,
  BookOpen,
  Settings,
  LogOut,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: string[];
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/admin/products", label: "สินค้า", icon: ShoppingBag },
  { href: "/admin/inventory", label: "คลังสินค้า", icon: Warehouse },
  { href: "/admin/orders", label: "คำสั่งซื้อ", icon: ShoppingCart },
  { href: "/admin/promotions", label: "โปรโมชั่น", icon: Tag },
  { href: "/admin/reports", label: "รายงาน", icon: BarChart3, roles: ["SUPERADMIN", "ADMIN", "ACCOUNTANT"] },
  { href: "/admin/blog", label: "บทความ", icon: BookOpen },
  { href: "/admin/settings", label: "ตั้งค่า", icon: Settings, roles: ["SUPERADMIN", "ADMIN"] },
];

interface AdminSidebarProps {
  role: string;
  name: string;
  email: string;
}

export default function AdminSidebar({ role, name, email }: AdminSidebarProps) {
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  return (
    <aside className="w-60 shrink-0 flex flex-col h-screen border-r bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-sidebar-border">
        <Link href="/admin/dashboard" className="font-bold text-lg tracking-tight text-white">
          HBI Admin
        </Link>
        <p className="text-xs text-white/50 mt-0.5">Highbury International</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
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

      {/* User footer */}
      <div className="px-4 py-3 border-t border-sidebar-border">
        <div className="text-xs text-white/50 mb-0.5 truncate">{name}</div>
        <div className="text-xs text-white/30 truncate mb-2">{email}</div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10 gap-2"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="w-4 h-4" />
          ออกจากระบบ
        </Button>
      </div>
    </aside>
  );
}
