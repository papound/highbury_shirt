"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF", "ACCOUNTANT"];

const schema = z.object({
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", { ...values, redirect: false });
    setLoading(false);

    if (!result?.ok) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    // Verify admin role before granting access
    const session = await getSession();
    const role = (session?.user as any)?.role as string | undefined;
    if (!role || !ADMIN_ROLES.includes(role)) {
      setError("บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานระบบออฟฟิศ กรุณาใช้ระบบสำหรับลูกค้า");
      // Sign them out immediately
      await import("next-auth/react").then((m) => m.signOut({ redirect: false }));
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-white/5">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            H
          </div>
          <div>
            <div className="text-white font-bold text-xl tracking-tight">HBI Admin</div>
            <div className="text-blue-400/60 text-xs">Highbury International</div>
          </div>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            ระบบสำหรับเจ้าหน้าที่เท่านั้น
          </div>
          <h2 className="text-white text-3xl font-bold leading-snug">
            ระบบจัดการ<br/>ร้านค้าออนไลน์
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            จัดการคำสั่งซื้อ สินค้า ลูกค้า และรายงานทั้งหมดในที่เดียว เข้าถึงได้เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต
          </p>
        </div>
        <div className="relative z-10 text-slate-600 text-xs">
          © {new Date().getFullYear()} Highbury International Co., Ltd.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow">
              H
            </div>
            <span className="text-white font-bold text-lg tracking-tight">HBI Admin</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">เข้าสู่ระบบออฟฟิศ</h1>
            <p className="text-slate-400 mt-1 text-sm">สำหรับเจ้าหน้าที่ Highbury International</p>
          </div>

          {error && (
            <Alert className="mb-5 border-red-500/30 bg-red-500/10 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-medium">อีเมลที่ทำงาน</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="username"
                        placeholder="office@highbury.co.th"
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-medium">รหัสผ่าน</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/30 transition-all"
                disabled={loading}
              >
                {loading ? "กำลังตรวจสอบสิทธิ์..." : "เข้าสู่ระบบ"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500">
              เป็นลูกค้า?{" "}
              <Link href="/auth/login" className="text-slate-400 hover:text-slate-200 underline underline-offset-2">
                เข้าสู่ระบบสำหรับลูกค้า
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
