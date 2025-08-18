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
      headers: { accept: "application/json" },
      // Cache strategy: details for 1h, lists for 5min, rest no cache
      cache: isDetailEndpoint ? undefined : "no-store",
      next: isDetailEndpoint ? { revalidate: 3600 } : undefined,
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const body = await res.arrayBuffer();

    // Set cache headers based on content type
    const cacheControl = isDetailEndpoint 
      ? "public, s-maxage=3600, stale-while-revalidate=7200" // 1h cache, 2h stale
      : isListEndpoint 
      ? "public, s-maxage=300, stale-while-revalidate=600" // 5min cache, 10min stale
      : "no-store";
    
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "content-type": contentType,
        "cache-control": cacheControl,
      },
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Proxy request failed";
    return NextResponse.json(
      { error: true, message: errorMessage },
      { status: 502 }
    );
  }
}
