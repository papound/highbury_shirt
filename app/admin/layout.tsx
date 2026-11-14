import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Highbury Management Console",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
