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
      {
        protocol: "https",
        hostname: "wsrv.nl",
      },
      // Dynamic hostname from environment variable
      ...(process.env.ADDITIONAL_IMAGE_HOSTNAME ? [{
        protocol: "https" as const,
        hostname: process.env.ADDITIONAL_IMAGE_HOSTNAME,
      }] : []),
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Environment-based configuration
  env: {
    CUSTOM_APP_NAME: process.env.CUSTOM_APP_NAME || "Movie4You",
    CUSTOM_VERSION: process.env.CUSTOM_VERSION || "1.0.0",
  },

  // Tối ưu bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Compression - có thể điều khiển bằng env
  compress: process.env.DISABLE_COMPRESSION !== "true",

  // PoweredByHeader false để giảm kích thước header
  poweredByHeader: false,

  // Tối ưu CSS
  experimental: {
    optimizeCss: process.env.DISABLE_CSS_OPTIMIZATION !== "true",
  },
};

export default nextConfig;
