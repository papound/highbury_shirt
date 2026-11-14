import type { Metadata } from "next";
import { getBaseUrl, siteConfig } from "@/lib/seo";
import AboutContent from "@/components/storefront/v3/about-content";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา ผู้เชี่ยวชาญด้านเสื้อเชิ้ตสำเร็จรูป",
  description:
    "รู้จัก Highbury International ผู้เชี่ยวชาญด้านเสื้อเชิ้ตสำเร็จรูปสำหรับผู้ชายและผู้หญิง ด้วยประสบการณ์ คัตติ้งเนี้ยบ และบริการสั่งผลิต OEM ครบวงจร",
  alternates: {
    canonical: `${getBaseUrl()}/about`,
  },
  openGraph: {
    title: "เกี่ยวกับเรา | Highbury International",
    description:
      "ผู้เชี่ยวชาญด้านเสื้อเชิ้ตสำเร็จรูปสำหรับผู้ชายและผู้หญิง ด้วยประสบการณ์ คัตติ้งเนี้ยบ และบริการสั่งผลิต OEM ครบวงจร",
    url: `${getBaseUrl()}/about`,
    images: [
      {
        url: `${getBaseUrl()}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "About Highbury International",
      },
    ],
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
