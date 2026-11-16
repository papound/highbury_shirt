import type { Metadata } from "next";
import { getBaseUrl, siteConfig } from "@/lib/seo";
import TermsContent from "@/components/storefront/v3/terms-content";

export const metadata: Metadata = {
  title: "ข้อกำหนดและเงื่อนไข (Terms of Service)",
  description:
    "ข้อกำหนดและเงื่อนไขการใช้บริการของ Highbury International สำหรับการสั่งซื้อเสื้อเชิ้ตสำเร็จรูป การสั่งผลิต OEM การเปลี่ยนไซส์สินค้า และการชำระเงิน",
  alternates: {
    canonical: `${getBaseUrl()}/terms`,
  },
  openGraph: {
    title: "ข้อกำหนดและเงื่อนไข | Highbury International",
    description:
      "ข้อกำหนดและเงื่อนไขการสั่งซื้อเสื้อเชิ้ตสำเร็จรูป การสั่งผลิต OEM นโยบายเปลี่ยนไซส์ และการรับประกันของ Highbury International",
    url: `${getBaseUrl()}/terms`,
    images: [
      {
        url: `${getBaseUrl()}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "Highbury International Terms of Service",
      },
    ],
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
