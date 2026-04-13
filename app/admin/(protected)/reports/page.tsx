import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminReportsChart from "@/components/admin/reports-chart";
import AdminReportsExport from "@/components/admin/reports-export";

async function getReportData() {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { year: d.getFullYear(), month: d.getMonth() + 1, date: d };
  });

  const [salesByMonth, topProducts, orderStatusCounts] = await Promise.all([
    Promise.all(
      months.map(async ({ year, month, date }) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        const result = await prisma.order.aggregate({
          where: {
            createdAt: { gte: start, lt: end },
            status: { notIn: ["CANCELLED", "PAYMENT_REJECTED"] },
          },
          _sum: { total: true },
          _count: true,
        });
        return {
          month: date.toLocaleDateString("th-TH", { month: "short", year: "2-digit" }),
          revenue: result._sum.total ?? 0,
          orders: result._count,
        };
      })
    ),
    prisma.orderItem.groupBy({
      by: ["variantId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    }).then(async (rows) => {
      const variantIds = rows.map((r) => r.variantId);
      const variants = await prisma.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: true },
      });
      return rows.map((r) => {
        const v = variants.find((v) => v.id === r.variantId);
        return { name: v?.product.nameTh ?? r.variantId, qty: r._sum.quantity ?? 0 };
      });
    }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
  ]);

  return { salesByMonth, topProducts, orderStatusCounts };
}

export default async function AdminReportsPage() {
  const data = await getReportData();

  const totalRevenue = data.salesByMonth.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = data.salesByMonth.reduce((s, m) => s + m.orders, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">รายงาน</h1>
        <AdminReportsExport />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">รายได้รวม (6 เดือน)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">คำสั่งซื้อรวม (6 เดือน)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">ยอดขายรายเดือน</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminReportsChart data={data.salesByMonth} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">สินค้าขายดี</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-5 text-muted-foreground text-xs">{i + 1}.</span>
                    {p.name}
                  </span>
                  <span className="font-medium">{p.qty} ชิ้น</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">สถานะคำสั่งซื้อ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.orderStatusCounts.map((s) => (
                <div key={s.status} className="flex items-center justify-between text-sm">
                  <span>{s.status}</span>
                  <span className="font-medium">{s._count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
