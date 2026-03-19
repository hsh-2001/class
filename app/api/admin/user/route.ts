import { fail, ok } from "@/lib/api-response";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findMany();
    return ok(user);
  } catch (error: unknown) {
    return fail((error as Error)?.message || "Failed to fetch users", 500);
  }
}
