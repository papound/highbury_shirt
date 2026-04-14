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
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PackageMinus, Loader2, History, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Warehouse = { id: string; name: string; uniqueKey: string; [k: string]: any };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InventoryItem = { id: string; variantId: string; warehouseId: string; quantity: number; variant: any; warehouse: any };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WithdrawalRecord = { id: string; createdAt: string; quantity: number; reason?: string; warehouse: any; variant: any; performedBy: any };

interface Props {
  warehouses: Warehouse[];
  inventory: InventoryItem[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InventoryWithdrawDialog({ warehouses, inventory }: Props) {
  const [open, setOpen] = useState(false);

  // ── Withdraw form state ───────────────────────────────────────────────────
  const [warehouseId, setWarehouseId] = useState("");
  const [skuSearch, setSkuSearch] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  // ── Confirm step ──────────────────────────────────────────────────────────
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  // ── History ───────────────────────────────────────────────────────────────
  const [history, setHistory] = useState<WithdrawalRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const warehouseInventory = warehouseId
    ? inventory.filter((inv) => inv.warehouseId === warehouseId)
    : [];

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

  function requestWithdraw() {
    if (!warehouseId || !selectedVariantId || !quantity) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) { toast.error("จำนวนต้องมากกว่า 0"); return; }
    if (selectedInv && qty > selectedInv.quantity) {
      toast.error(`Stock ไม่เพียงพอ (มี ${selectedInv.quantity})`);
      return;
    }
    setConfirmOpen(true);
  }

  async function executeWithdraw() {
    const qty = parseInt(quantity);
    setWithdrawing(true);
    try {
      const res = await fetch("/api/admin/inventory/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warehouseId, variantId: selectedVariantId, quantity: qty, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "เบิกล้มเหลว");
      toast.success("เบิกสินค้าสำเร็จ");
      setConfirmOpen(false);
      setWarehouseId(""); setSkuSearch(""); setSelectedVariantId(""); setQuantity(""); setReason("");
      loadHistory();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setWithdrawing(false);
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <PackageMinus className="w-4 h-4 mr-1" />
        เบิกสินค้า
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
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
              <TabsTrigger value="withdraw" className="flex-1">เบิกสินค้า</TabsTrigger>
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

              <div>
                <label className="text-sm font-medium block mb-1">คลังสินค้า</label>
                <Select value={warehouseId} onValueChange={(v) => { setWarehouseId(v ?? ""); setSelectedVariantId(""); setSkuSearch(""); }}>
                  <SelectTrigger><SelectValue placeholder="เลือกคลังสินค้า" /></SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name} <span className="text-muted-foreground text-xs ml-1">[{w.uniqueKey}]</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {warehouseId && (
                <div>
                  <label className="text-sm font-medium block mb-1">ค้นหาสินค้า (SKU / ชื่อ)</label>
                  <Input
                    placeholder="พิมพ์ SKU หรือชื่อสินค้า..."
                    value={skuSearch}
                    onChange={(e) => { setSkuSearch(e.target.value); setSelectedVariantId(""); }}
                  />
                  {filteredItems.length > 0 && (
                    <div className="mt-2 border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                      {filteredItems.map((inv) => (
                        <button
                          key={inv.variantId}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/40 flex justify-between items-center ${selectedVariantId === inv.variantId ? "bg-primary/10 font-medium" : ""}`}
                          onClick={() => { setSelectedVariantId(inv.variantId); setSkuSearch(inv.variant.sku); }}
                        >
                          <span>
                            <span className="font-mono text-xs text-muted-foreground mr-2">{inv.variant.sku}</span>
                            {inv.variant.product.nameTh} — {inv.variant.color}/{inv.variant.size}
                          </span>
                          <Badge variant={inv.quantity <= 5 ? "destructive" : "secondary"} className="text-xs shrink-0">
                            {inv.quantity} ชิ้น
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedInv && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Stock ปัจจุบัน: <strong>{selectedInv.quantity} ชิ้น</strong>
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">จำนวนที่เบิก</label>
                  <Input type="number" min={1} placeholder="จำนวน" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">เหตุผล / หมายเหตุ</label>
                  <Input placeholder="เหตุผลการเบิก..." value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>
              </div>

              <Button
                variant="destructive"
                onClick={requestWithdraw}
                disabled={!warehouseId || !selectedVariantId || !quantity}
                className="w-full"
              >
                <PackageMinus className="w-4 h-4 mr-1" />
                เบิกสินค้า (ต้องยืนยันอีกครั้ง)
              </Button>
            </TabsContent>

            {/* ── History ──────────────────────────────────────────────── */}
            <TabsContent value="history" className="pt-2">
              {historyLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">ยังไม่มีประวัติการเบิก</p>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b bg-muted/40">
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">วันที่</th>
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">สินค้า (SKU)</th>
                          <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">จำนวน</th>
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">คลัง</th>
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">เหตุผล</th>
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">เบิกโดย</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((h) => (
                          <tr key={h.id} className="border-b last:border-0 hover:bg-muted/20">
                            <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                              {new Date(h.createdAt).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })}
                            </td>
                            <td className="px-3 py-2">
                              <div>{h.variant.product.nameTh}</div>
                              <div className="font-mono text-muted-foreground">{h.variant.sku}</div>
                              <div className="text-muted-foreground">{h.variant.color}/{h.variant.size}</div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className="font-semibold text-destructive">-{h.quantity}</span>
                            </td>
                            <td className="px-3 py-2">
                              <div>{h.warehouse.name}</div>
                              <div className="font-mono text-muted-foreground">[{h.warehouse.uniqueKey}]</div>
                            </td>
                            <td className="px-3 py-2 text-muted-foreground">{h.reason ?? "—"}</td>
                            <td className="px-3 py-2 text-muted-foreground">{h.performedBy.name ?? h.performedBy.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* ── Confirm Withdraw Dialog ────────────────────────────────────────── */}
      <Dialog open={confirmOpen} onOpenChange={(o) => !o && setConfirmOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-orange-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              ยืนยันการเบิกสินค้า
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <p>คุณกำลังเบิกสินค้าออกจากคลัง:</p>
            <div className="rounded-lg border bg-muted/40 px-4 py-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">สินค้า</span>
                <span className="font-medium text-right">
                  {selectedInv?.variant.product.nameTh}<br/>
                  <span className="font-mono text-xs text-muted-foreground">{selectedInv?.variant.sku}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">สี / ขนาด</span>
                <span>{selectedInv?.variant.color} / {selectedInv?.variant.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">คลัง</span>
                <span>{warehouses.find((w) => w.id === warehouseId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">จำนวนที่เบิก</span>
                <span className="font-bold text-destructive">-{quantity} ชิ้น</span>
              </div>
              {reason && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เหตุผล</span>
                  <span>{reason}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">การกระทำนี้จะลด Stock ถาวรและเก็บประวัติไว้</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={withdrawing}>ยกเลิก</Button>
            <Button variant="destructive" onClick={executeWithdraw} disabled={withdrawing}>
              {withdrawing ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />กำลังเบิก...</> : "ยืนยันเบิกสินค้า"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
