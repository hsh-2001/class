import { fail, ok } from "@/lib/api-response";
import adminService from "@/services/admin.service";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = await adminService.createStudent(body);
        return ok(result, 'success');
    } catch (error) {
        const message = (error as Error)?.message || "Failed to create student";
        return fail(message, 500);
    }
};

export async function GET() {
    try {
        const students = await adminService.getStudents();
        return ok(students, 'success');
    } catch (error) {
        const message = (error as Error)?.message || "Failed to fetch students";
        return fail(message, 500);
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        if (!id) {
            return fail("Missing student ID", 400);
        }
        const result = await adminService.updateStudent(id, data);
        return ok(result, 'success');
    } catch (error) {
        const message = (error as Error)?.message || "Failed to update student";
        return fail(message, 500);
    }
};

export async function DELETE(request: Request) {

};