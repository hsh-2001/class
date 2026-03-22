import prisma from "@/lib/prisma";
import { IUpdateUserDTO } from "@/types/user";

const createStudent = async (userId: string) => {
    return await prisma.student.create({
        data: { userId },
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
        },
    });
};

const getStudents = async () => {
    return await prisma.student.findMany({
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
        },
    });
}

const updateStudent = async (id: string, data: IUpdateUserDTO) => {
    const currentStudent = await prisma.student.findUnique({
        where: { id },
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
        },
    });

    if (!currentStudent) {
        throw new Error("STUDENT_NOT_FOUND");
    }

    return await updateUser(currentStudent.userId, currentStudent.user.profile?.id, data);
}

const getUserById = async (userId: string) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: true,
            student: true,
            teacher: true,
        },
    });
}

const getAllUsers = async () => {
    return await prisma.user.findMany({
        include: {
            profile: true,
            student: true,
            teacher: true,
        },
    });
}

const createTeacher = async (userId: string) => {
    await prisma.teacher.create({
        data: { userId },
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
        },
    });
}

const getAllTeachers = async () => {
    return await prisma.teacher.findMany({
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
        },
    });

}

const updateTeacher = async (id: string, data: IUpdateUserDTO) => {
    const currentTeacher = await prisma.teacher.findUnique({
        where: { id },
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
        },
    });

    if (!currentTeacher) {
        throw new Error("TEACHER_NOT_FOUND");
    }

    return await updateUser(currentTeacher.userId, currentTeacher.user.profile?.id, data);
}

const updateUser = async (userId: string, profileId: string | undefined, data: IUpdateUserDTO) => {
    const { email, username, firstName, lastName, phone, gender } = data;
    const shouldUpsertProfile =
        firstName !== undefined ||
        lastName !== undefined ||
        phone !== undefined ||
        gender !== undefined;

    return await prisma.user.update({
        where: { id: userId },
        data: {
            ...(email !== undefined ? { email } : {}),
            ...(username !== undefined ? { username } : {}),
            ...(shouldUpsertProfile
                ? profileId
                    ? {
                        profile: {
                            update: {
                                ...(firstName !== undefined ? { firstName } : {}),
                                ...(lastName !== undefined ? { lastName } : {}),
                                ...(phone !== undefined ? { phone } : {}),
                                ...(gender !== undefined ? { gender } : {}),
                            },
                        },
                    }
                    : {
                        profile: {
                            create: {
                                firstName: firstName ?? "",
                                lastName: lastName ?? "",
                                phone: phone ?? null,
                                gender: gender ?? "MALE",
                            },
                        },
                    }
                : {}),
        },
        include: {
            profile: true,
            student: true,
            teacher: true,
        },
    });
}


const adminRepo = {
    createStudent,
    getStudents,
    updateStudent,
    getUserById,
    getAllUsers,
    getAllTeachers,
    createTeacher,
    updateTeacher,
};

export default adminRepo;
