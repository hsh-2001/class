import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const exludedPaths = ['/api/auth/login', '/api/auth/register'];
    if (exludedPaths.some(p => request.nextUrl?.pathname.startsWith(p))) {
        return NextResponse.next();
    }
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = jwt.decode(token);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
}