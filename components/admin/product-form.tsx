"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import ProductImageUploader, { type ProductImage } from "./product-image-uploader";

const DEFAULT_SIZES = ["SS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

const variantSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(1),
  colorHex: z.string().min(1),
  size: z.string().min(1),
  sku: z.string().min(1),
  price: z.coerce.number().positive(),
  inventoryByWarehouse: z.array(z.object({
    warehouseId: z.string(),
    quantity: z.coerce.number().min(0),
  })),
});

const schema = z.object({
  nameTh: z.string().min(1, "กรุณาระบุชื่อภาษาไทย"),
  name: z.string().min(1),
  descTh: z.string().optional(),
  description: z.string().optional(),
  basePrice: z.coerce.number().positive("ราคาต้องมากกว่า 0"),
  categoryId: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
  isFeatured: z.boolean(),
  variants: z.array(variantSchema),
});

type FormValues = z.infer<typeof schema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminProductForm({ product, categories, warehouses }: { product: any; categories: any[]; warehouses: any[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<ProductImage[]>(
    product?.images?.map((img: any) => ({ url: img.url, isPrimary: img.isPrimary })) ?? []
  );
  // Per-variant images indexed by variant position
  const [variantImagesMap, setVariantImagesMap] = useState<ProductImage[][]>(
    () => (product?.variants ?? []).map((v: any) =>
      (v.images ?? []).map((img: any) => ({ url: img.url, isPrimary: img.isPrimary }))
    )
  );
  const isNew = !product;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameTh: product?.nameTh ?? "",
      name: product?.name ?? "",
      descTh: product?.descTh ?? "",
      description: product?.description ?? "",
      basePrice: product?.basePrice ?? 0,
      categoryId: product?.categoryId ?? "",
      status: product?.status ?? "ACTIVE",
      isFeatured: product?.isFeatured ?? false,
      variants: product?.variants?.map((v: any) => ({
        id: v.id,
        color: v.color,
        colorHex: v.colorHex,
        size: v.size,
        sku: v.sku,
        price: v.price,
        inventoryByWarehouse: warehouses.map((wh: any) => ({
          warehouseId: wh.id,
          quantity: v.inventory?.find((inv: any) => inv.warehouseId === wh.id)?.quantity ?? 0,
        })),
      })) ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "variants" });

  function addVariant(defaults: Parameters<typeof append>[0]) {
    append(defaults);
    setVariantImagesMap((prev) => [...prev, []]);
  }

  function removeVariant(idx: number) {
    remove(idx);
    setVariantImagesMap((prev) => prev.filter((_, i) => i !== idx));
  }

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      const url = isNew ? "/api/admin/products" : `/api/admin/products/${product.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        ...values,
        images,
        variants: values.variants.map((v, i) => ({
          ...v,
          variantImages: variantImagesMap[i] ?? [],
        })),
      }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "บันทึกล้มเหลว");
      toast.success("บันทึกสำเร็จ");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Images */}
        <div className="border rounded-xl p-5 bg-card space-y-3">
          <h2 className="font-semibold">รูปภาพสินค้า</h2>
          <ProductImageUploader value={images} onChange={setImages} />
        </div>

        {/* Basic Info */}
        <div className="border rounded-xl p-5 bg-card space-y-4">
          <h2 className="font-semibold">ข้อมูลสินค้า</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="nameTh" render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อ (ภาษาไทย) *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อ (English) *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="descTh" render={({ field }) => (
            <FormItem>
              <FormLabel>รายละเอียด (ไทย)</FormLabel>
              <FormControl><Textarea rows={3} {...field} /></FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Description (English)</FormLabel>
              <FormControl><Textarea rows={3} {...field} /></FormControl>
            </FormItem>
          )} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="basePrice" render={({ field }) => (
              <FormItem>
                <FormLabel>ราคาเริ่มต้น (บาท) *</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="categoryId" render={({ field }) => (
              <FormItem>
                <FormLabel>หมวดหมู่ *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่">
                        {(val: string | null) => val ? (categories.find((c) => c.id === val)?.nameTh ?? val) : undefined}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id} label={c.nameTh}>{c.nameTh}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>สถานะ</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>
                        {(val: string | null) => val === "ACTIVE" ? "เปิดขาย" : val === "INACTIVE" ? "ปิดขาย" : val === "ARCHIVED" ? "เก็บเข้า Archive" : undefined}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE" label="เปิดขาย">เปิดขาย</SelectItem>
                    <SelectItem value="INACTIVE" label="ปิดขาย">ปิดขาย</SelectItem>
                    <SelectItem value="ARCHIVED" label="เก็บเข้า Archive">เก็บเข้า Archive</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            <FormField control={form.control} name="isFeatured" render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0">แนะนำบนหน้าหลัก</FormLabel>
              </FormItem>
            )} />
          </div>
        </div>

        {/* Variants */}
        <div className="border rounded-xl p-5 bg-card space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-semibold">Variants (สี/ขนาด)</h2>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <span className="text-xs text-muted-foreground hidden sm:inline">เพิ่มทุกขนาด:</span>
              {DEFAULT_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => addVariant({ color: "", colorHex: "#000000", size, sku: "", price: 0, inventoryByWarehouse: warehouses.map((wh: any) => ({ warehouseId: wh.id, quantity: 0 })) })}
                  className="text-xs px-2 py-1 border rounded-md hover:bg-muted transition-colors"
                >
                  {size}
                </button>
              ))}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addVariant({ color: "", colorHex: "#000000", size: "", sku: "", price: 0, inventoryByWarehouse: warehouses.map((wh: any) => ({ warehouseId: wh.id, quantity: 0 })) })}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                เพิ่ม Variant
              </Button>
            </div>
          </div>

          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มี Variant</p>
          )}

          <div className="space-y-3">
            {fields.map((f, idx) => (
              <div key={f.id} className="border rounded-lg p-3 bg-muted/20 space-y-3">
                <div className="grid grid-cols-6 gap-2 items-end">
                  <FormField control={form.control} name={`variants.${idx}.color`} render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs">สี</FormLabel>
                      <FormControl><Input {...field} placeholder="เช่น ขาว" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`variants.${idx}.colorHex`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">รหัสสี</FormLabel>
                      <FormControl>
                        <div className="flex gap-1">
                          <input type="color" {...field} className="w-10 h-9 rounded border cursor-pointer" />
                          <Input {...field} className="flex-1" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`variants.${idx}.size`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">ขนาด</FormLabel>
                      <FormControl>
                        <div>
                          <Input {...field} placeholder="SS/S/M/L" list="size-options" />
                          <datalist id="size-options">
                            {DEFAULT_SIZES.map((s) => <option key={s} value={s} />)}
                          </datalist>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`variants.${idx}.sku`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">SKU</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`variants.${idx}.price`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">ราคา</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <div className="flex justify-end">
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(idx)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {warehouses.length > 0 && (
                  <div className="border-t pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Stock ตามคลัง</p>
                    <div className="flex flex-wrap gap-3">
                      {warehouses.map((wh: any, whIdx: number) => (
                        <FormField
                          key={wh.id}
                          control={form.control}
                          name={`variants.${idx}.inventoryByWarehouse.${whIdx}.quantity`}
                          render={({ field }) => (
                            <FormItem className="w-32">
                              <FormLabel className="text-xs">{wh.name}</FormLabel>
                              <FormControl><Input type="number" min={0} {...field} /></FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Variant Images */}
                <div className="border-t pt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    รูปภาพสำหรับสีนี้
                    {form.watch(`variants.${idx}.color`) ? ` (${form.watch(`variants.${idx}.color`)})` : ""}
                  </p>
                  <ProductImageUploader
                    value={variantImagesMap[idx] ?? []}
                    onChange={(imgs) =>
                      setVariantImagesMap((prev) => {
                        const next = [...prev];
                        next[idx] = imgs;
                        return next;
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
            ยกเลิก
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
