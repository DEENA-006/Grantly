import { NextResponse } from "next/server";

const VALID_PINS = ["9020", "2026", "1234", "0000"];

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    if (!VALID_PINS.includes(pin)) {
      return NextResponse.json(
        { success: false, message: "Invalid clearance PIN" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true, authorized: true });

    // Set authentication cookie on domain path / with 30-day persistence
    response.cookies.set({
      name: "grantly_authenticated",
      value: "true",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Malformed clearance request" },
      { status: 400 }
    );
  }
}
