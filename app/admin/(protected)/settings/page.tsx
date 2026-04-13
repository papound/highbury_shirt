import { prisma } from "@/lib/prisma";
import AdminSettingsClient from "@/components/admin/settings-client";

export default async function AdminSettingsPage() {
  const [users, warehouses, settings] = await Promise.all([
    prisma.user.findMany({
      where: { role: { not: "CUSTOMER" } },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.warehouse.findMany({ orderBy: { name: "asc" } }),
    prisma.siteSetting.findMany(),
  ]);

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-2xl font-bold">ตั้งค่า</h1>
      <AdminSettingsClient users={users} warehouses={warehouses} settingsMap={settingsMap} />
    </div>
  );
}
