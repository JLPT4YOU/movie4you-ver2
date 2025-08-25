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
      // Forward cache instructions from the client, do not cache on the proxy
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const body = await res.arrayBuffer();

    // Filter response headers - only return safe headers
    const safeHeaders: Record<string, string> = {
      "content-type": contentType,
      // Let the client decide how to cache
      "cache-control": "no-cache, no-store, max-age=0, must-revalidate",
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
