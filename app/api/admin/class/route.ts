import { fail, ok } from "@/lib/api-response";
import adminService from "@/services/admin.service";
import { getUserFromHeader } from "@/types/baseApi";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = getUserFromHeader(request) as { schoolId?: string };
        const schoolId = user?.schoolId || "school-01";
        const classes = await adminService.getAllClasses(schoolId);
        return ok(classes, "Classes retrieved successfully");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to get classes";
        return fail(message, 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = getUserFromHeader(request) as { schoolId?: string };
        const schoolId = user?.schoolId || "school-01";
        const body = await request.json();
        const response = await adminService.createClass(schoolId, body);
        return ok(response, "Class created successfully", 201);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create class";
        return fail(message, 500);
    }
}
