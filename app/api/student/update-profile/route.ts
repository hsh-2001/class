import { fail, ok } from "@/lib/api-response";
import studentService from "@/services/student.service";
import { getUserFromHeader } from "@/types/baseApi";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = getUserFromHeader(request) as { id: string };
        const profile = await studentService.getProfile(user.id);
        return ok(profile, "success");
    } catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        return fail(message, message === "UNAUTHORIZED" ? 401 : 500);
    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = getUserFromHeader(request) as { id: string };
        const body = await request.json();
        const profile = await studentService.updateProfile(user.id, body);
        return ok(profile, "success");
    } catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        return fail(message, message === "UNAUTHORIZED" ? 401 : 500);
    }
};
