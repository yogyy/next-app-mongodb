"use client";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error) {
      const err = error as AxiosError<{
        error: string;
      }>;
      console.log(err.response?.data.error as string);
      toast.error(err.response?.data.error as string);
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/me");
      setData(res.data);
    } catch (error) {
      const err = error as AxiosError<{
        error: string;
      }>;
      console.log(err.response?.data.error as string);
      toast.error(err.response?.data.error as string);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile page</p>
      <h2 className="p-1 rounded bg-green-500">
        {data === "nothing" ? (
          "Nothing"
        ) : (
          // <Link href={`/profile/${data}`}>{data}</Link>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </h2>
      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>

      <button
        onClick={getUserDetails}
        className="bg-green-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        GetUser Details
      </button>
    </div>
  );
}
