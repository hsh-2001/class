import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import authService from "./services/auth.service";

export function proxy(request: NextRequest) {
    const exludedPaths = ['/api/auth/login', '/api/auth/register', '/api/socket', '/api/socket_io', '/api/auth/refresh'];
    if (exludedPaths.some(p => request.nextUrl?.pathname.startsWith(p)) || !request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    let user: jwt.JwtPayload | string;
    try {
        user = authService.verifyToken(token);
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
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
