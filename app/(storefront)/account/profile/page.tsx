"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { formatCustomerNo } from "@/lib/customer-no";

const profileSchema = z.object({
  name: z.string().min(2, "กรุณาระบุชื่อ"),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

interface UserProfile {
  name: string | null;
  email: string;
  phone: string | null;
  customerNo: number | null;
  createdAt: string;
  hasPassword: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "" },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    fetch("/api/account/profile")
      .then((r) => r.json())
      .then((data: UserProfile) => {
        setProfile(data);
        profileForm.reset({ name: data.name ?? "", phone: data.phone ?? "" });
      });
  }, []);

  async function onSaveProfile(values: ProfileValues) {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("บันทึกข้อมูลสำเร็จ");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSavingProfile(false);
    }
  }

  async function onSavePassword(values: PasswordValues) {
    setSavingPassword(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
      passwordForm.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">ข้อมูลส่วนตัว</h1>
        {profile && (
          <div className="mt-1 space-y-0.5">
            {profile.customerNo && (
              <p className="text-sm font-medium text-primary">
                รหัสลูกค้า: {formatCustomerNo(profile.customerNo)}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              อีเมล: {profile.email} · สมาชิกตั้งแต่{" "}
              {new Date(profile.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="border rounded-xl p-6 bg-card space-y-4">
        <h2 className="font-semibold">แก้ไขข้อมูล</h2>
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
            <FormField
              control={profileForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อ-นามสกุล</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={profileForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เบอร์โทรศัพท์</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0812345678" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={savingProfile}>
              {savingProfile ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </Button>
          </form>
        </Form>
      </div>

      <Separator />

      {/* Change Password */}
      <div className="border rounded-xl p-6 bg-card space-y-4">
        <h2 className="font-semibold">เปลี่ยนรหัสผ่าน</h2>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onSavePassword)} className="space-y-4">
            {profile?.hasPassword && (
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รหัสผ่านปัจจุบัน</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รหัสผ่านใหม่</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ยืนยันรหัสผ่านใหม่</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="outline" disabled={savingPassword}>
              {savingPassword ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
