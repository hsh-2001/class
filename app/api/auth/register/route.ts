import { ok, fail } from "@/lib/api-response";
import authService from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { schoolId, email, password, role, firstName, lastName, phone, gender, username } = body;
        await authService.createUser({
            schoolId,
            email,
            password,
            role: role ?? "STUDENT",
            firstName,
            lastName,
            phone,
            gender,
            username,
        });
        return ok({ message: "User created successfully" });
    } catch (error: unknown) {
        return fail((error as Error)?.message || "Failed to create user", 500);
    }

}
