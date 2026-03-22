import { NextRequest } from "next/server";

interface IBaseApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export class BaseApiResponse<T> implements IBaseApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;

    constructor(data: T | undefined, success: boolean, message?: string) {
        this.data = data as T;
        this.success = success;
        this.message = message;
    }

    static ok<T>(data: T, message = "success"): BaseApiResponse<T> {
        return new BaseApiResponse<T>(data, true, message);
    }

    static error<T>(message = "error"): BaseApiResponse<T> {
        return new BaseApiResponse<T>(undefined, false, message);
    }
}

export function getUserFromHeader(req: NextRequest) {
    const userHeader = req.headers.get("X-User");

    if (!userHeader) {
        throw new Error("UNAUTHORIZED");
    };

    try {
        return JSON.parse(userHeader);
    } catch {
        return userHeader;
    }
}