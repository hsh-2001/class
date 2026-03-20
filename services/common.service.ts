import { IUserDTO } from "@/types/user";
import { NextRequest } from "next/server";

const commonService = () => {
    const getUserHeader = (request: NextRequest): IUserDTO | null => {
        const user = request.headers.get("X-User");
        if (!user) {
            return null;
        }
        try {
            return JSON.parse(user);
        } catch {
            return null;
        }
    }

    return {
        getUserHeader,
    }
}

export default commonService();