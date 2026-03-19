import { ICreateUserDTO } from "@/types/user";
import prisma from "@/lib/prisma";

const createUser = async (user: ICreateUserDTO) => {
    await prisma.user.create({
        data: {
            username: user.username,
            email: user.email,
            password: user.password,
            roleId: user.roleId,
        }
    });
}

const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
    });
}

export default {
    createUser,
    getUserByEmail,
};