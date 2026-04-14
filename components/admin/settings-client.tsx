"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Check, X, Key } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: "Super Admin",
  ADMIN: "Admin",
  STAFF: "Staff",
  ACCOUNTANT: "บัญชี",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminSettingsClient({ users: initialUsers, warehouses: initialWarehouses, settingsMap }: { users: any[]; warehouses: any[]; settingsMap: Record<string, string> }) {
  const [users, setUsers] = useState(initialUsers);
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [promptpayId, setPromptpayId] = useState(settingsMap["promptpay_id"] ?? "");
  const [promptpayName, setPromptpayName] = useState(settingsMap["promptpay_name"] ?? "");
  const [newWarehouse, setNewWarehouse] = useState("");
  const [loading, setLoading] = useState(false);

  // Warehouse edit state
  const [editingWarehouseId, setEditingWarehouseId] = useState<string | null>(null);
  const [editingWarehouseName, setEditingWarehouseName] = useState("");

  // Delete confirm dialog state
  const [deleteWarehouseTarget, setDeleteWarehouseTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // New user form
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "STAFF" });

  async function saveSettings() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptpayId, promptpayName }),
      });
      if (!res.ok) throw new Error("บันทึกล้มเหลว");
      toast.success("บันทึกการตั้งค่าสำเร็จ");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  async function addUser() {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers((prev) => [...prev, data]);
      setNewUser({ name: "", email: "", password: "", role: "STAFF" });
      toast.success("เพิ่มผู้ใช้สำเร็จ");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  async function updateUserRole(userId: string, role: string) {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      toast.success("อัพเดท Role สำเร็จ");
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    }
  }

  async function addWarehouse() {
    if (!newWarehouse.trim()) return;
    try {
      const res = await fetch("/api/admin/warehouses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newWarehouse }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWarehouses((prev) => [...prev, data]);
      setNewWarehouse("");
      toast.success("เพิ่มคลังสำเร็จ");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    }
  }

  async function saveWarehouseName(warehouseId: string) {
    if (!editingWarehouseName.trim()) return;
    try {
      const res = await fetch(`/api/admin/warehouses/${warehouseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingWarehouseName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWarehouses((prev) => prev.map((w) => (w.id === warehouseId ? { ...w, name: data.name } : w)));
      setEditingWarehouseId(null);
      toast.success("แก้ไขชื่อคลังสำเร็จ");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    }
  }

  async function confirmDeleteWarehouse() {
    if (!deleteWarehouseTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/warehouses/${deleteWarehouseTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWarehouses((prev) => prev.filter((w) => w.id !== deleteWarehouseTarget.id));
      setDeleteWarehouseTarget(null);
      toast.success("ลบคลังสินค้าสำเร็จ");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* PromptPay Settings */}
      <section className="border rounded-xl p-5 bg-card space-y-4">
        <h2 className="font-semibold">ตั้งค่า PromptPay</h2>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">PromptPay ID (เบอร์โทร/เลขประชาชน)</label>
            <Input value={promptpayId} onChange={(e) => setPromptpayId(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">ชื่อบัญชี PromptPay</label>
            <Input value={promptpayName} onChange={(e) => setPromptpayName(e.target.value)} />
          </div>
        </div>
        <Button onClick={saveSettings} disabled={loading}>บันทึก</Button>
      </section>

      {/* Warehouses */}
      <section className="border rounded-xl p-5 bg-card space-y-4">
        <h2 className="font-semibold">คลังสินค้า</h2>
        <Separator />
        <div className="space-y-2">
          {warehouses.map((w) => (
            <div key={w.id} className="flex items-center justify-between gap-3 py-1.5 px-3 rounded-lg hover:bg-muted/30">
              {editingWarehouseId === w.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editingWarehouseName}
                    onChange={(e) => setEditingWarehouseName(e.target.value)}
                    className="h-8 text-sm max-w-xs"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveWarehouseName(w.id);
                      if (e.key === "Escape") setEditingWarehouseId(null);
                    }}
                  />
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600" onClick={() => saveWarehouseName(w.id)}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingWarehouseId(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">{w.name}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded shrink-0">
                    <Key className="w-3 h-3" />
                    {w.uniqueKey}
                  </span>
                  <Badge variant="outline" className="text-xs shrink-0">Active</Badge>
                </div>
              )}
              {editingWarehouseId !== w.id && (
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => { setEditingWarehouseId(w.id); setEditingWarehouseName(w.name); }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => setDeleteWarehouseTarget({ id: w.id, name: w.name })}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="ชื่อคลังใหม่"
            value={newWarehouse}
            onChange={(e) => setNewWarehouse(e.target.value)}
            className="max-w-xs"
            onKeyDown={(e) => e.key === "Enter" && addWarehouse()}
          />
          <Button variant="outline" onClick={addWarehouse}>เพิ่มคลัง</Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Unique Key จะถูกสร้างอัตโนมัติและใช้สำหรับอ้างอิงในการย้ายสต็อกข้ามคลัง
        </p>
      </section>

      {/* Delete Warehouse Confirm Dialog */}
      <Dialog open={!!deleteWarehouseTarget} onOpenChange={(o) => !o && setDeleteWarehouseTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">ยืนยันการลบคลังสินค้า</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm">
              คุณกำลังจะลบคลัง <strong>&quot;{deleteWarehouseTarget?.name}&quot;</strong>
            </p>
            <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3 space-y-1">
              <p className="font-semibold">⚠️ คำเตือน</p>
              <p>การลบคลังสินค้าจะลบข้อมูลต่อไปนี้ทั้งหมด:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-1">
                <li>สต็อกสินค้าทั้งหมดในคลังนี้</li>
                <li>ประวัติการปรับสต็อกทั้งหมด</li>
                <li>ประวัติการโอนเข้า/ออกจากคลังนี้</li>
                <li>ประวัติการเบิกสินค้าจากคลังนี้</li>
              </ul>
              <p className="font-medium mt-1">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteWarehouseTarget(null)} disabled={deleteLoading}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={confirmDeleteWarehouse} disabled={deleteLoading}>
              {deleteLoading ? "กำลังลบ..." : "ยืนยันลบ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Users */}
      <section className="border rounded-xl p-5 bg-card space-y-4">
        <h2 className="font-semibold">ผู้ใช้งาน Admin</h2>
        <Separator />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">ชื่อ</th>
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">อีเมล</th>
                <th className="text-left py-2 font-medium text-muted-foreground">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-2 pr-4">{user.name}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{user.email}</td>
                  <td className="py-2">
                    <Select defaultValue={user.role} onValueChange={(v) => updateUserRole(user.id, v)}>
                      <SelectTrigger className="w-36 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLE_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add user */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-medium">เพิ่มผู้ใช้ใหม่</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="ชื่อ" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            <Input type="email" placeholder="อีเมล" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            <Input type="password" placeholder="รหัสผ่าน" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v ?? "STAFF" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(ROLE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addUser} disabled={loading}>เพิ่มผู้ใช้</Button>
        </div>
      </section>
    </div>
  );
}
