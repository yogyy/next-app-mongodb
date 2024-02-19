import { connect } from "@/db/config";
import { getDataFromToken } from "@/lib/get-token";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest) {
  try {
    const token = await getDataFromToken(req);
    const user = await User.findOne({ _id: token.id }).select("-password");
    return NextResponse.json(user);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
