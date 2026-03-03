import { errorResponse, successResponse } from "@/app/lib/api-response";
import { getCurrentUser } from "@/app/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse("You are not authenticated", 401);
    }

    return successResponse(user, "Current user retrieved successfully", 200);
  } catch (error) {
    console.error("GET_CURRENT_USER_ERROR", error);
    return errorResponse("Internal server error", 500);
  }
}
