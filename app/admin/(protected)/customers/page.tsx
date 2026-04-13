"use client";

import { useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import Link from "next/link";
import { getStatusLabel, getStatusBadgeClass } from "@/lib/order-status";
import { formatCustomerNo } from "@/lib/customer-no";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "รอดำเนินการ", color: "bg-yellow-100 text-yellow-800" },
  PAYMENT_UPLOADED: { label: "อัพโหลดสลิปแล้ว", color: "bg-blue-100 text-blue-800" },
  PAYMENT_VERIFIED: { label: "ยืนยันชำระแล้ว", color: "bg-green-100 text-green-800" },
  PAYMENT_REJECTED: { label: "ปฏิเสธการชำระ", color: "bg-red-100 text-red-800" },
  PROCESSING: { label: "กำลังจัดส่ง", color: "bg-purple-100 text-purple-800" },
  SHIPPED: { label: "จัดส่งแล้ว", color: "bg-indigo-100 text-indigo-800" },
  DELIVERED: { label: "ส่งสำเร็จ", color: "bg-emerald-100 text-emerald-800" },
  CANCELLED: { label: "ยกเลิก", color: "bg-gray-100 text-gray-600" },
  REFUNDED: { label: "คืนเงิน", color: "bg-orange-100 text-orange-800" },
};

interface User {
  id: string;
  customerNo: number | null;
  name: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
  _count: { orders: number };
}

interface Order {
  id: string;
  orderNumber: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostcode: string;
  status: string;
  total: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  note: string | null;
  trackingNumber: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string } | null;
  items: { quantity: number; unitPrice: number }[];
}

interface SearchResult {
  users: User[];
  orders: Order[];
}

