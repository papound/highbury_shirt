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
            <div key={w.id} className="flex items-center justify-between">
              <span className="text-sm">{w.name}</span>
              <Badge variant="outline">Active</Badge>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="ชื่อคลังใหม่"
            value={newWarehouse}
            onChange={(e) => setNewWarehouse(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="outline" onClick={addWarehouse}>เพิ่มคลัง</Button>
        </div>
      </section>

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
