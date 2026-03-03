import { successResponse } from "@/app/lib/api-response";

export async function POST() {
  const response = successResponse({}, "User logged out successfully", 200);
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: "lax",
    maxAge: 0,
  });
  return response;
}
