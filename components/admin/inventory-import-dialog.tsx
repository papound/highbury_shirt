"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Upload, Loader2, CheckCircle, XCircle, PackagePlus } from "lucide-react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

type PreviewItem = {
  sku: string;
  quantity: number;
  note?: string;
  productName: string;
  color: string;
  size: string;
  currentStock: number;
  isNew: boolean;
};

type PreviewResult = {
  warehouseId: string;
  warehouseName: string;
  newItems: PreviewItem[];
  existingItems: PreviewItem[];
  unknownSkus: string[];
};

type ImportResult = {
  created: number;
  updated: number;
  skipped: string[];
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function InventoryImportDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function reset() {
    setStep("upload");
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleClose() {
    setOpen(false);
    setTimeout(reset, 300);
  }

  async function handlePreview() {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/inventory/import-master?action=preview", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPreview(data);
      setStep("preview");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  async function handleImport() {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/inventory/import-master?action=import", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setStep("done");
      toast.success(`นำเข้าสำเร็จ — สร้างใหม่ ${data.created} / เพิ่มเติม ${data.updated}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <PackagePlus className="w-4 h-4 mr-2" />
        Import สต็อก Master
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Import สต็อกเข้าคลัง Master (WH-MASTER)
            </DialogTitle>
          </DialogHeader>

          {/* ── Step 1: Upload ── */}
          {step === "upload" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                อัปโหลดไฟล์ Excel ที่มีคอลัมน์: <code className="bg-muted px-1 rounded">SKU</code>{" "}
                <code className="bg-muted px-1 rounded">จำนวน</code>{" "}
                <code className="bg-muted px-1 rounded">หมายเหตุ (optional)</code>
              </p>
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="mx-auto w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : "คลิกเพื่อเลือกไฟล์ .xlsx"}
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={handleClose}>ยกเลิก</Button>
                <Button onClick={handlePreview} disabled={!file || loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  ตรวจสอบข้อมูล
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 2: Preview ── */}
          {step === "preview" && preview && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">
                คลัง: <span className="font-medium text-foreground">{preview.warehouseName}</span>
              </p>

              {/* Unknown SKUs */}
              {preview.unknownSkus.length > 0 && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 space-y-1">
                  <p className="text-sm font-medium text-destructive flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> SKU ไม่พบในระบบ ({preview.unknownSkus.length})
                  </p>
                  <p className="text-xs text-muted-foreground">แถวเหล่านี้จะถูกข้าม</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {preview.unknownSkus.map((s) => (
                      <Badge key={s} variant="destructive" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* New items */}
              {preview.newItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1 text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    สินค้าใหม่ (Init) — {preview.newItems.length} รายการ
                  </h4>
                  <PreviewTable items={preview.newItems} isNew />
                </div>
              )}

              {/* Existing items */}
              {preview.existingItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1 text-blue-600">
                    <CheckCircle className="w-4 h-4" />
                    สินค้าเดิม (เพิ่มจำนวน) — {preview.existingItems.length} รายการ
                  </h4>
                  <PreviewTable items={preview.existingItems} isNew={false} />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="ghost" onClick={() => setStep("upload")}>กลับ</Button>
                <Button
                  onClick={handleImport}
                  disabled={loading || (preview.newItems.length + preview.existingItems.length === 0)}
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  ยืนยัน Import (
                  {preview.newItems.length + preview.existingItems.length} รายการ)
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Done ── */}
          {step === "done" && result && (
            <div className="space-y-4 text-center py-4">
              <CheckCircle className="mx-auto w-12 h-12 text-emerald-500" />
              <div>
                <p className="text-lg font-semibold">Import สำเร็จ!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  สร้างใหม่ <span className="font-medium text-emerald-600">{result.created}</span> รายการ
                  {" · "}
                  เพิ่มจำนวน <span className="font-medium text-blue-600">{result.updated}</span> รายการ
                  {result.skipped.length > 0 && (
                    <> · ข้าม <span className="font-medium text-destructive">{result.skipped.length}</span> รายการ</>
                  )}
                </p>
              </div>
              {result.skipped.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1">
                  {result.skipped.map((s) => (
                    <Badge key={s} variant="destructive" className="text-xs">{s}</Badge>
                  ))}
                </div>
              )}
              <div className="flex justify-center gap-2 pt-2">
                <Button variant="outline" onClick={() => { reset(); }}>Import อีกครั้ง</Button>
                <Button onClick={() => { handleClose(); window.location.reload(); }}>เสร็จสิ้น</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Preview Table ─────────────────────────────────────────────────────────────

function PreviewTable({ items, isNew }: { items: PreviewItem[]; isNew: boolean }) {
  return (
    <div className="border rounded-lg overflow-hidden text-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/40 border-b">
            <th className="text-left px-3 py-2 font-medium text-muted-foreground">สินค้า / SKU</th>
            <th className="text-left px-3 py-2 font-medium text-muted-foreground">สี / ไซส์</th>
            {!isNew && (
              <th className="text-center px-3 py-2 font-medium text-muted-foreground">Stock เดิม</th>
            )}
            <th className="text-center px-3 py-2 font-medium text-muted-foreground">นำเข้า</th>
            {!isNew && (
              <th className="text-center px-3 py-2 font-medium text-muted-foreground">หลังเพิ่ม</th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.sku} className="border-b last:border-0 hover:bg-muted/10">
              <td className="px-3 py-2">
                <p className="font-medium">{item.productName}</p>
                <p className="text-xs text-muted-foreground">{item.sku}</p>
              </td>
              <td className="px-3 py-2 text-muted-foreground">{item.color} / {item.size}</td>
              {!isNew && (
                <td className="px-3 py-2 text-center">
                  <Badge variant="outline">{item.currentStock}</Badge>
                </td>
              )}
              <td className="px-3 py-2 text-center">
                <Badge variant={isNew ? "secondary" : "default"}>+{item.quantity}</Badge>
              </td>
              {!isNew && (
                <td className="px-3 py-2 text-center">
                  <Badge variant="secondary">{item.currentStock + item.quantity}</Badge>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
