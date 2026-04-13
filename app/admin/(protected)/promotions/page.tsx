import { prisma } from "@/lib/prisma";
import AdminPromotionsClient from "@/components/admin/promotions-client";

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">โปรโมชั่น</h1>
      <AdminPromotionsClient promotions={promotions} />
    </div>
  );
}
