export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return fail("Missing required fields", 400);
        }

        await authService.createUser({ email, password, name });
        return ok(null, "User created successfully", 201);
    } catch (error: unknown) {
        console.error("Failed to create user", error);
        return fail((error as Error)?.message || "Failed to create user", 500);
    }
}