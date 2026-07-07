import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import NextAuthSessionProvider from "@/components/shared/session-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const raleway = Raleway({subsets:['latin'],variable:'--font-sans'});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Highbury International",
    template: "%s | Highbury International",
  },
  description:
    "เสื้อเชิ้ตสำเร็จรูปคุณภาพสูง ชาย-หญิง หลากสีสัน หลายไซส์ Premium ready-made shirts for men and women.",
  keywords: ["เสื้อเชิ้ต", "Highbury International", "shirt", "เสื้อสำเร็จรูป"],
  openGraph: {
    siteName: "Highbury International",
    locale: "th_TH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={cn("h-full", "antialiased", geistMono.variable, "font-sans", raleway.variable)}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
}
