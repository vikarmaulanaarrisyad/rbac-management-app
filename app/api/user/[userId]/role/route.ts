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
      return errorResponse("You are not authorized to update roles", 403);
    }

    const { userId } = params;

    if (!userId) {
      return errorResponse("User ID is required", 400);
    }

    /**
     * 3️⃣ Prevent self role change
     */
    if (userId === currentUser.id) {
      return errorResponse("You cannot change your own role", 400);
    }

    /**
     * 4️⃣ Parse Body ONCE
     */
    const body = await request.json();
    const { role } = body;

    /**
     * 5️⃣ Validate Role
     */
    const allowedRoles: Role[] = [Role.USER, Role.MANAGER];

    if (!allowedRoles.includes(role)) {
      return errorResponse("Invalid role. Only USER or MANAGER allowed.", 400);
    }

    /**
     * 6️⃣ Check Target User Exists
     */
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return errorResponse("User not found", 404);
    }

    /**
     * 7️⃣ Update Role
     */
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return successResponse(updatedUser, "User role updated successfully", 200);
  } catch (error) {
    console.error("UPDATE_ROLE_ERROR", error);
    return errorResponse("Internal server error", 500);
  }
}
