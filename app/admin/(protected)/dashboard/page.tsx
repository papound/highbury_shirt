import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  Package,
  DollarSign,
  Clock,
  TrendingUp,
} from "lucide-react";
import AdminSalesChart from "@/components/admin/sales-chart";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF", "ACCOUNTANT"];

async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrders,
    pendingOrders,
    monthlyOrders,
    monthlyRevenue,
    totalProducts,
    recentOrders,
    salesLast7Days,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PENDING", "PAYMENT_UPLOADED"] } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        status: { notIn: ["CANCELLED", "PAYMENT_REJECTED"] },
      },
      _sum: { total: true },
    }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { items: true, user: { select: { name: true, email: true } } },
    }),
    prisma.order.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        status: { notIn: ["CANCELLED", "PAYMENT_REJECTED"] },
      },
      _sum: { total: true },
      _count: true,
    }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    monthlyOrders,
    monthlyRevenue: monthlyRevenue._sum.total ?? 0,
    totalProducts,
    recentOrders,
    salesLast7Days,
  };
}

import { getStatusLabel, getStatusBadgeClass } from "@/lib/order-status";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) redirect("/admin/login");

  const data = await getDashboardData();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">แดชบอร์ด</h1>
          <p className="text-muted-foreground mt-1">ยินดีต้อนรับกลับมา, {session.user.name} สำรวจภาพรวมร้านค้าของคุณวันนี้</p>
        </div>
        <Badge variant="outline" className="w-fit text-blue-600 border-blue-200 bg-blue-50 px-3 py-1">
          อัปเดตล่าสุด: {new Date().toLocaleDateString("th-TH")}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border shadow-sm bg-card overflow-hidden relative group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full border-blue-500/10 group-hover:scale-110 transition-transform"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">คำสั่งซื้อเริ่มเดือนนี้</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 shadow-sm border border-blue-500/20">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-3xl font-bold text-foreground tracking-tight">{data.monthlyOrders}</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">รวมทั้งหมด {data.totalOrders} คำสั่ง</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-card overflow-hidden relative group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full border-emerald-500/10 group-hover:scale-110 transition-transform"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">ยอดขายเดือนนี้</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-3xl font-bold text-foreground tracking-tight">฿{data.monthlyRevenue.toLocaleString()}</div>
            <div className="text-xs font-semibold mt-2 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 w-fit px-2 py-0.5 rounded-lg border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" /> <span>แนวโน้มยอดขาย</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-card overflow-hidden relative group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full border-amber-500/10 group-hover:scale-110 transition-transform"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">รอดำเนินการ</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 shadow-sm border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-foreground tracking-tight">{data.pendingOrders}</div>
              <span className="text-sm text-muted-foreground font-medium">รายการ</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">กำลังรอการยืนยันสถานะ</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-card overflow-hidden relative group hover:shadow-md transition-all">
           <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full border-purple-500/10 group-hover:scale-110 transition-transform"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">สินค้าเปิดขาย (Active)</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 shadow-sm border border-purple-500/20">
              <Package className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
             <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-foreground tracking-tight">{data.totalProducts}</div>
              <span className="text-sm text-muted-foreground font-medium">ชิ้น</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">สินค้าพร้อมขายบนหน้าเว็บ</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart placeholder */}
      <Card className="border shadow-sm bg-card">
        <CardHeader className="border-b border-border bg-muted/20">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
             <TrendingUp className="w-4 h-4 text-blue-600" /> ยอดขาย 7 วันล่าสุด
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <AdminSalesChart data={data.salesLast7Days} />
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="border shadow-sm bg-card overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/20">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
            <ShoppingCart className="w-4 h-4 text-blue-600" /> คำสั่งซื้อล่าสุด
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>หมายเลข</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead className="hidden md:table-cell">สินค้า</TableHead>
                <TableHead className="text-right">ยอดรวม</TableHead>
                <TableHead className="text-center">สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentOrders.map((order) => {
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs font-semibold text-muted-foreground">#{order.orderNumber}</TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{order.shippingName}</div>
                      {order.user ? (
                        <div className="text-xs text-muted-foreground">{order.user.name || order.user.email}</div>
                      ) : (
                        <div className="text-xs text-muted-foreground">ผู้เยี่ยมชม</div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell font-medium">
                      {order.items.length} <span className="text-xs">รายการ</span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      ฿{order.total.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadgeClass(order.status)}`}>{getStatusLabel(order.status)}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
