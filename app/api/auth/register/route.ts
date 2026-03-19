import { ok, fail } from "@/lib/api-response";
import authService from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, username, roleId } = body;

        if (!email || !password || !username || !roleId) {
            return fail("Missing required fields", 400);
        }

        await authService.createUser({ email, password, username, roleId });
        return ok({ message: "User created successfully" });
    } catch (error: unknown) {
        return fail((error as Error)?.message || "Failed to create user", 500);
    }

}