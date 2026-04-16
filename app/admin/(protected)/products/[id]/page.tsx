import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AdminProductForm from "@/components/admin/product-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  const [product, categories, warehouses] = await Promise.all([
    isNew
      ? null
      : prisma.product.findUnique({
          where: { id },
          include: {
            images: { where: { variantId: null }, orderBy: { sortOrder: "asc" } },
            variants: {
              include: {
                inventory: { include: { warehouse: true } },
                images: { orderBy: { sortOrder: "asc" } },
              },
            },
            category: true,
          },
        }),
    prisma.category.findMany({ orderBy: { nameTh: "asc" } }),
    prisma.warehouse.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  if (!isNew && !product) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{isNew ? "เพิ่มสินค้าใหม่" : `แก้ไข: ${product!.nameTh}`}</h1>
      <AdminProductForm product={product} categories={categories} warehouses={warehouses} />
    </div>
  );
}
