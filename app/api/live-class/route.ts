import { fail, ok } from "@/lib/api-response";
import liveClassService from "@/services/live-class.service";
import { getUserFromHeader } from "@/types/baseApi";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = getUserFromHeader(request) as { id: string; role: "ADMIN" | "STUDENT" | "TEACHER"; schoolId: string };
        const response = await liveClassService.getLiveClassesForUser(user);
        return ok(response, "Live classes retrieved successfully");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch live classes";
        return fail(message, message === "UNAUTHORIZED" ? 401 : 500);
    }
}
