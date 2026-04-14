import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        <Card className="border-none shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full border-blue-500/10 group-hover:scale-110 transition-transform"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
            <CardTitle className="text-sm font-medium text-slate-500">คำสั่งซื้อเริ่มเดือนนี้</CardTitle>
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600 shadow-sm border border-blue-100">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">{data.monthlyOrders}</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">รวมทั้งหมด {data.totalOrders} คำสั่ง</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full border-emerald-500/10 group-hover:scale-110 transition-transform"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
            <CardTitle className="text-sm font-medium text-slate-500">ยอดขายเดือนนี้</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 shadow-sm border border-emerald-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">฿{data.monthlyRevenue.toLocaleString()}</div>
            <div className="text-xs font-semibold mt-2 flex items-center gap-1.5 text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-lg border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5" /> <span>แนวโน้มยอดขาย</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full border-amber-500/10 group-hover:scale-110 transition-transform"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
            <CardTitle className="text-sm font-medium text-slate-500">รอดำเนินการ</CardTitle>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600 shadow-sm border border-amber-100">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-slate-900 tracking-tight">{data.pendingOrders}</div>
              <span className="text-sm text-slate-500 font-medium">รายการ</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">กำลังรอการยืนยันสถานะ</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-shadow">
           <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full border-purple-500/10 group-hover:scale-110 transition-transform"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
            <CardTitle className="text-sm font-medium text-slate-500">สินค้าเปิดขาย (Active)</CardTitle>
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600 shadow-sm border border-purple-100">
              <Package className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
             <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-slate-900 tracking-tight">{data.totalProducts}</div>
              <span className="text-sm text-slate-500 font-medium">ชิ้น</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">สินค้าพร้อมขายบนหน้าเว็บ</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart placeholder */}
      <Card className="border-none shadow-sm bg-white border border-slate-100">
        <CardHeader className="border-b border-slate-50 bg-slate-50/50">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
             <TrendingUp className="w-4 h-4 text-blue-600" /> ยอดขาย 7 วันล่าสุด
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <AdminSalesChart data={data.salesLast7Days} />
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="border-none shadow-sm bg-white border border-slate-100 overflow-hidden">
        <CardHeader className="border-b border-slate-50 bg-slate-50/50">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
            <ShoppingCart className="w-4 h-4 text-blue-600" /> คำสั่งซื้อล่าสุด
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/30 text-xs uppercase tracking-wider text-slate-500">
                  <th className="text-left px-5 py-4 font-semibold">หมายเลข</th>
                  <th className="text-left px-5 py-4 font-semibold">ลูกค้า</th>
                  <th className="text-left px-5 py-4 font-semibold hidden md:table-cell">สินค้า</th>
                  <th className="text-right px-5 py-4 font-semibold">ยอดรวม</th>
                  <th className="text-center px-5 py-4 font-semibold">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-600">#{order.orderNumber}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-900">{order.shippingName}</div>
                        {order.user ? (
                          <div className="text-xs text-muted-foreground">{order.user.name || order.user.email}</div>
                        ) : (
                          <div className="text-xs text-muted-foreground">ผู้เยี่ยมชม</div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell font-medium">
                        {order.items.length} <span className="text-xs">รายการ</span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-slate-900">
                        ฿{order.total.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadgeClass(order.status)}`}>{getStatusLabel(order.status)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
