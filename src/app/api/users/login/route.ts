import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/config";
import User from "@/models/usermodel";
import jwt from "jsonwebtoken";
import bcryipt from "bcryptjs";
import { Token } from "@/types";

connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("user exist");
    const validPW = await bcryipt.compare(password, user.password);
    if (!validPW) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token_data: Token = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const acc_token = await jwt.sign(token_data, process.env.SECRET_TOKEN!, {
      expiresIn: "10m",
    });

    const res = NextResponse.json(
      { message: "Login successfully" },
      { status: 200 }
    );
    res.cookies.set("token", acc_token, {
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
