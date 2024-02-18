import { connect } from "@/db/config";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { username, email, password } = reqBody;

    //check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPW = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPW });
    const savedUser = await newUser.save();
    console.log(savedUser);

    return NextResponse.json(
      { message: "User created successfully", success: true, savedUser },
      { status: 200 }
    );
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
