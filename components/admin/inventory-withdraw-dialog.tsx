"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PackageMinus, Loader2, History, AlertTriangle, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useGlobalLoading } from "@/components/admin/global-loading-provider";

// ─── Types ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Warehouse = { id: string; name: string; uniqueKey: string; [k: string]: any };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InventoryItem = { id: string; variantId: string; warehouseId: string; quantity: number; variant: any; warehouse: any };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WithdrawalRecord = { id: string; transactionId?: string; createdAt: string; quantity: number; reason?: string; warehouse: any; variant: any; performedBy: any };
type WithdrawLineItem = { variantId: string; quantity: number };

interface Props {
  warehouses: Warehouse[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InventoryWithdrawDialog({ warehouses }: Props) {
  const [open, setOpen] = useState(false);
  const { setGlobalLoading } = useGlobalLoading();

  // ── Withdraw form state ───────────────────────────────────────────────────
  const [warehouseId, setWarehouseId] = useState("");
  const [skuSearch, setSkuSearch] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [itemQty, setItemQty] = useState("");
  const [lineItems, setLineItems] = useState<WithdrawLineItem[]>([]);
  const [reason, setReason] = useState("");

  // ── Inventory (lazy-loaded per warehouse) ─────────────────────────────────
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  // ── Confirm step ──────────────────────────────────────────────────────────
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  // ── History ───────────────────────────────────────────────────────────────
  const [history, setHistory] = useState<WithdrawalRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  async function fetchWarehouseInventory(whId: string) {
    setInventoryLoading(true);
    try {
      const res = await fetch(`/api/admin/inventory/items?warehouseId=${whId}`);
      const data = await res.json();
      setInventory(data);
    } catch {
      toast.error("โหลดข้อมูลสินค้าล้มเหลว");
    } finally {
      setInventoryLoading(false);
    }
  }

  const warehouseInventory = inventory;

  const filteredItems = skuSearch
    ? warehouseInventory.filter(
        (inv) =>
          inv.variant.sku.toLowerCase().includes(skuSearch.toLowerCase()) ||
          inv.variant.product.nameTh.toLowerCase().includes(skuSearch.toLowerCase())
      )
    : warehouseInventory;

  const selectedInv = warehouseInventory.find((inv) => inv.variantId === selectedVariantId);

  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/admin/inventory/withdraw");
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

  function addLineItem() {
    if (!selectedVariantId || !itemQty) { toast.error("กรุณาเลือกสินค้าและระบุจำนวน"); return; }
    const qty = parseInt(itemQty);
    if (isNaN(qty) || qty <= 0) { toast.error("จำนวนต้องมากกว่า 0"); return; }
    if (selectedInv && qty > selectedInv.quantity) {
      toast.error(`Stock ไม่เพียงพอ (มี ${selectedInv.quantity})`);
      return;
    }
    setLineItems((prev) => {
      const existing = prev.find((li) => li.variantId === selectedVariantId);
      if (existing) {
        return prev.map((li) => li.variantId === selectedVariantId ? { ...li, quantity: qty } : li);
      }
      return [...prev, { variantId: selectedVariantId, quantity: qty }];
    });
    setSelectedVariantId("");
    setSkuSearch("");
    setItemQty("");
  }

  function removeLineItem(variantId: string) {
    setLineItems((prev) => prev.filter((li) => li.variantId !== variantId));
  }

  function requestWithdraw() {
    if (!warehouseId || lineItems.length === 0) {
      toast.error("กรุณาเลือกคลังและเพิ่มสินค้าอย่างน้อย 1 รายการ");
      return;
    }
    setConfirmOpen(true);
  }

  async function executeWithdraw() {
    setWithdrawing(true);
    setGlobalLoading(true, "กำลังเบิกสินค้า...");
    try {
      const res = await fetch("/api/admin/inventory/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warehouseId, items: lineItems, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "เบิกล้มเหลว");
      toast.success(`เบิกสินค้าสำเร็จ ${lineItems.length} รายการ`);
      setConfirmOpen(false);
      setWarehouseId(""); setSkuSearch(""); setSelectedVariantId(""); setItemQty(""); setLineItems([]); setReason(""); setInventory([]);
      loadHistory();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setWithdrawing(false);
      setGlobalLoading(false);
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <PackageMinus className="w-4 h-4 mr-1" />
        เบิกสินค้า
      </Button>

      <Dialog open={open} onOpenChange={(o) => {
        if (!o) {
          setWarehouseId(""); setSkuSearch(""); setSelectedVariantId(""); setItemQty(""); setLineItems([]); setReason(""); setInventory([]);
        }
        setOpen(o);
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackageMinus className="w-5 h-5 text-orange-600" />
              เบิกสินค้าออกจากคลัง
              <Badge variant="destructive" className="text-xs ml-1">Super Admin</Badge>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="withdraw">
            <TabsList className="w-full">
              <TabsTrigger value="withdraw" className="flex-1">
                เบิกสินค้า
                {lineItems.length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 text-xs">{lineItems.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1" onClick={loadHistory}>
                <History className="w-3.5 h-3.5 mr-1" />ประวัติการเบิก
              </TabsTrigger>
            </TabsList>

            {/* ── Withdraw Form ────────────────────────────────────────── */}
            <TabsContent value="withdraw" className="space-y-4 pt-2">
              <div className="rounded-lg bg-orange-50 text-orange-800 dark:bg-orange-950/30 dark:text-orange-300 px-4 py-3 text-sm flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>การเบิกสินค้าจะลด Stock ออกจากคลังถาวร กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน</span>
              </div>

              {/* Warehouse selector */}
              <div>
                <label className="text-sm font-medium block mb-1">คลังสินค้า</label>
                <Select value={warehouseId} onValueChange={(v) => { setWarehouseId(v ?? ""); setSelectedVariantId(""); setSkuSearch(""); setLineItems([]); setInventory([]); if (v) fetchWarehouseInventory(v); }}>
                  <SelectTrigger>
                    {warehouseId ? (
                      <span className="flex items-center gap-1.5 overflow-hidden">
                        <span className="truncate">{warehouses.find((w) => w.id === warehouseId)?.name}</span>
                        <span className="text-muted-foreground text-xs font-mono shrink-0">[{warehouses.find((w) => w.id === warehouseId)?.uniqueKey}]</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">เลือกคลังสินค้า</span>
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

              {/* Item search + add */}
              {warehouseId && inventoryLoading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {warehouseId && !inventoryLoading && (
                <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">เพิ่มรายการสินค้า</p>
                  <Input
                    placeholder="พิมพ์ SKU หรือชื่อสินค้า..."
                    value={skuSearch}
                    onChange={(e) => { setSkuSearch(e.target.value); setSelectedVariantId(""); }}
                  />
                  {filteredItems.length > 0 && (
                    <div className="border rounded-lg overflow-hidden max-h-44 overflow-y-auto bg-background">
                      {filteredItems.map((inv) => {
                        const alreadyAdded = lineItems.some((li) => li.variantId === inv.variantId);
                        return (
                          <button
                            key={inv.variantId}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/40 flex justify-between items-center ${selectedVariantId === inv.variantId ? "bg-primary/10 font-medium" : ""}`}
                            onClick={() => { setSelectedVariantId(inv.variantId); setSkuSearch(inv.variant.sku); }}
                          >
                            <span>
                              <span className="font-mono text-xs text-muted-foreground mr-2">{inv.variant.sku}</span>
                              {inv.variant.product.nameTh} — {inv.variant.color}/{inv.variant.size}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {alreadyAdded && <Badge variant="outline" className="text-xs text-green-600 border-green-600">✓</Badge>}
                              <Badge variant={inv.quantity <= 5 ? "destructive" : "secondary"} className="text-xs">
                                {inv.quantity} ชิ้น
                              </Badge>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {selectedInv && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground truncate">
                          <span className="font-mono mr-1">{selectedInv.variant.sku}</span>
                          {selectedInv.variant.product.nameTh} — {selectedInv.variant.color}/{selectedInv.variant.size}
                          <span className="ml-1 font-medium text-foreground">(Stock: {selectedInv.quantity})</span>
                        </p>
                      </div>
                      <Input
                        type="number"
                        min={1}
                        max={selectedInv.quantity}
                        placeholder="จำนวน"
                        className="w-24 shrink-0"
                        value={itemQty}
                        onChange={(e) => setItemQty(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addLineItem()}
                      />
                      <Button size="sm" onClick={addLineItem} className="shrink-0">
                        <Plus className="w-3.5 h-3.5 mr-1" />เพิ่ม
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Line items list */}
              {lineItems.length > 0 && (
                <div>
                  <label className="text-sm font-medium block mb-1.5">รายการที่จะเบิก ({lineItems.length} รายการ)</label>
                  <div className="border rounded-lg overflow-hidden">
                    {lineItems.map((li, idx) => {
                      const inv = warehouseInventory.find((i) => i.variantId === li.variantId);
                      return (
                        <div key={li.variantId} className={`flex items-center gap-2 px-3 py-2 text-sm ${idx < lineItems.length - 1 ? "border-b" : ""}`}>
                          <div className="flex-1 min-w-0">
                            <span className="font-mono text-xs text-muted-foreground mr-2">{inv?.variant.sku}</span>
                            <span className="text-sm">{inv?.variant.product.nameTh} — {inv?.variant.color}/{inv?.variant.size}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Input
                              type="number"
                              min={1}
                              max={inv?.quantity}
                              className="w-20 h-7 text-xs"
                              value={li.quantity}
                              onChange={(e) => {
                                const q = parseInt(e.target.value);
                                if (!isNaN(q) && q > 0) {
                                  setLineItems((prev) => prev.map((x) => x.variantId === li.variantId ? { ...x, quantity: q } : x));
                                }
                              }}
                            />
                            <span className="text-xs text-muted-foreground">/{inv?.quantity}</span>
                            <button
                              className="text-destructive hover:text-destructive/70 p-0.5"
                              onClick={() => removeLineItem(li.variantId)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Shared reason */}
              <div>
                <label className="text-sm font-medium block mb-1">เหตุผล / หมายเหตุ</label>
                <Input placeholder="เหตุผลการเบิก..." value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>

              <Button
                variant="destructive"
                onClick={requestWithdraw}
                disabled={!warehouseId || lineItems.length === 0}
                className="w-full"
              >
                <PackageMinus className="w-4 h-4 mr-1" />
                เบิกสินค้า {lineItems.length > 0 ? `(${lineItems.length} รายการ)` : ""} — ต้องยืนยันอีกครั้ง
              </Button>
            </TabsContent>

            {/* ── History ──────────────────────────────────────────────── */}
            <TabsContent value="history" className="pt-2">
              {historyLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">ยังไม่มีประวัติการเบิก</p>
              ) : (
                <div className="space-y-3">
                  {/* Group by transactionId; records without one each form their own group */}
                  {Object.entries(
                    history.reduce<Record<string, WithdrawalRecord[]>>((acc, h) => {
                      const key = h.transactionId ?? h.id;
                      (acc[key] ??= []).push(h);
                      return acc;
                    }, {})
                  ).map(([txId, rows]) => {
                    const first = rows[0];
                    const totalQty = rows.reduce((s, r) => s + r.quantity, 0);
                    return (
                      <div key={txId} className="border rounded-lg overflow-hidden">
                        {/* Transaction header */}
                        <div className="bg-muted/40 px-3 py-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-b">
                          <span className="font-medium text-foreground">
                            {new Date(first.createdAt).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })}
                          </span>
                          <span>{first.warehouse.name} <span className="font-mono">[{first.warehouse.uniqueKey}]</span></span>
                          <span>เบิกโดย: {first.performedBy.name ?? first.performedBy.email}</span>
                          {first.reason && <span>เหตุผล: {first.reason}</span>}
                          <span className="ml-auto font-semibold text-destructive">รวม -{totalQty} ชิ้น</span>
                        </div>
                        {/* Line items */}
                        <table className="w-full text-xs">
                          <tbody>
                            {rows.map((h) => (
                              <tr key={h.id} className="border-b last:border-0 hover:bg-muted/10">
                                <td className="px-3 py-2">
                                  <div>{h.variant.product.nameTh}</div>
                                  <div className="font-mono text-muted-foreground">{h.variant.sku} · {h.variant.color}/{h.variant.size}</div>
                                </td>
                                <td className="px-3 py-2 text-right whitespace-nowrap">
                                  <span className="font-semibold text-destructive">-{h.quantity}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* ── Confirm Withdraw Dialog ────────────────────────────────────────── */}
      <Dialog open={confirmOpen} onOpenChange={(o) => !o && setConfirmOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-orange-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              ยืนยันการเบิกสินค้า
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>คลัง: <strong className="text-foreground">{warehouses.find((w) => w.id === warehouseId)?.name}</strong></span>
              <span>{lineItems.length} รายการ</span>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/40 border-b">
                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">สินค้า (SKU)</th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">เบิก</th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">คงเหลือ</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((li) => {
                    const inv = warehouseInventory.find((i) => i.variantId === li.variantId);
                    return (
                      <tr key={li.variantId} className="border-b last:border-0">
                        <td className="px-3 py-2">
                          <div>{inv?.variant.product.nameTh}</div>
                          <div className="font-mono text-muted-foreground">{inv?.variant.sku} · {inv?.variant.color}/{inv?.variant.size}</div>
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-destructive">-{li.quantity}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{(inv?.quantity ?? 0) - li.quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {reason && (
              <p className="text-xs text-muted-foreground">เหตุผล: <span className="text-foreground">{reason}</span></p>
            )}
            <p className="text-xs text-muted-foreground">การกระทำนี้จะลด Stock ถาวรและเก็บประวัติไว้</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={withdrawing}>ยกเลิก</Button>
            <Button variant="destructive" onClick={executeWithdraw} disabled={withdrawing}>
              {withdrawing ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />กำลังเบิก...</> : `ยืนยันเบิก ${lineItems.length} รายการ`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
