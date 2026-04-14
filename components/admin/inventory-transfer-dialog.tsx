"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightLeft,
  Upload,
  Loader2,
  History,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Warehouse = { id: string; name: string; uniqueKey: string; [k: string]: any };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InventoryItem = { id: string; variantId: string; warehouseId: string; quantity: number; variant: any; warehouse: any };
type TransferRecord = {
  id: string;
  transactionId?: string;
  createdAt: string;
  quantity: number;
  note?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fromWarehouse: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toWarehouse: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variant: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  performedBy: any;
};

interface StageItem {
  localId: string;
  variantId: string;
  sku: string;
  productName: string;
  color: string;
  size: string;
  available: number;
  quantity: number;
  note: string;
}

interface Props {
  warehouses: Warehouse[];
  inventory: InventoryItem[];
}

function generateTxnId(): string {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let rand = "";
  for (let i = 0; i < 6; i++) rand += chars[Math.floor(Math.random() * chars.length)];
  return `TXN-${date}-${rand}`;
}

export default function InventoryTransferDialog({ warehouses, inventory }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [fromWH, setFromWH] = useState("");
  const [toWH, setToWH] = useState("");
  const [txnId, setTxnId] = useState(() => generateTxnId());
  const [skuSearch, setSkuSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [stageItems, setStageItems] = useState<StageItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState("");
  const [editNote, setEditNote] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [importFromWH, setImportFromWH] = useState("");
  const [importToWH, setImportToWH] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{ sku: string; quantity: number; note?: string; status: string }[] | null>(null);
  const [history, setHistory] = useState<TransferRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fromInventory = fromWH ? inventory.filter((i) => i.warehouseId === fromWH) : [];
  const filteredResults =
    skuSearch.trim().length >= 1
      ? fromInventory
          .filter(
            (inv) =>
              inv.variant.sku.toLowerCase().includes(skuSearch.toLowerCase()) ||
              inv.variant.product.nameTh.toLowerCase().includes(skuSearch.toLowerCase())
          )
          .slice(0, 8)
      : [];

  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/admin/inventory/transfer");
      const data = await res.json();
      setHistory(data);
    } catch {
      toast.error("โหลดประวัติล้มเหลว");
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    if (open) loadHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSearchBlur = useCallback(() => {
    setTimeout(() => setSearchOpen(false), 150);
  }, []);

  function addItem(inv: InventoryItem) {
    const existing = stageItems.find((s) => s.variantId === inv.variantId);
    if (existing) {
      setStageItems((prev) =>
        prev.map((s) =>
          s.variantId === inv.variantId
            ? { ...s, quantity: Math.min(s.quantity + 1, inv.quantity) }
            : s
        )
      );
      toast.info(`เพิ่มจำนวน ${inv.variant.sku}`);
    } else {
      setStageItems((prev) => [
        ...prev,
        {
          localId: crypto.randomUUID(),
          variantId: inv.variantId,
          sku: inv.variant.sku,
          productName: inv.variant.product.nameTh,
          color: inv.variant.color,
          size: inv.variant.size,
          available: inv.quantity,
          quantity: 1,
          note: "",
        },
      ]);
    }
    setSkuSearch("");
    setSearchOpen(false);
    searchRef.current?.focus();
  }

  function startEdit(item: StageItem) {
    setEditingId(item.localId);
    setEditQty(String(item.quantity));
    setEditNote(item.note);
  }

  function saveEdit(localId: string) {
    const qty = parseInt(editQty);
    const item = stageItems.find((s) => s.localId === localId);
    if (!item) return;
    if (isNaN(qty) || qty <= 0) { toast.error("จำนวนต้องมากกว่า 0"); return; }
    if (qty > item.available) { toast.error(`Stock ไม่พอ (มี ${item.available})`); return; }
    setStageItems((prev) =>
      prev.map((s) => (s.localId === localId ? { ...s, quantity: qty, note: editNote } : s))
    );
    setEditingId(null);
  }

  function cancelEdit() { setEditingId(null); }

  function removeItem(localId: string) {
    setStageItems((prev) => prev.filter((s) => s.localId !== localId));
    if (editingId === localId) setEditingId(null);
  }

  async function handleSubmitAll() {
    if (!fromWH || !toWH || stageItems.length === 0) return;
    setTransferring(true);
    let successCount = 0;
    const errors: string[] = [];
    for (const item of stageItems) {
      try {
        const res = await fetch("/api/admin/inventory/transfer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromWarehouseId: fromWH,
            toWarehouseId: toWH,
            variantId: item.variantId,
            quantity: item.quantity,
            note: item.note || null,
            transactionId: txnId,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "ล้มเหลว");
        successCount++;
      } catch (err) {
        errors.push(`${item.sku}: ${err instanceof Error ? err.message : "ล้มเหลว"}`);
      }
    }
    setTransferring(false);
    if (errors.length === 0) {
      toast.success(`โอนสำเร็จ ${successCount} รายการ · TXN: ${txnId}`);
    } else {
      toast.warning(`สำเร็จ ${successCount}, ล้มเหลว ${errors.length} รายการ`);
      errors.forEach((e) => toast.error(e));
    }
    setStageItems([]);
    setTxnId(generateTxnId());
    setFromWH("");
    setToWH("");
    loadHistory();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function executeImport() {
    if (!importFile || !importFromWH || !importToWH) {
      toast.error("กรุณาเลือกคลังและไฟล์");
      return;
    }
    setImporting(true);
    setImportResults(null);
    try {
      const fd = new FormData();
      fd.append("file", importFile);
      fd.append("fromWarehouseId", importFromWH);
      fd.append("toWarehouseId", importToWH);
      const res = await fetch("/api/admin/inventory/transfer/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "นำเข้าล้มเหลว");
      setImportResults(data.results);
      toast.success(`โอนสำเร็จ ${data.transferred} รายการ`);
      loadHistory();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setImporting(false);
    }
  }

  const historyGrouped = history.reduce<Map<string, TransferRecord[]>>((acc, h) => {
    const key = h.transactionId ?? `__${h.id}`;
    if (!acc.has(key)) acc.set(key, []);
    acc.get(key)!.push(h);
    return acc;
  }, new Map());

  const canSubmit = fromWH && toWH && stageItems.length > 0 && !editingId;
  const totalQty = stageItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <ArrowRightLeft className="w-4 h-4 mr-1" />
        โอนสินค้าข้ามคลัง
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-5xl w-[95vw] max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
              โอนสินค้าข้ามคลัง
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="manual">
            <TabsList className="w-full">
              <TabsTrigger value="manual" className="flex-1">
                โอนด้วยตนเอง
                {stageItems.length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 text-xs">
                    {stageItems.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="excel" className="flex-1">
                Import จาก Excel
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1" onClick={loadHistory}>
                <History className="w-3.5 h-3.5 mr-1" />
                ประวัติ
              </TabsTrigger>
            </TabsList>

            {/* ── Manual ── */}
            <TabsContent value="manual" className="space-y-4 pt-3">
              {/* Transaction ID bar */}
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 border px-3 py-2">
                <span className="text-xs text-muted-foreground shrink-0">Transaction ID:</span>
                <code className="text-sm font-mono font-semibold text-primary flex-1 select-all">
                  {txnId}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 shrink-0"
                  title="สร้าง ID ใหม่"
                  onClick={() => setTxnId(generateTxnId())}
                  disabled={stageItems.length > 0}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
                {stageItems.length > 0 && (
                  <span className="text-xs text-muted-foreground">(ล็อกขณะมีรายการ)</span>
                )}
              </div>

              {/* Warehouse selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">คลังต้นทาง</label>
                  <Select
                    value={fromWH}
                    onValueChange={(v) => {
                      setFromWH(v ?? "");
                      setStageItems([]);
                      setSkuSearch("");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      {fromWH ? (
                        <span className="flex-1 flex items-center gap-1.5 overflow-hidden">
                          <span className="truncate">{warehouses.find((w) => w.id === fromWH)?.name}</span>
                          <span className="text-muted-foreground text-xs font-mono shrink-0">[{warehouses.find((w) => w.id === fromWH)?.uniqueKey}]</span>
                        </span>
                      ) : (
                        <span className="flex-1 text-muted-foreground">เลือกคลังต้นทาง</span>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.name} [{w.uniqueKey}]
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">คลังปลายทาง</label>
                  <Select value={toWH} onValueChange={(v) => setToWH(v ?? "")}>
                    <SelectTrigger className="w-full">
                      {toWH ? (
                        <span className="flex-1 flex items-center gap-1.5 overflow-hidden">
                          <span className="truncate">{warehouses.find((w) => w.id === toWH)?.name}</span>
                          <span className="text-muted-foreground text-xs font-mono shrink-0">[{warehouses.find((w) => w.id === toWH)?.uniqueKey}]</span>
                        </span>
                      ) : (
                        <span className="flex-1 text-muted-foreground">เลือกคลังปลายทาง</span>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses
                        .filter((w) => w.id !== fromWH)
                        .map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.name} [{w.uniqueKey}]
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* SKU Search */}
              {fromWH && (
                <div className="relative">
                  <label className="text-sm font-medium block mb-1">
                    เพิ่มสินค้า{" "}
                    <span className="font-normal text-muted-foreground text-xs">
                      (ค้นหาด้วย SKU / ชื่อ)
                    </span>
                  </label>
                  <Input
                    ref={searchRef}
                    placeholder="พิมพ์ SKU หรือชื่อสินค้า..."
                    value={skuSearch}
                    onChange={(e) => {
                      setSkuSearch(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    onBlur={handleSearchBlur}
                    autoComplete="off"
                  />
                  {searchOpen && filteredResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 border rounded-lg bg-popover shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                      {filteredResults.map((inv) => {
                        const added = stageItems.some((s) => s.variantId === inv.variantId);
                        return (
                          <button
                            key={inv.variantId}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center justify-between gap-3"
                            onMouseDown={() => addItem(inv)}
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">
                                {inv.variant.sku}
                              </span>
                              <span className="truncate">{inv.variant.product.nameTh}</span>
                              <span className="text-muted-foreground text-xs shrink-0">
                                {inv.variant.color}/{inv.variant.size}
                              </span>
                            </span>
                            <span className="flex items-center gap-1.5 shrink-0">
                              <Badge
                                variant={inv.quantity <= 5 ? "destructive" : "secondary"}
                                className="text-xs"
                              >
                                {inv.quantity}
                              </Badge>
                              {added ? (
                                <span className="text-xs text-primary font-medium">+1</span>
                              ) : (
                                <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {searchOpen && skuSearch.trim().length > 0 && filteredResults.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 border rounded-lg bg-popover shadow-md px-4 py-3 text-sm text-muted-foreground">
                      ไม่พบสินค้าในคลังนี้
                    </div>
                  )}
                </div>
              )}

              {/* Staging table */}
              {stageItems.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground flex items-center justify-between">
                    <span>
                      {stageItems.length} รายการ · รวม {totalQty} ชิ้น
                    </span>
                    <button
                      className="text-destructive hover:underline text-xs"
                      onClick={() => {
                        setStageItems([]);
                        setEditingId(null);
                      }}
                    >
                      ล้างทั้งหมด
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/20 text-xs text-muted-foreground">
                          <th className="text-left px-3 py-2 w-8">#</th>
                          <th className="text-left px-3 py-2">SKU</th>
                          <th className="text-left px-3 py-2">สินค้า</th>
                          <th className="text-left px-3 py-2">สี / ขนาด</th>
                          <th className="text-center px-3 py-2">คงเหลือ</th>
                          <th className="text-center px-3 py-2">จำนวนโอน</th>
                          <th className="text-left px-3 py-2">หมายเหตุ</th>
                          <th className="w-16 px-2 py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {stageItems.map((item, idx) => {
                          const isEditing = editingId === item.localId;
                          return (
                            <tr
                              key={item.localId}
                              className="border-b last:border-0 hover:bg-muted/10"
                            >
                              <td className="px-3 py-2 text-muted-foreground text-xs">
                                {idx + 1}
                              </td>
                              <td className="px-3 py-2">
                                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                  {item.sku}
                                </span>
                              </td>
                              <td className="px-3 py-2 max-w-[150px]">
                                <span className="truncate block text-sm">{item.productName}</span>
                              </td>
                              <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                                {item.color} / {item.size}
                              </td>
                              <td className="px-3 py-2 text-center">
                                <Badge
                                  variant={item.available <= 5 ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  {item.available}
                                </Badge>
                              </td>
                              <td className="px-3 py-2 text-center">
                                {isEditing ? (
                                  <Input
                                    type="number"
                                    min={1}
                                    max={item.available}
                                    value={editQty}
                                    onChange={(e) => setEditQty(e.target.value)}
                                    className="h-7 w-20 text-xs text-center mx-auto"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") saveEdit(item.localId);
                                      if (e.key === "Escape") cancelEdit();
                                    }}
                                  />
                                ) : (
                                  <span
                                    className="cursor-pointer font-bold text-primary hover:bg-primary/10 px-2 py-0.5 rounded transition-colors"
                                    onClick={() => startEdit(item)}
                                    title="คลิกเพื่อแก้ไข"
                                  >
                                    {item.quantity}
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                {isEditing ? (
                                  <Input
                                    value={editNote}
                                    onChange={(e) => setEditNote(e.target.value)}
                                    placeholder="หมายเหตุ..."
                                    className="h-7 text-xs"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") saveEdit(item.localId);
                                      if (e.key === "Escape") cancelEdit();
                                    }}
                                  />
                                ) : (
                                  <span
                                    className="text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                                    onClick={() => startEdit(item)}
                                    title="คลิกเพื่อแก้ไข"
                                  >
                                    {item.note || <span className="italic opacity-40">—</span>}
                                  </span>
                                )}
                              </td>
                              <td className="px-2 py-2">
                                <div className="flex items-center justify-end gap-0.5">
                                  {isEditing ? (
                                    <>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 text-green-600"
                                        onClick={() => saveEdit(item.localId)}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6"
                                        onClick={cancelEdit}
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6"
                                        onClick={() => startEdit(item)}
                                      >
                                        <Pencil className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 text-destructive hover:text-destructive"
                                        onClick={() => removeItem(item.localId)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Submit all button */}
              {fromWH && toWH && (
                <Button
                  onClick={handleSubmitAll}
                  disabled={!canSubmit || transferring}
                  className="w-full"
                >
                  {transferring ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      กำลังโอน...
                    </>
                  ) : stageItems.length === 0 ? (
                    <>
                      <ArrowRightLeft className="w-4 h-4 mr-1" />
                      ยืนยันโอนสินค้า (ยังไม่มีรายการ)
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="w-4 h-4 mr-1" />
                      ยืนยันโอน {stageItems.length} รายการ · {totalQty} ชิ้น
                    </>
                  )}
                </Button>
              )}
            </TabsContent>

            {/* ── Excel ── */}
            <TabsContent value="excel" className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">คลังต้นทาง</label>
                  <Select value={importFromWH} onValueChange={(v) => setImportFromWH(v ?? "")}>
                    <SelectTrigger className="w-full">
                      {importFromWH ? (
                        <span className="flex-1 flex items-center gap-1.5 overflow-hidden">
                          <span className="truncate">{warehouses.find((w) => w.id === importFromWH)?.name}</span>
                          <span className="text-muted-foreground text-xs font-mono shrink-0">[{warehouses.find((w) => w.id === importFromWH)?.uniqueKey}]</span>
                        </span>
                      ) : (
                        <span className="flex-1 text-muted-foreground">เลือกคลังต้นทาง</span>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.name} [{w.uniqueKey}]
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">คลังปลายทาง</label>
                  <Select value={importToWH} onValueChange={(v) => setImportToWH(v ?? "")}>
                    <SelectTrigger className="w-full">
                      {importToWH ? (
                        <span className="flex-1 flex items-center gap-1.5 overflow-hidden">
                          <span className="truncate">{warehouses.find((w) => w.id === importToWH)?.name}</span>
                          <span className="text-muted-foreground text-xs font-mono shrink-0">[{warehouses.find((w) => w.id === importToWH)?.uniqueKey}]</span>
                        </span>
                      ) : (
                        <span className="flex-1 text-muted-foreground">เลือกคลังปลายทาง</span>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses
                        .filter((w) => w.id !== importFromWH)
                        .map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.name} [{w.uniqueKey}]
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div
                className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <FileSpreadsheet className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                {importFile ? (
                  <p className="text-sm font-medium">{importFile.name}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    คลิกเพื่อเลือกไฟล์ Excel (.xlsx/.xls)
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Format: คอลัมน์ 1=SKU, 2=จำนวน, 3=หมายเหตุ (ไม่บังคับ)
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />

              <Button
                onClick={executeImport}
                disabled={importing || !importFile || !importFromWH || !importToWH}
                className="w-full"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    กำลังนำเข้า...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1" />
                    เริ่มโอนสินค้า
                  </>
                )}
              </Button>

              {importResults && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
                    ผลการโอน
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left px-3 py-2">SKU</th>
                        <th className="text-center px-3 py-2">จำนวน</th>
                        <th className="text-left px-3 py-2">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importResults.map((r, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="px-3 py-1.5 font-mono">{r.sku}</td>
                          <td className="px-3 py-1.5 text-center">{r.quantity}</td>
                          <td className="px-3 py-1.5">
                            {r.status === "สำเร็จ" ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                {r.status}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-destructive">
                                <XCircle className="w-3 h-3" />
                                {r.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            {/* ── History ── */}
            <TabsContent value="history" className="pt-2">
              {historyLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  ยังไม่มีประวัติการโอน
                </p>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b bg-muted/40">
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Transaction ID</th>
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">วันที่</th>
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">สินค้า (SKU)</th>
                          <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">จำนวน</th>
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">จากคลัง</th>
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">ไปคลัง</th>
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">โดย</th>
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">หมายเหตุ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(historyGrouped.entries()).map(([txn, rows], groupIdx) => {
                          const isTxn = !txn.startsWith("__");
                          return rows.map((h, rowIdx) => (
                            <tr
                              key={h.id}
                              className={`border-b last:border-0 hover:bg-muted/20 ${groupIdx % 2 === 1 ? "bg-muted/5" : ""}`}
                            >
                              <td className="px-3 py-2 whitespace-nowrap">
                                {rowIdx === 0 && isTxn ? (
                                  <code className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                    {txn}
                                  </code>
                                ) : rowIdx === 0 ? (
                                  <span className="text-xs text-muted-foreground italic">—</span>
                                ) : (
                                  <span className="text-muted-foreground/30 pl-1.5">↳</span>
                                )}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                                {new Date(h.createdAt).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })}
                              </td>
                              <td className="px-3 py-2">
                                <div>{h.variant.product.nameTh}</div>
                                <div className="font-mono text-muted-foreground">{h.variant.sku}</div>
                                <div className="text-muted-foreground">{h.variant.color}/{h.variant.size}</div>
                              </td>
                              <td className="px-3 py-2 text-center font-semibold">{h.quantity}</td>
                              <td className="px-3 py-2">
                                <div>{h.fromWarehouse.name}</div>
                                <div className="font-mono text-muted-foreground">[{h.fromWarehouse.uniqueKey}]</div>
                              </td>
                              <td className="px-3 py-2">
                                <div>{h.toWarehouse.name}</div>
                                <div className="font-mono text-muted-foreground">[{h.toWarehouse.uniqueKey}]</div>
                              </td>
                              <td className="px-3 py-2 text-muted-foreground">{h.performedBy.name ?? h.performedBy.email}</td>
                              <td className="px-3 py-2 text-muted-foreground">{h.note ?? "—"}</td>
                            </tr>
                          ));
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
