import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import LayoutContent from "@/provider/LayoutContent";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "LabMS - Phòng xét nghiệm máu chuẩn quốc tế",
    template: "%s | LabMS",
  },
  description:
    "Hệ thống quản lý phòng xét nghiệm y tế hiện đại với công nghệ tiên tiến. Cung cấp dịch vụ xét nghiệm máu, sinh hóa, miễn dịch và vi sinh chính xác, nhanh chóng theo tiêu chuẩn quốc tế.",
  keywords: [
    "phòng xét nghiệm",
    "xét nghiệm máu",
    "laboratory",
    "medical service",
    "xét nghiệm y tế",
    "chẩn đoán bệnh",
    "sinh hóa",
    "miễn dịch",
    "LabMS",
  ],
  authors: [{ name: "Laboratory Medical Service" }],
  creator: "Laboratory Medical Service",
  publisher: "Laboratory Medical Service",
  metadataBase: new URL("https://lab.dupssapp.id.vn"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://lab.dupssapp.id.vn",
    title: "Laboratory Medical Service - Phòng xét nghiệm máu chuẩn quốc tế",
    description:
      "Hệ thống quản lý phòng xét nghiệm y tế hiện đại với công nghệ tiên tiến. Cung cấp dịch vụ xét nghiệm máu, sinh hóa, miễn dịch và vi sinh chính xác, nhanh chóng theo tiêu chuẩn quốc tế.",
    siteName: "Laboratory Medical Service",
    images: [
      {
        url: "/images/FSA.png",
        width: 1200,
        height: 630,
        alt: "Laboratory Medical Service Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laboratory Medical Service - Phòng xét nghiệm máu chuẩn quốc tế",
    description:
      "Hệ thống quản lý phòng xét nghiệm y tế hiện đại với công nghệ tiên tiến.",
    images: ["/images/FSA.png"],
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
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Thay bằng mã verification thực tế
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
