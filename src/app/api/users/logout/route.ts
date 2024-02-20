import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = NextResponse.json({
      message: "Logout successfully",
      success: true,
    });
    res.cookies.set("session", "", { httpOnly: true, expires: new Date(0) });
    return res;
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
