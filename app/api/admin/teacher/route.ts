import { fail, ok } from "@/lib/api-response";
import adminService from "@/services/admin.service";
import { NextRequest } from "next/server";

export async function GET() {
    try {
        const teachers = await adminService.getTeachers();
        return ok(teachers, 'Fetched successfully');
    } catch (error) {
        const message = (error as Error)?.message || "Failed to fetch teachers";
        return fail(message, 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await adminService.createTeacher(body);
        return ok(response, 'created successfully');

    } catch (error) {
        const message = (error as Error)?.message || "Failed to create teacher";
        return fail(message, 500);
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

        if (!id) {
            return fail("Missing teacher ID", 400);
        }

        const response = await adminService.updateTeacher(id, data);
        return ok(response, "updated successfully");
    } catch (error) {
        const message = (error as Error)?.message || "Failed to update teacher";
        return fail(message, 500);
    }
}
