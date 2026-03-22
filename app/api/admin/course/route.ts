import { fail, ok } from "@/lib/api-response";
import adminService from "@/services/admin.service";
import { getUserFromHeader } from "@/types/baseApi";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = getUserFromHeader(request);
        const schoolId = user?.schoolId || "school-01";
        const courses = await adminService.getAllCourses(schoolId);
        return ok(courses, 'Courses retrieved successfully');
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to get courses";
        return fail(message, 500);
    }
}

export async function POST(request: NextRequest) {
    const user = getUserFromHeader(request);
    const schoolId = user?.schoolId || "school-01";
    const body = await request.json();
    const { name, code, description } = body;
    if (!name || !code || !description) {
        return fail("Missing required fields", 400);
    }

    try {
        const response = await adminService.createCourse({ schoolId, name, code, description });
        return ok(response, 'Course created successfully');
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create course";
        return fail(message, 500);
    }


}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, code, description } = body;

        if (!id) {
            return fail("Missing course ID", 400);
        }

        const response = await adminService.updateCourse({ id, name, code, description });
        return ok(response, "Course updated successfully");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update course";
        return fail(message, 500);
    }
}
