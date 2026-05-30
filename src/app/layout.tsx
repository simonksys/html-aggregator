import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HTML Aggregator",
  description: "A self-updating directory for standalone HTML pages."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
