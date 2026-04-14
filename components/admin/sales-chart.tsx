"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format, subDays } from "date-fns";
import { th } from "date-fns/locale";

interface SalesRow {
  createdAt: Date;
  _sum: { total: number | null };
  _count: number;
}

interface Props {
  data: SalesRow[];
}

export default function AdminSalesChart({ data }: Props) {
  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const key = format(date, "yyyy-MM-dd");
      const match = data.find((d) => format(new Date(d.createdAt), "yyyy-MM-dd") === key);
      return {
        date: format(date, "d MMM", { locale: th }),
        revenue: match?._sum.total ?? 0,
        orders: match?._count ?? 0,
      };
    });
    return days;
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(v) => [`฿${Number(v).toLocaleString()}`, "ยอดขาย"]}
          labelStyle={{ fontWeight: 500 }}
        />
        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
