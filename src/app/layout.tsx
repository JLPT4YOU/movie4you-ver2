import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "MOVIE4YOU - Xem Phim Online Miễn Phí",
  description: "Xem phim online miễn phí chất lượng cao. Phim mới, phim bộ, phim lẻ, phim chiếu rạp cập nhật liên tục.",
  keywords: "xem phim online, phim mới, phim bộ, phim lẻ, phim chiếu rạp, movie4you",
  authors: [{ name: "MOVIE4YOU" }],
  creator: "MOVIE4YOU",
  publisher: "MOVIE4YOU",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="bg-netflix-black min-h-screen text-netflix-white">
          <Header />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
