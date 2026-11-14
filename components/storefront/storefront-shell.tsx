"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

interface StorefrontShellProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}

export default function StorefrontShell({
  children,
  header,
  footer,
}: StorefrontShellProps) {
  const pathname = usePathname();
  const isV3 = pathname === "/" || pathname === "/v3";

  if (isV3) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col text-[#0F172B]">
        {children}
        <Toaster richColors position="top-right" closeButton />
      </div>
    );
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      <Toaster richColors position="top-right" closeButton />
    </>
  );
}
