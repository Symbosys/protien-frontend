import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_BASE = "https://protien-backend.vercel.app/api";

async function proxy(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const subPath = (params.path || []).join("/");
    const search = request.nextUrl.search || "";
    const targetUrl = `${BACKEND_BASE}/${subPath}${search}`;

    const headers = new Headers();
    request.headers.forEach((val, key) => {
      const lower = key.toLowerCase();
      if (lower !== "host" && lower !== "origin") {
        headers.set(key, val);
      }
    });

    // Provide the origin that backend already whitelist-allows
    headers.set("origin", "https://fuelandnutrients.com");
    headers.set("accept", "application/json, text/plain, */*");

    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const body = hasBody ? await request.arrayBuffer() : undefined;

    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const resBody = await res.arrayBuffer();
    const resHeaders = new Headers();
    res.headers.forEach((val, key) => {
      const lower = key.toLowerCase();
      if (lower !== "content-encoding" && lower !== "content-length") {
        resHeaders.set(key, val);
      }
    });

    return new NextResponse(resBody, {
      status: res.status,
      headers: resHeaders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Internal Proxy Error" },
      { status: 500 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
