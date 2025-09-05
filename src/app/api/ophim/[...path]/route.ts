import { NextRequest, NextResponse } from "next/server";

// Use Edge Runtime for better performance and lower cold starts
export const runtime = 'edge';

export async function GET(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path: pathSegments = [] } = await context.params;
  const base = (process.env.OPHIM_BASE || "https://ophim1.com").replace(/\/+$/, "");
  const segments = pathSegments || [];
  const pathname = segments.join("/");
  const search = req.nextUrl.search || "";
  const upstream = `${base}/${pathname}${search}`;

  try {
    const res = await fetch(upstream, {
      method: "GET",
      headers: {
        accept: "application/json",
        "user-agent": `Mozilla/5.0 (compatible; ${process.env.CUSTOM_APP_NAME || 'Movie4You'}/${process.env.CUSTOM_VERSION || '1.0'})`
      },
      // Do not cache the upstream request at the function level; let CDNs cache our response based on headers
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const body = await res.arrayBuffer();

    // Smart Cache-Control depending on endpoint
    // Default: no-store
    let cacheControl = "no-cache, no-store, max-age=0, must-revalidate";
    const p = `/${pathname}`;
    // Static-ish metadata lists: 1 hour
    if (p.includes('/v1/api/the-loai') || p.includes('/v1/api/quoc-gia') || p.includes('/v1/api/nam-phat-hanh')) {
      cacheControl = "public, s-maxage=3600, stale-while-revalidate=300";
    }
    // Listings: 1–6 hours (use 2h here)
    else if (p.includes('/v1/api/danh-sach')) {
      cacheControl = "public, s-maxage=7200, stale-while-revalidate=600";
    }
    // Details page: 24h
    else if (/\/v1\/api\/phim\//.test(p)) {
      cacheControl = "public, s-maxage=86400, stale-while-revalidate=3600";
    }
    // Search: short cache
    else if (p.includes('/v1/api/tim-kiem')) {
      cacheControl = "public, s-maxage=300, stale-while-revalidate=60";
    }

    // Filter response headers - only return safe headers
    const safeHeaders: Record<string, string> = {
      "content-type": contentType,
      "cache-control": cacheControl,
      "x-powered-by": process.env.CUSTOM_APP_NAME || "Movie4You",
    };

    return new NextResponse(body, {
      status: res.status,
      headers: safeHeaders,
    });
  } catch (e) {
    // Generic error message - don't expose upstream API details
    console.error("API Proxy Error:", e instanceof Error ? e.message : "Unknown error");
    return NextResponse.json(
      { error: true, message: "Service temporarily unavailable. Please try again later." },
      { status: 502 }
    );
  }
}
