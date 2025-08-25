import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://movie4you.com'),
  title: {
    default: "MOVIE4YOU - Xem Phim Online HD Vietsub Miễn Phí | Phim Mới 2024",
    template: "%s | MOVIE4YOU - Xem Phim HD Vietsub"
  },
  description: "Xem phim online miễn phí chất lượng HD với phụ đề tiếng Việt. Kho phim bộ Hàn Quốc, phim lẻ chiếu rạp, anime Nhật Bản cập nhật nhanh nhất 2025.",
  keywords: "xem phim online, phim hd vietsub, phim mới 2025, phim bộ hàn quốc, phim chiếu rạp, phim lẻ hay, anime vietsub, movie4you, motchill, phimmoi",
  authors: [{ name: "MOVIE4YOU" }],
  creator: "MOVIE4YOU",
  publisher: "MOVIE4YOU",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "MOVIE4YOU - Xem Phim Online HD Vietsub Miễn Phí",
    description: "Kho phim online lớn nhất Việt Nam với hàng ngàn bộ phim HD vietsub. Cập nhật phim mới mỗi ngày.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://movie4you.com',
    siteName: 'MOVIE4YOU',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MOVIE4YOU - Xem Phim Online HD',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOVIE4YOU - Xem Phim Online HD Vietsub',
    description: 'Xem phim online miễn phí chất lượng HD',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://movie4you.com',
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
      <head>
        {/* Preconnect to the image optimization service */}
        <link rel="preconnect" href="https://wsrv.nl" />
        <link rel="dns-prefetch" href="https://wsrv.nl" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'MOVIE4YOU',
              alternateName: 'Movie4You - Xem Phim Online HD Vietsub',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://movie4you.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://movie4you.com'}/tim-kiem?q={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="bg-netflix-black min-h-screen text-netflix-white flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <SpeedInsights />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
