import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { Role, User } from "../types";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

/**
 * PASSWORD
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * JWT
 */
type TokenPayload = {
  userId: string;
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

/**
 * CURRENT USER
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const result = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!result) return null;
    const { password: _, ...user } = result;

    return user as User;
  } catch (error) {
    console.error("GET_CURRENT_USER_ERROR", error);
    return null;
  }
};

export const checkUserPermission = (
  user: User,
  requiredRole: Role,
): boolean => {
  const roleHierarchy = {
    [Role.GUEST]: 0,
    [Role.USER]: 1,
    [Role.MANAGER]: 2,
    [Role.ADMIN]: 3,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};
