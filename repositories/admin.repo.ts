import prisma from "@/lib/prisma";
import { TCreateStudentDTO } from "@/types/student";

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

const updateStudent = async (id: string, data: Partial<TCreateStudentDTO>) => {
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

    const { email, firstName, lastName, phone, gender } = data;

    return await prisma.user.update({
        where: { id: currentStudent.userId },
        data: {
            ...(email ? { email } : {}),
            ...((firstName || lastName || phone !== undefined || gender) ? {
                profile: currentStudent.user.profile
                    ? {
                        update: {
                            ...(firstName ? { firstName } : {}),
                            ...(lastName ? { lastName } : {}),
                            ...(phone !== undefined ? { phone } : {}),
                            ...(gender ? { gender } : {}),
                        },
                    }
                    : {
                        create: {
                            firstName: firstName ?? "",
                            lastName: lastName ?? "",
                            phone: phone ?? null,
                            gender: gender ?? "MALE",
                        },
                    },
            } : {}),
        },
        include: {
            profile: true,
            student: true,
        },
    });
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


const adminRepo = {
    createStudent,
    getStudents,
    updateStudent,
    getUserById,
    getAllUsers,
    getAllTeachers,
    createTeacher,
};

export default adminRepo;
