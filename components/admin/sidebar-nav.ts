import type { ComponentType } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Tag,
  BarChart3,
  BookOpen,
  Settings,
  Warehouse,
  Users,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  roles?: string[];
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/admin/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/admin/products", label: "สินค้า", icon: ShoppingBag },
  { href: "/admin/inventory", label: "คลังสินค้า", icon: Warehouse },
  { href: "/admin/orders", label: "คำสั่งซื้อ", icon: ShoppingCart },
  { href: "/admin/customers", label: "ลูกค้า", icon: Users },
  { href: "/admin/promotions", label: "โปรโมชั่น", icon: Tag },
  { href: "/admin/reports", label: "รายงาน", icon: BarChart3, roles: ["SUPERADMIN", "ADMIN", "ACCOUNTANT"] },
  { href: "/admin/blog", label: "บทความ", icon: BookOpen },
  { href: "/admin/settings", label: "ตั้งค่า", icon: Settings, roles: ["SUPERADMIN", "ADMIN"] },
];
