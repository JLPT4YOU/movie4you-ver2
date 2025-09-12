import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

// Basic, permissive CSP that shouldn't break Next.js runtime
const csp = [
  "default-src 'self'",
  // Allow hCaptcha scripts
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://hcaptcha.com https://*.hcaptcha.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  // Allow Supabase and hCaptcha networking + websockets
  "connect-src 'self' https: wss: https://*.supabase.co https://hcaptcha.com https://*.hcaptcha.com",
  // Allow embedding YouTube and hCaptcha
  "frame-src https://www.youtube.com https://hcaptcha.com https://*.hcaptcha.com",
  "media-src 'self' blob: https:"
].join('; ');

const oneYear = 31536000; // seconds

const nextConfig: NextConfig = {
  // Add security & caching headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
      // Long-term cache for Next static assets
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: `public, max-age=${oneYear}, immutable` },
        ],
      },
      // Long-term cache for public assets (images, fonts, etc.)
      {
        source: '/:all*(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|otf|css|js)',
        headers: [
          { key: 'Cache-Control', value: `public, max-age=${oneYear}, immutable` },
        ],
      },
    ];
  },
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
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  // Compression - có thể điều khiển bằng env
  compress: process.env.DISABLE_COMPRESSION !== "true",

  // PoweredByHeader false để giảm kích thước header
  poweredByHeader: false,

  // Tối ưu CSS
  experimental: {
    // Critters was removed from devDependencies; only enable CSS optimization when explicitly requested
    // via environment variable to avoid requiring the optional dependency at build time.
    optimizeCss: process.env.ENABLE_CSS_OPTIMIZATION === "true",
  },
};

export default nextConfig;
