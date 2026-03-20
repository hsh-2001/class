import { fail, ok } from "@/lib/api-response";
import authService from "@/services/auth.service";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return fail("Missing required fields", 400);
    }

    const user = await authService.getUserByEmail(email);
    return ok(user);
  } catch (error: unknown) {
    return fail((error as Error)?.message || "Failed to fetch user", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, email } = body;
    if (!password || !email) {
      return fail("Missing required fields", 400);
    }
    const result = await authService.login(email, password);
    return ok(result, "User logged in successfully");
  } catch (error: unknown) {
    const message = (error as Error)?.message || "Login failed";
    if (message === "INVALID_CREDENTIALS") {
      return fail("Invalid email or password", 401);
    }
    return fail(message, 500);
  }
}
