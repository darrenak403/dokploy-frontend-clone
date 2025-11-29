import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import LayoutContent from "@/provider/LayoutContent";

import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Admin - Laboratory Management System",
    template: "%s | Laboratory Admin"
  },
  description: "Hệ thống quản trị phòng xét nghiệm y tế. Quản lý bệnh nhân, đơn xét nghiệm, kết quả, thiết bị, kho hóa chất và nhân viên một cách hiệu quả.",
  keywords: ["admin", "laboratory management", "quản lý xét nghiệm", "hệ thống quản trị", "medical admin"],
  authors: [{ name: "Laboratory Medical Service" }],
  creator: "Laboratory Medical Service",
  publisher: "Laboratory Medical Service",
  metadataBase: new URL("https://labadmin.dupssapp.id.vn"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://labadmin.dupssapp.id.vn",
    title: "Admin - Laboratory Management System",
    description: "Hệ thống quản trị phòng xét nghiệm y tế. Quản lý bệnh nhân, đơn xét nghiệm, kết quả, thiết bị, kho hóa chất và nhân viên một cách hiệu quả.",
    siteName: "Laboratory Admin",
    images: [
      {
        url: "/images/LogoPDF2.png",
        width: 1200,
        height: 630,
        alt: "Laboratory Management System Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin - Laboratory Management System",
    description: "Hệ thống quản trị phòng xét nghiệm y tế hiện đại.",
    images: ["/images/LogoPDF2.png"],
  },
  icons: {
    icon: [
      { url: "/images/LogoPDF2.png", sizes: "32x32", type: "image/png" },
      { url: "/images/LogoPDF2.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/images/LogoPDF2.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
