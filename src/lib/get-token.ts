import { NextRequest } from "next/server";
import { Token } from "@/types";
import jwt from "jsonwebtoken";

export const getDataFromToken = (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    return jwt.verify(token, process.env.SECRET_TOKEN!) as Token;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};