export default function AdminCustomersPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingUserOrders, setLoadingUserOrders] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  async function search() {
    if (!query.trim()) return;
    setLoading(true);
    setSelectedUser(null);
    setUserOrders([]);
    try {
      const res = await fetch(`/api/admin/customers?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserOrders(user: User) {
    setSelectedUser(user);
    setLoadingUserOrders(true);
    try {
      const res = await fetch(`/api/admin/customers?q=${encodeURIComponent(user.email)}`);
      const data: SearchResult = await res.json();
      setUserOrders(data.orders.filter((o) => o.user?.id === user.id || o.guestEmail === user.email));
    } finally {
      setLoadingUserOrders(false);
      // On mobile, scroll detail panel into view after data loads
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }

  const totalSpent = useCallback((orders: Order[]) =>
    orders.filter((o) => !["CANCELLED", "REFUNDED"].includes(o.status))
      .reduce((s, o) => s + o.total, 0),
  []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ค้นหาลูกค้า</h1>

      {/* Search bar */}
      <div className="flex gap-2 w-full sm:max-w-xl">
        <Input
          placeholder="ค้นหาด้วยชื่อ, อีเมล, เบอร์โทร หรือหมายเลขออเดอร์..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          className="text-sm"
        />
        <Button onClick={search} disabled={loading} className="shrink-0">
          <Search className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">{loading ? "กำลังค้นหา..." : "ค้นหา"}</span>
        </Button>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ──── LEFT: search results ──── */}
          <div className="space-y-4">
            {/* Registered users */}
            {result.users.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  สมาชิกที่ลงทะเบียน ({result.users.length})
                </p>
                <div className="space-y-2">
                  {result.users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => loadUserOrders(user)}
                      className={`w-full text-left border rounded-lg p-3 text-sm hover:bg-muted/50 transition-colors ${
                        selectedUser?.id === user.id ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">{user.name ?? "(ไม่มีชื่อ)"}</p>
                        {user.customerNo && (
                          <span className="text-xs font-mono text-primary shrink-0">
                            {formatCustomerNo(user.customerNo)}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">{user.email}</p>
                      {user.phone && <p className="text-muted-foreground text-xs">{user.phone}</p>}
                      <p className="text-xs mt-1">
                        <span className="text-primary font-medium">{user._count.orders} คำสั่งซื้อ</span>
                        <span className="text-muted-foreground"> · สมาชิกตั้งแต่ {new Date(user.createdAt).toLocaleDateString("th-TH")}</span>
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Orders from guests */}
            {result.orders.filter((o) => !o.user).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  ออเดอร์จากลูกค้าทั่วไป ({result.orders.filter((o) => !o.user).length})
                </p>
                <div className="space-y-2">
                  {result.orders.filter((o) => !o.user).map((order) => (
                    <div key={order.id} className="border rounded-lg p-3 text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{order.guestName ?? order.shippingName}</p>
                          <p className="text-xs text-muted-foreground">{order.guestEmail}</p>
                          <p className="text-xs text-muted-foreground">{order.guestPhone}</p>
                        </div>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-xs text-primary hover:underline"
                        >
                          #{order.orderNumber}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.users.length === 0 && result.orders.length === 0 && (
              <p className="text-muted-foreground text-sm">ไม่พบข้อมูลที่ตรงกัน</p>
            )}
          </div>

          {/* ──── RIGHT: user detail + order history ──── */}
          {selectedUser ? (
            <div ref={detailRef} className="lg:col-span-2 space-y-4">
              {/* Customer profile card */}
              <div className="border rounded-xl p-5 bg-card space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold">{selectedUser.name ?? "(ไม่มีชื่อ)"}</h2>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    {selectedUser.phone && (
                      <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="text-xs">สมาชิก</Badge>
                    {selectedUser.customerNo && (
                      <span className="text-xs font-mono text-primary font-semibold">
                        {formatCustomerNo(selectedUser.customerNo)}
                      </span>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-primary">{userOrders.length}</p>
                    <p className="text-xs text-muted-foreground">คำสั่งซื้อ</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      ฿{totalSpent(userOrders).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">ยอดซื้อรวม</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      {new Date(selectedUser.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short" })}
                    </p>
                    <p className="text-xs text-muted-foreground">สมัครสมาชิก</p>
                  </div>
                </div>
              </div>

              {/* Order history */}
              <div>
                <h3 className="font-semibold mb-3">ประวัติการสั่งซื้อ</h3>
                {loadingUserOrders ? (
                  <p className="text-sm text-muted-foreground">กำลังโหลด...</p>
                ) : userOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">ยังไม่มีคำสั่งซื้อ</p>
                ) : (
                  <div className="space-y-3">
                    {userOrders.map((order) => {
                      const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
                      return (
                        <div key={order.id} className="border rounded-xl p-4 bg-card space-y-2">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <Link
                                href={`/admin/orders/${order.id}`}
                                className="font-semibold text-primary hover:underline"
                              >
                                #{order.orderNumber}
                              </Link>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString("th-TH", {
                                  year: "numeric", month: "long", day: "numeric",
                                })}
                              </p>
                            </div>
                            <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium border ${getStatusBadgeClass(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{totalItems} ชิ้น</span>
                            <span className="font-semibold">฿{order.total.toLocaleString()}</span>
                          </div>
                          {(order.shippingName || order.shippingAddress) && (
                            <p className="text-xs text-muted-foreground border-t pt-2">
                              📍 {order.shippingName} · {order.shippingAddress}, {order.shippingCity}, {order.shippingProvince}
                            </p>
                          )}
                          {order.trackingNumber && (
                            <p className="text-xs text-primary">📦 เลขพัสดุ: {order.trackingNumber}</p>
                          )}
                          {order.note && (
                            <p className="text-xs text-muted-foreground italic">หมายเหตุ: {order.note}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : result.users.length > 0 ? (
            <div className="hidden lg:flex lg:col-span-2 items-center justify-center text-muted-foreground text-sm h-40 border rounded-xl bg-muted/10">
              เลือกสมาชิกเพื่อดูรายละเอียด
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
