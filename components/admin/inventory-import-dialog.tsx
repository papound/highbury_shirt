"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Upload, Loader2, CheckCircle, XCircle, PackagePlus, History } from "lucide-react";
import { toast } from "sonner";
import { useGlobalLoading } from "@/components/admin/global-loading-provider";

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

type HistoryItem = {
  id: string;
  delta: number;
  note: string;
  inventory: {
    variant: { sku: string; color: string; size: string; product: { nameTh: string } };
  };
};

type HistoryBatch = {
  batchId: string;
  createdAt: string;
  createdBy: { name: string | null; email: string | null } | null;
  totalItems: number;
  totalQty: number;
  items: HistoryItem[];
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function InventoryImportDialog() {
  const [open, setOpen] = useState(false);
  const { setGlobalLoading } = useGlobalLoading();
  const [tab, setTab] = useState<"import" | "history">("import");
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [history, setHistory] = useState<HistoryBatch[]>([]);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<{ id: string; name: string; uniqueKey: string }[]>([]);
  const [warehouseId, setWarehouseId] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  // ดึงรายชื่อคลังเมื่อ dialog เปิด
  useEffect(() => {
    if (open) {
      fetch("/api/admin/warehouses")
        .then((res) => res.json())
        .then((data) => setWarehouses(data ?? []));
    }
  }, [open]);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/admin/inventory/import-master");
      const data = await res.json();
      if (res.ok) setHistory(data.batches ?? []);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && tab === "history") fetchHistory();
  }, [open, tab, fetchHistory]);

  function reset() {
    setStep("upload");
    setFile(null);
    setPreview(null);
    setResult(null);
    setWarehouseId("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleClose() {
    setOpen(false);
    setTimeout(reset, 300);
  }

  async function handlePreview() {
    if (!file || !warehouseId) return;
    setLoading(true);
    setGlobalLoading(true, "กำลังโหลดตัวอย่าง...");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("warehouseId", warehouseId);
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
      setGlobalLoading(false);
    }
  }

  async function handleImport() {
    if (!file || !warehouseId) return;
    setLoading(true);
    setGlobalLoading(true, "กำลัง Import สต็อก...");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("warehouseId", warehouseId);
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
      setGlobalLoading(false);
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <PackagePlus className="w-4 h-4 mr-2" />
        Import สต็อกเข้าคลัง
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="max-w-[95vw] sm:max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] flex flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Import สต็อกเข้าคลัง
            </DialogTitle>
          </DialogHeader>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "import" | "history")} className="flex flex-col flex-1 min-h-0">
            <TabsList className="mb-4 shrink-0">
              <TabsTrigger value="import"><Upload className="w-3.5 h-3.5 mr-1.5" />Import</TabsTrigger>
              <TabsTrigger value="history" onClick={fetchHistory}>
                <History className="w-3.5 h-3.5 mr-1.5" />ประวัติ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="mt-0 flex-1 overflow-y-auto min-h-0">
          {/* ── Step 1: Upload ── */}
          {step === "upload" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                อัปโหลดไฟล์ Excel ที่มีคอลัมน์: <code className="bg-muted px-1 rounded">SKU</code>{" "}
                <code className="bg-muted px-1 rounded">จำนวน</code>{" "}
                <code className="bg-muted px-1 rounded">หมายเหตุ (optional)</code>
              </p>
              <div>
                <label className="block mb-1 text-sm font-medium">เลือกคลังปลายทาง <span className="text-destructive">*</span></label>
                <select
                  className="w-full border rounded px-3 py-2 text-sm mb-2"
                  value={warehouseId}
                  onChange={e => setWarehouseId(e.target.value)}
                  required
                >
                  <option value="">-- เลือกคลัง --</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.uniqueKey})</option>
                  ))}
                </select>
              </div>
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
                <Button onClick={handlePreview} disabled={!file || !warehouseId || loading}>
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
                <Button onClick={() => { handleClose(); window.location.reload(); fetchHistory(); }}>เสร็จสิ้น</Button>
              </div>
            </div>
          )}
            </TabsContent>

            {/* ── History Tab ── */}
            <TabsContent value="history" className="mt-0 flex-1 overflow-y-auto min-h-0">
              {historyLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">ยังไม่มีประวัติการ Import</p>
              ) : (
                <div className="border rounded-lg overflow-hidden text-sm divide-y">
                  {history.map((batch) => (
                    <div key={batch.batchId}>
                      {/* Batch summary row */}
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/20 text-left"
                        onClick={() => setExpandedBatch(expandedBatch === batch.batchId ? null : batch.batchId)}
                      >
                        <span className="text-muted-foreground">
                          {expandedBatch === batch.batchId ? "▼" : "▶"}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground w-[120px] shrink-0">
                          {batch.batchId}
                        </span>
                        <span className="grow">
                          <span className="font-medium">
                            {batch.createdBy?.name ?? batch.createdBy?.email ?? "—"}
                          </span>
                        </span>
                        <Badge variant="secondary" className="shrink-0">{batch.totalItems} รายการ</Badge>
                        <Badge variant="outline" className="shrink-0">+{batch.totalQty} ชิ้น</Badge>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {new Date(batch.createdAt).toLocaleDateString("th-TH")}{" "}
                          {new Date(batch.createdAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </button>

                      {/* Expanded items */}
                      {expandedBatch === batch.batchId && (
                        <div className="bg-muted/10 border-t">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                            <thead>
                              <tr className="bg-muted/30 border-b">
                                <th className="text-left px-4 py-1.5 font-medium text-muted-foreground text-xs">สินค้า / SKU</th>
                                <th className="text-left px-3 py-1.5 font-medium text-muted-foreground text-xs">สี / ไซส์</th>
                                <th className="text-center px-3 py-1.5 font-medium text-muted-foreground text-xs">จำนวน</th>
                                <th className="text-left px-3 py-1.5 font-medium text-muted-foreground text-xs">หมายเหตุ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {batch.items.map((item) => {
                                const userNote = item.note.replace(/^IMPORT:WH-MAIN1 \| BATCH:[A-Z0-9-]+( \| )?/, "").trim();
                                return (
                                  <tr key={item.id} className="border-b last:border-0">
                                    <td className="px-4 py-1.5">
                                      <p className="font-medium text-xs">{item.inventory.variant.product.nameTh}</p>
                                      <p className="text-xs text-muted-foreground">{item.inventory.variant.sku}</p>
                                    </td>
                                    <td className="px-3 py-1.5 text-xs text-muted-foreground">
                                      {item.inventory.variant.color} / {item.inventory.variant.size}
                                    </td>
                                    <td className="px-3 py-1.5 text-center">
                                      <Badge variant="secondary" className="text-xs">+{item.delta}</Badge>
                                    </td>
                                    <td className="px-3 py-1.5 text-xs text-muted-foreground">
                                      {userNote || "—"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Preview Table ─────────────────────────────────────────────────────────────

function PreviewTable({ items, isNew }: { items: PreviewItem[]; isNew: boolean }) {
  return (
    <div className="border rounded-lg overflow-x-auto text-sm">
      <table className="w-full min-w-[640px]">
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
