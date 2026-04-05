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

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { classId, ...updateData } = body;
        if (!classId) {
            return fail("Class ID is required", 400);
        }
        const response = await adminService.updateClass(classId, updateData);
        return ok(response, "Class updated successfully");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update class";
        return fail(message, 500);
    }
}


export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const response = await adminService.deleteClass(String(id));
        return ok(response);
    } catch {
        return fail("Server error", 500);
    }
};