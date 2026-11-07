import { NextResponse } from "next/server";
import { BoardStatus } from "@/data/mockData";
import { checkRateLimit } from "@/utils/rateLimit";

const VALID_STATUSES: BoardStatus[] = ["saved", "in_progress", "submitted"];

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "localhost";
    const rateLimit = checkRateLimit(ip, 60, 60000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too Many Requests. Please slow down." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { grantId, status } = body as { grantId?: string; status?: BoardStatus };

    // Input Sanitization & Whitelisting (The SHIELD Protocol)
    if (!grantId || typeof grantId !== "string" || !status) {
      return NextResponse.json(
        { error: "Invalid payload: grantId and status are required." },
        { status: 400 }
      );
    }

    // Strip any HTML or script characters to prevent injection / XSS
    const sanitizedGrantId = grantId.trim().replace(/[^a-zA-Z0-9_-]/g, "");

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status parameter." },
        { status: 400 }
      );
    }

    // 300ms simulated network latency per docs/API.md
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json(
      {
        success: true,
        grantId: sanitizedGrantId,
        status,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Cache-Control": "no-store, max-age=0",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Malformed JSON payload" },
      { status: 400 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
