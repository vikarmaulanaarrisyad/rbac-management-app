import { errorResponse, successResponse } from "@/app/lib/api-response";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { Role } from "@/app/types";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    /**
     * 1️⃣ Authentication
     */
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return errorResponse("You are not authenticated", 401);
    }

    /**
     * 2️⃣ Authorization (ADMIN only)
     */
    if (!checkUserPermission(currentUser, Role.ADMIN)) {
      return errorResponse("You are not authorized to assign team", 403);
    }

    const { userId } = params;

    if (!userId) {
      return errorResponse("User ID is required", 400);
    }

    /**
     * 3️⃣ Validate Body
     */
    const { teamId } = await request.json();

    if (!teamId) {
      return errorResponse("Team ID is required", 400);
    }

    /**
     * 4️⃣ Check Team Exists
     */
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return errorResponse("Team not found", 404);
    }

    /**
     * 5️⃣ Update User Team
     */
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { teamId },
      include: {
        Team: true,
      },
    });

    return successResponse(updatedUser, "User team assigned successfully", 200);
  } catch (error) {
    console.error("ASSIGN_TEAM_ERROR", error);
    return errorResponse("Internal server error", 500);
  }
}
