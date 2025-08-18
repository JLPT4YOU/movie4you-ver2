import { NextRequest, NextResponse } from "next/server";

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
      headers: { accept: "application/json" },
      // avoid caching since home updates frequently
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const body = await res.arrayBuffer();

    return new NextResponse(body, {
      status: res.status,
      headers: {
        "content-type": contentType,
        "cache-control": "no-store",
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
