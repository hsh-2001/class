import { fail, ok } from "@/lib/api-response";
import messageService from "@/services/message.service";
import { getUserFromHeader } from "@/types/baseApi";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const user = getUserFromHeader(request) as { id: string; role: "ADMIN" | "STUDENT" | "TEACHER"; schoolId: string };
        const body = await request.json();
        const response = await messageService.sendMessageForUser(user, body);
        return ok(response, "Message sent successfully");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to send message";
        const status = message === "UNAUTHORIZED"
            ? 401
            : message === "THREAD_NOT_FOUND"
                ? 404
                : message === "MISSING_FIELDS" || message === "INVALID_ATTACHMENTS" || message === "ATTACHMENT_TOO_LARGE"
                    ? 400
                    : 500;
        return fail(message, status);
    }
}
