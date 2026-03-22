import { fail, ok } from "@/lib/api-response";
import studentService from "@/services/student.service";
import { getUserFromHeader } from "@/types/baseApi";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = getUserFromHeader(request) as { id: string; role?: string };
        if (user.role !== "STUDENT") {
            return fail("UNAUTHORIZED", 401);
        }
        const courses = await studentService.getCourseEnrollments(user.id);
        return ok(courses, "Courses retrieved successfully");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to get course enrollments";
        return fail(message, message === "UNAUTHORIZED" ? 401 : 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = getUserFromHeader(request) as { id: string; role?: string };
        if (user.role !== "STUDENT") {
            return fail("UNAUTHORIZED", 401);
        }
        const body = await request.json();
        const { classId } = body;

        if (!classId) {
            return fail("Missing required fields", 400);
        }

        const courses = await studentService.enrollInCourse(user.id, classId);
        return ok(courses, "Course enrolled successfully");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to enroll in course";
        return fail(message, message === "UNAUTHORIZED" ? 401 : 500);
    }
}
