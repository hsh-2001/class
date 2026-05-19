import { fail, ok } from "@/lib/api-response";
import db from "@/lib/db";

export async function GET() {
  try {
    const result = await db.query("SELECT * FROM users");
    return ok(result.rows);
  } catch (error: unknown) {
    return fail((error as Error)?.message || "Failed to fetch users", 500);
  }
}
