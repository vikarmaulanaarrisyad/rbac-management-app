import { successResponse, errorResponse } from "@/app/lib/api-response";
import { checkDatabaseConnection } from "@/app/lib/prisma";

export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection();

    if (!isConnected) {
      return errorResponse("Database connection failed", 503);
    }

    return successResponse({}, "Database connected successfully", 200);
  } catch (error) {
    console.error("Health check error:", error);

    return errorResponse("Internal Server Error", 500);
  }
}
