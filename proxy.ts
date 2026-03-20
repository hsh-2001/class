import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import authService from "./services/auth.service";

export function proxy(request: NextRequest) {
    const exludedPaths = ['/api/auth/login', '/api/auth/register'];
    if (exludedPaths.some(p => request.nextUrl?.pathname.startsWith(p)) || !request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const isVerified = authService.verifyToken(token)
    if (!isVerified) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const user = jwt.decode(token);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("X-User", JSON.stringify(user));
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}