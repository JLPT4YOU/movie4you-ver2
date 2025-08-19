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
    // Smart caching based on endpoint type
    const isListEndpoint = pathname.includes('danh-sach') || pathname.includes('the-loai') || pathname.includes('quoc-gia');
    const isDetailEndpoint = pathname.includes('/phim/');
    
    const res = await fetch(upstream, {
      method: "GET",
      headers: {
        accept: "application/json",
        "user-agent": `Mozilla/5.0 (compatible; ${process.env.CUSTOM_APP_NAME || 'Movie4You'}/${process.env.CUSTOM_VERSION || '1.0'})`
      },
      // Optimized cache strategy: details for 1h, lists for 10min, rest 5min
      cache: "force-cache",
      next: isDetailEndpoint
        ? { revalidate: 3600 } // 1 hour for movie details
        : isListEndpoint
        ? { revalidate: 600 }  // 10 minutes for lists
        : { revalidate: 300 }, // 5 minutes for others
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const body = await res.arrayBuffer();

    // Optimized cache headers based on content type
    const cacheControl = isDetailEndpoint
      ? "public, s-maxage=3600, stale-while-revalidate=7200, max-age=1800" // 1h cache, 2h stale, 30min browser
      : isListEndpoint
      ? "public, s-maxage=600, stale-while-revalidate=1200, max-age=300" // 10min cache, 20min stale, 5min browser
      : "public, s-maxage=300, stale-while-revalidate=600, max-age=180"; // 5min cache, 10min stale, 3min browser

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
