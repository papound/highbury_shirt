import type { Metadata } from "next";
import { Toaster } from "sonner";
import StorefrontHeader from "@/components/storefront/header";
import StorefrontFooter from "@/components/storefront/footer";

export const metadata: Metadata = {
  title: {
    default: "Highbury International",
    template: "%s | Highbury International",
  },
};

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StorefrontHeader />
      <main className="flex-1">{children}</main>
      <StorefrontFooter />
      <Toaster richColors position="top-right" closeButton />
    </>
  );
}
