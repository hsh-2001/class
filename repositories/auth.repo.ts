import prisma from "@/lib/prisma";
import { ICreateUserDTO } from "@/types/user";

const createUser = async (user: ICreateUserDTO) => {
    return await prisma.user.create({
        data: {
            email: user.email,
            password: user.password,
            role: user.role,
            ...(user.firstName && user.lastName && user.gender ? {
                profile: {
                    create: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        gender: user.gender,
                    },
                },
            } : {}),
        },
        include: {
            profile: true,
            student: true,
            teacher: true,
        },
    });
}

const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
        include: {
            profile: true,
            student: true,
            teacher: true,
        },
    });
}

const authRepo = {
    createUser,
    getUserByEmail,
};

export default authRepo;
