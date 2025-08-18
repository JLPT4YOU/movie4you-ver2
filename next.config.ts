import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "img.ophim.live",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Tối ưu bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Compression
  compress: true,
  
  // PoweredByHeader false để giảm kích thước header
  poweredByHeader: false,
  
  // Tối ưu CSS
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
