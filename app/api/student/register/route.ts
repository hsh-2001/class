import { fail, ok } from "@/lib/api-response";
import authService from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;
        const username = body.username ?? body.name;
        const roleId = body.roleId ?? 1;

        if (!email || !password || !username) {
            return fail("Missing required fields", 400);
        }

        await authService.createUser({ email, password, username, roleId });
        return ok(null, "User created successfully", 201);
    } catch (error: unknown) {
        console.error("Failed to create user", error);
        return fail((error as Error)?.message || "Failed to create user", 500);
    }
}
