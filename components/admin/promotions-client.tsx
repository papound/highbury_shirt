"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { useGlobalLoading } from "@/components/admin/global-loading-provider";

const schema = z.object({
  nameTh: z.string().min(1),
  nameEn: z.string().min(1),
  code: z.string().optional(),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING", "BUY_X_GET_Y"]),
  discountValue: z.coerce.number().min(0),
  minOrderAmount: z.coerce.number().min(0).optional(),
  maxDiscountAmount: z.coerce.number().min(0).optional(),
  buyQuantity: z.coerce.number().min(1).optional(),
  getQuantity: z.coerce.number().min(1).optional(),
  isActive: z.boolean(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  descriptionTh: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const TYPE_LABELS: Record<string, string> = {
  PERCENTAGE: "ลดเปอร์เซ็นต์",
  FIXED_AMOUNT: "ลดจำนวนเงิน",
  FREE_SHIPPING: "ส่งฟรี",
  BUY_X_GET_Y: "ซื้อ X แถม Y",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminPromotionsClient({ promotions: initialPromotions }: { promotions: any[] }) {
  const [promotions, setPromotions] = useState(initialPromotions);
  const { setGlobalLoading } = useGlobalLoading();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nameTh: "", nameEn: "", type: "PERCENTAGE", discountValue: 0, isActive: true },
  });

  function openCreate() {
    setEditing(null);
    form.reset({ nameTh: "", nameEn: "", type: "PERCENTAGE", discountValue: 0, isActive: true });
    setOpen(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function openEdit(promo: any) {
    setEditing(promo);
    form.reset({
      nameTh: promo.nameTh,
      nameEn: promo.nameEn ?? promo.name,
      code: promo.code ?? "",
      type: promo.type,
      discountValue: promo.discountValue ?? 0,
      minOrderAmount: promo.rules?.minOrderAmount ?? 0,
      maxDiscountAmount: promo.rules?.maxDiscountAmount ?? 0,
      buyQuantity: promo.rules?.buyQuantity ?? 1,
      getQuantity: promo.rules?.getQuantity ?? 1,
      isActive: promo.isActive,
      startsAt: promo.startsAt ? new Date(promo.startsAt).toISOString().slice(0, 10) : "",
      endsAt: promo.endsAt ? new Date(promo.endsAt).toISOString().slice(0, 10) : "",
      descriptionTh: promo.descriptionTh ?? "",
    });
    setOpen(true);
  }

  async function onSubmit(values: FormValues) {
    setSaving(true);
    setGlobalLoading(true, "กำลังบันทึกโปรโมชั่น...");
    try {
      const url = editing ? `/api/admin/promotions/${editing.id}` : "/api/admin/promotions";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("บันทึกสำเร็จ");
      setOpen(false);
      // Refresh list
      const listRes = await fetch("/api/admin/promotions");
      setPromotions(await listRes.json());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
      setGlobalLoading(false);
    }
  }

  async function deletePromo(id: string) {
    if (!confirm("ลบโปรโมชั่นนี้?")) return;
    await fetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    toast.success("ลบสำเร็จ");
  }

  const type = form.watch("type");

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1" /> เพิ่มโปรโมชั่น
        </Button>
      </div>

      <div className="space-y-3">
        {promotions.map((promo) => (
          <div key={promo.id} className="border rounded-xl p-4 bg-card flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium">{promo.nameTh}</p>
                <Badge variant={promo.isActive ? "default" : "secondary"}>
                  {promo.isActive ? "เปิดใช้" : "ปิด"}
                </Badge>
                <Badge variant="outline">{TYPE_LABELS[promo.type]}</Badge>
                {promo.code && (
                  <Badge variant="outline" className="font-mono">{promo.code}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {promo.type === "PERCENTAGE" && `ลด ${promo.discountValue}%`}
                {promo.type === "FIXED_AMOUNT" && `ลด ฿${promo.discountValue}`}
                {promo.type === "FREE_SHIPPING" && "ส่งฟรี"}
                {promo.type === "BUY_X_GET_Y" && `ซื้อ ${promo.rules?.buyQuantity ?? "?"} แถม ${promo.rules?.getQuantity ?? "?"}`}
              </p>
              {!promo.startsAt && !promo.endsAt ? (
                <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                  ถาวร
                </span>
              ) : (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {promo.startsAt && `เริ่ม ${new Date(promo.startsAt).toLocaleDateString("th-TH")}`}
                  {promo.startsAt && promo.endsAt && " – "}
                  {promo.endsAt && `สิ้นสุด ${new Date(promo.endsAt).toLocaleDateString("th-TH")}`}
                </p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => openEdit(promo)}>แก้ไข</Button>
              <Button size="sm" variant="ghost" onClick={() => deletePromo(promo.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "แก้ไขโปรโมชั่น" : "เพิ่มโปรโมชั่น"}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="nameTh" render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อ (ไทย) *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="nameEn" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (EN) *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>รหัสโปรโมชั่น (ไม่ต้องกรอกถ้าไม่มี code)</FormLabel>
                  <FormControl><Input placeholder="เช่น SUMMER20" {...field} /></FormControl>
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>ประเภท *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.entries(TYPE_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />

                {(type === "PERCENTAGE" || type === "FIXED_AMOUNT") && (
                  <FormField control={form.control} name="discountValue" render={({ field }) => (
                    <FormItem>
                      <FormLabel>ค่า ({type === "PERCENTAGE" ? "%" : "฿"})</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />
                )}
              </div>

              {type === "BUY_X_GET_Y" && (
                <div className="grid grid-cols-2 gap-3">
                  <FormField control={form.control} name="buyQuantity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>ซื้อกี่ชิ้น (X)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="getQuantity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>แถมกี่ชิ้น (Y)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="minOrderAmount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>ยอดขั้นต่ำ (฿)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="maxDiscountAmount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>ลดสูงสุด (฿)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="startsAt" render={({ field }) => (
                  <FormItem>
                    <FormLabel>เริ่ม</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="endsAt" render={({ field }) => (
                  <FormItem>
                    <FormLabel>สิ้นสุด</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="descriptionTh" render={({ field }) => (
                <FormItem>
                  <FormLabel>คำอธิบาย</FormLabel>
                  <FormControl><Textarea rows={2} {...field} /></FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="!mt-0">เปิดใช้งาน</FormLabel>
                </FormItem>
              )} />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
                <Button type="submit" disabled={saving}>{saving ? "กำลังบันทึก..." : "บันทึก"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
