"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";

export default function ProductClearButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const CONFIRM_WORD = "ลบทั้งหมด";

  async function handleClear() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "เกิดข้อผิดพลาด");
      toast.success(`ลบสินค้าทั้งหมดสำเร็จ (${data.deleted} รายการ)`);
      setOpen(false);
      setConfirm("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="shadow-sm border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        onClick={() => { setConfirm(""); setOpen(true); }}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        เคลียร์สินค้า
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              เคลียร์สินค้าทั้งหมด
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-sm text-rose-700 space-y-1">
              <p className="font-semibold">⚠️ การกระทำนี้ไม่สามารถย้อนกลับได้</p>
              <p>จะลบข้อมูลต่อไปนี้ออกทั้งหมด:</p>
              <ul className="list-disc pl-4 space-y-0.5 mt-1">
                <li>สินค้าทุกรายการ (Product)</li>
                <li>Variants ทั้งหมด</li>
                <li>ข้อมูล Stock / Inventory</li>
                <li>รูปสินค้า</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                พิมพ์ <span className="font-mono font-bold text-foreground bg-muted px-1.5 py-0.5 rounded">{CONFIRM_WORD}</span> เพื่อยืนยัน
              </p>
              <Input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={CONFIRM_WORD}
                className="font-mono"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              disabled={confirm !== CONFIRM_WORD || loading}
              onClick={handleClear}
            >
              {loading ? "กำลังลบ..." : "ยืนยัน ลบทั้งหมด"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
