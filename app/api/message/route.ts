import { fail, ok } from "@/lib/api-response";
import messageService from "@/services/message.service";
import { getUserFromHeader } from "@/types/baseApi";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = getUserFromHeader(request) as { id: string; role: "ADMIN" | "STUDENT" | "TEACHER"; schoolId: string };
        const response = await messageService.getMessagePageData(user);
        return ok(response, "Messages retrieved successfully");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch messages";
        return fail(message, message === "UNAUTHORIZED" ? 401 : 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = getUserFromHeader(request) as { id: string; role: "ADMIN" | "STUDENT" | "TEACHER"; schoolId: string };
        const body = await request.json();
        const response = await messageService.createThreadForTeacher(user, body);
        return ok(response, "Conversation created successfully", 201);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create conversation";
        const status = message === "UNAUTHORIZED"
            ? 401
            : message === "MISSING_FIELDS" || message === "INVALID_RECIPIENT"
                ? 400
                : 500;
        return fail(message, status);
    }
}
