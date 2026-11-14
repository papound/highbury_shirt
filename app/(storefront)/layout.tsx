import type { Metadata } from "next";
import StorefrontHeader from "@/components/storefront/header";
import StorefrontFooter from "@/components/storefront/footer";
import StorefrontShell from "@/components/storefront/storefront-shell";

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
    <StorefrontShell
      header={<StorefrontHeader />}
      footer={<StorefrontFooter />}
    >
      {children}
    </StorefrontShell>
  );
}
