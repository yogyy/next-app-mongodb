import { NextRequest } from "next/server";
import { decrypt } from "./utils";

export const getDataFromToken = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("session")?.value || "";
    return await decrypt(token);
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};
