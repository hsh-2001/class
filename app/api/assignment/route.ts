import { fail, ok } from "@/lib/api-response";
import assignmentService from "@/services/assignment.service";
import { getUserFromHeader } from "@/types/baseApi";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = getUserFromHeader(request) as { id: string; role: "ADMIN" | "STUDENT" | "TEACHER"; schoolId: string };
        const response = await assignmentService.getAssignmentsForUser(user);
        return ok(response, "Assignments retrieved successfully");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch assignments";
        return fail(message, message === "UNAUTHORIZED" ? 401 : 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = getUserFromHeader(request) as { id: string; role: "ADMIN" | "STUDENT" | "TEACHER"; schoolId: string };
        const body = await request.json();
        const response = await assignmentService.createAssignmentForUser(user, body);
        return ok(response, "Assignment created successfully", 201);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create assignment";
        return fail(message, message === "UNAUTHORIZED" ? 401 : 500);
    }
}
