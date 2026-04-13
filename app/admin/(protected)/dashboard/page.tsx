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
      include: { items: true },
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">แดชบอร์ด</h1>
        <p className="text-muted-foreground text-sm">ยินดีต้อนรับ, {session.user.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">คำสั่งซื้อเดือนนี้</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.monthlyOrders}</div>
            <p className="text-xs text-muted-foreground">ทั้งหมด {data.totalOrders} คำสั่ง</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">ยอดขายเดือนนี้</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{data.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" /> รายได้เดือนปัจจุบัน
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">รอดำเนินการ</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">คำสั่งรอการยืนยัน</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">สินค้า Active</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProducts}</div>
            <p className="text-xs text-muted-foreground">รายการสินค้า</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">ยอดขาย 7 วันล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminSalesChart data={data.salesLast7Days} />
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">คำสั่งซื้อล่าสุด</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">หมายเลข</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">ลูกค้า</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">สินค้า</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">ยอดรวม</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => {
                  return (
                    <tr key={order.id} className="border-b hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono">#{order.orderNumber}</td>
                      <td className="px-4 py-3">{order.shippingName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{order.items.length} รายการ</td>
                      <td className="px-4 py-3 text-right">฿{order.total.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium border ${getStatusBadgeClass(order.status)}`}>{getStatusLabel(order.status)}</span>
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
