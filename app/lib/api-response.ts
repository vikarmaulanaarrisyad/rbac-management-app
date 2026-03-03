import { NextResponse } from "next/server";

// Generic Success Response
export function successResponse<T>(
  data: T,
  message: string = "Success",
  status: number = 200,
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

// Generic Error Response
export function errorResponse(
  message: string = "Internal Server Error",
  status: number = 500,
) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status },
  );
}
