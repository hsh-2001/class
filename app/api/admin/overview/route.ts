import { fail, ok } from "@/lib/api-response";
import adminService from "@/services/admin.service";
import { getUserFromHeader } from "@/types/baseApi";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = getUserFromHeader(req);
        const result = await adminService.getOverview(user.id);
        return ok(result, 'success');
    } catch (error) {
        const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
        return fail(message);
    }
}