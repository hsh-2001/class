import { ok, fail } from "@/lib/api-response";
import { Role } from "@/prisma/generated/enums";
import authService from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, role, firstName, lastName, phone, gender } = body;

        if (!email || !password) {
            return fail("Missing required fields", 400);
        }

        await authService.createUser({
            email,
            password,
            role: role ?? Role.STUDENT,
            firstName,
            lastName,
            phone,
            gender,
        });
        return ok({ message: "User created successfully" });
    } catch (error: unknown) {
        return fail((error as Error)?.message || "Failed to create user", 500);
    }

}
