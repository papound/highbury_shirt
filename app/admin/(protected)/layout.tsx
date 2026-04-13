import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar";
import { Toaster } from "sonner";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN", "STAFF", "ACCOUNTANT"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-background">
      <AdminSidebar role={session.user.role} name={session.user.name ?? ""} email={session.user.email ?? ""} />
      <main className="flex-1 overflow-auto pt-14 lg:pt-0 relative">
        <div className="absolute top-0 right-0 h-64 w-64 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
