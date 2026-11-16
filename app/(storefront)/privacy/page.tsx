import type { Metadata } from "next";
import { getBaseUrl, siteConfig } from "@/lib/seo";
import PrivacyContent from "@/components/storefront/v3/privacy-content";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว (Privacy Policy)",
  description:
    "นโยบายความเป็นส่วนตัวของ Highbury International อธิบายการเก็บรวบรวม การประมวลผลข้อมูลส่วนบุคคล และสิทธิของท่านตามกฎหมาย PDPA",
  alternates: {
    canonical: `${getBaseUrl()}/privacy`,
  },
  openGraph: {
    title: "นโยบายความเป็นส่วนตัว | Highbury International",
    description:
      "นโยบายการคุ้มครองข้อมูลส่วนบุคคล (PDPA) ของ Highbury International สำหรับลูกค้าสั่งซื้อเสื้อเชิ้ตและสั่งผลิต OEM",
    url: `${getBaseUrl()}/privacy`,
    images: [
      {
        url: `${getBaseUrl()}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "Highbury International Privacy Policy",
      },
    ],
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
