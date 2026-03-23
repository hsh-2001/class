import { fail, ok } from "@/lib/api-response";
import linkPreviewService from "@/services/link-preview.service";
import { getUserFromHeader } from "@/types/baseApi";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        getUserFromHeader(request);
        const url = request.nextUrl.searchParams.get("url") ?? "";
        const response = await linkPreviewService.getLinkPreview({ url });
        return ok(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load link preview";
        const status = message === "UNAUTHORIZED"
            ? 401
            : message === "MISSING_FIELDS" || message === "INVALID_URL"
                ? 400
                : 500;

        return fail(message, status);
    }
}
