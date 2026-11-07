import { NextResponse } from "next/server";
import { initialUser, initialScholarships, initialBoardItems } from "@/data/mockData";
import { checkRateLimit } from "@/utils/rateLimit";

export async function GET(request: Request) {
  // Rate limiting check
  const ip = request.headers.get("x-forwarded-for") || "localhost";
  const rateLimit = checkRateLimit(ip, 60, 60000);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too Many Requests. Please throttle your queries." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": "60",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // 300ms simulated network latency per docs/API.md
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(
    {
      user: initialUser,
      scholarships: initialScholarships,
      board: initialBoardItems,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
