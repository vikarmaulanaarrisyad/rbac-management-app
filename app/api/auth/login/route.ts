import { errorResponse, successResponse } from "@/app/lib/api-response";
import { generateToken, verifyPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    /**
     * 1️⃣ Validate Required Fields
     */
    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    /**
     * 2️⃣ Normalize Email
     */
    const normalizedEmail = email.toLowerCase().trim();

    /**
     * 3️⃣ Find User
     */
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        Team: true,
      },
    });

    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    /**
     * 4️⃣ Verify Password
     */
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return errorResponse("Invalid email or password", 401);
    }

    /**
     * 5️⃣ Generate JWT
     */
    const token = generateToken(user.id);

    /**
     * 6️⃣ Remove Password From Response
     */
    const { password: _, ...safeUser } = user;

    /**
     * 7️⃣ Create Response
     */
    const response = successResponse(
      {
        safeUser,
        token,
      },
      "Login successful",
      200,
    );

    /**
     * 8️⃣ Set HTTP-only Cookie
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
    console.error("LOGIN_ERROR", error);
    return errorResponse("Internal server error", 500);
  }
}
