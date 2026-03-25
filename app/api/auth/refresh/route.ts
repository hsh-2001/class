import { fail, ok } from "@/lib/api-response";
import authService from "@/services/auth.service";
import { NextRequest } from "next/server";
import jwt, { SignOptions } from "jsonwebtoken";
import { IUserDTO } from "@/types/user";

export async function POST(req: NextRequest) {
    try {
        const accessToken = req.headers.get("Authorization")?.split(" ")[1];
        if (!accessToken) {
            return fail("Unauthorized", 401);
        }
        const isValid = authService.verifyToken(accessToken);
        if (!isValid) {
            return fail("Unauthorized", 401);
        }
        const user = jwt.decode(accessToken) as IUserDTO | null;
        if (!user) {
            return fail("Unauthorized", 401);
        }
        const payload = { id: user.id, email: user.email, role: user.role, schoolId: user.schoolId };
        const options: SignOptions = { expiresIn: String(process.env.JWT_EXPIRES_IN) || "1h" };
        const newToken = await jwt.sign(payload, process.env.JWT_SECRET!, options);
        const refreshToken = await authService.generateRefreshToken(user);
        return ok({ token: newToken, refreshToken }, 'success');
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return fail(message);
    }
}