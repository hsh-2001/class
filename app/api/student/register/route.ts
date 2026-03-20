import { fail, ok } from "@/lib/api-response";
import authService from "@/services/auth.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { schoolId, email, password, firstName, lastName, phone, gender } = body;

        if (!schoolId || !email || !password || !firstName || !lastName || !gender) {
            return fail("Missing required fields", 400);
        }

        await authService.createStudentUser({
            schoolId,
            email,
            password,
            firstName,
            lastName,
            phone,
            gender,
        });
        return ok(null, "User created successfully", 201);
    } catch (error: unknown) {
        console.error("Failed to create user", error);
        return fail((error as Error)?.message || "Failed to create user", 500);
    }
}
