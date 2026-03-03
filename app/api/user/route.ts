import { errorResponse, successResponse } from "@/app/lib/api-response";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { Role } from "@/app/types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    /**
     * 1️⃣ Get Logged-in User
     */
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse("You are not authenticated", 401);
    }

    /**
     * 2️⃣ Get Query Params
     */
    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get("teamId");
    const roleParam = searchParams.get("role") as Role | null;

    /**
     * 3️⃣ Build Where Clause
     */
    let where: any = {};

    // 🔥 ADMIN: can see all users
    if (user.role === Role.ADMIN) {
      if (teamId) where.teamId = teamId;
      if (roleParam) where.role = roleParam;
    }

    // 🔥 MANAGER: only users in their team
    else if (user.role === Role.MANAGER) {
      where.teamId = user.teamId;

      if (roleParam) {
        where.role = roleParam;
      }
    }

    // 🔥 USER: only themselves
    else {
      where.id = user.id;
    }

    /**
     * 4️⃣ Query Users
     */
    const users = await prisma.user.findMany({
      where,
      include: {
        Team: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    /**
     * 5️⃣ Remove Password From All Users
     */
    const safeUsers = users.map(({ ...rest }) => rest);

    /**
     * 6️⃣ Return Response
     */
    return successResponse(safeUsers, "Users retrieved successfully", 200);
  } catch (error) {
    console.error("GET_USERS_ERROR", error);
    return errorResponse("Internal server error", 500);
  }
}
