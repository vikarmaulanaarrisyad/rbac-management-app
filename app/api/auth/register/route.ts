import { errorResponse, successResponse } from "@/app/lib/api-response";
import { generateToken, hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { Role } from "@/app/types";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, teamCode } = body;

    /**
     * 1️⃣ Validate Required Fields
     */
    const requiredFields = { name, email, password };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return errorResponse(
        `Missing required field(s): ${missingFields.join(", ")}`,
        400,
      );
    }

    /**
     * 2️⃣ Normalize Email
     */
    const normalizedEmail = email.toLowerCase().trim();

    /**
     * 3️⃣ Check Existing User
     */
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return errorResponse("User with this email address already exists", 400);
    }

    /**
     * 4️⃣ Validate Team Code (Optional)
     */
    let teamId: string | null = null;

    if (teamCode) {
      const team = await prisma.team.findUnique({
        where: { code: teamCode },
      });

      if (!team) {
        return errorResponse("Please enter a valid team code", 400);
      }

      teamId = team.id;
    }

    /**
     * 5️⃣ Hash Password
     */
    const hashedPassword = await hashPassword(password);

    /**
     * 6️⃣ First User Auto ADMIN
     */
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    /**
     * 7️⃣ Create User
     */
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
        teamId,
      },
      include: {
        Team: true,
      },
    });

    /**
     * 8️⃣ Generate JWT
     */
    const token = generateToken(user.id);

    /**
     * 9️⃣ Remove Password From Response
     */
    const { password: _, ...safeUser } = user;

    /**
     * 🔟 Create Response
     */
    const response = successResponse(
      {
        safeUser,
        token,
      },
      "User registered successfully",
      200,
    );

    /**
     * 1️⃣1️⃣ Set HTTP-only Cookie
     */
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("REGISTER_ERROR", error);
    return errorResponse("Internal server error", 500);
  }
}
