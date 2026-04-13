"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminInventoryClient({ inventory, warehouses }: { inventory: any[]; warehouses: any[] }) {
  const [search, setSearch] = useState("");
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustValue, setAdjustValue] = useState("");
  const [adjustNote, setAdjustNote] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = inventory.filter((inv) => {
    const q = search.toLowerCase();
    return (
      inv.variant.product.nameTh.toLowerCase().includes(q) ||
      inv.variant.color.toLowerCase().includes(q) ||
      inv.variant.size.toLowerCase().includes(q) ||
      inv.variant.sku.toLowerCase().includes(q)
    );
  });

  async function handleAdjust(inventoryId: string) {
    const delta = parseInt(adjustValue);
    if (isNaN(delta)) { toast.error("กรุณากรอกตัวเลข"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventoryId, delta, note: adjustNote }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("ปรับ Stock สำเร็จ");
      setAdjustingId(null);
      setAdjustValue("");
      setAdjustNote("");
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาสินค้า, สี, ขนาด, SKU..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">สินค้า</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">สี / ขนาด</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">คลัง</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <p className="font-medium">{inv.variant.product.nameTh}</p>
                    <p className="text-xs text-muted-foreground">{inv.variant.sku}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: inv.variant.colorHex }}
                      />
                      <span>{inv.variant.color} / {inv.variant.size}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{inv.warehouse.name}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={inv.quantity <= 5 ? "destructive" : inv.quantity <= 20 ? "outline" : "secondary"}>
                      {inv.quantity}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {adjustingId === inv.id ? (
                      <div className="flex items-center gap-2 justify-end">
                        <Input
                          type="number"
                          placeholder="±ปริมาณ"
                          value={adjustValue}
                          onChange={(e) => setAdjustValue(e.target.value)}
                          className="w-24 h-8 text-sm"
                        />
                        <Input
                          placeholder="หมายเหตุ"
                          value={adjustNote}
                          onChange={(e) => setAdjustNote(e.target.value)}
                          className="w-32 h-8 text-sm"
                        />
                        <Button size="sm" disabled={loading} onClick={() => handleAdjust(inv.id)}>
                          บันทึก
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setAdjustingId(null)}>
                          ยกเลิก
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setAdjustingId(inv.id)}>
                        ปรับ Stock
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
