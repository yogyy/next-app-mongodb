import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/config";
import User from "@/models/usermodel";
import bcrypt from "bcryptjs";
import { Token, UserResponse } from "@/types";
import { encrypt } from "@/lib/auth";

connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    const user = await User.findOne<UserResponse>({ email });
    console.log(user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const validPW = await bcrypt.compare(password, user.password);
    if (!validPW) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ error: "Email Not Verifed" }, { status: 401 });
    }

    const token_data: Token = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const session = await encrypt(token_data);

    const res = NextResponse.json(
      { message: "Login successfully" },
      { status: 200 }
    );
    res.cookies.set("session", session, {
      httpOnly: true,
      path: "/",
      expires: new Date(Date.now() + 10 * 60 * 1000),
    });

    return res;
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
