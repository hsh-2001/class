import prisma from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/client";

const threadInclude = {
    class: {
        include: {
            course: true,
            enrollments: {
                include: {
                    student: {
                        include: {
                            user: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    teacher: {
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
        },
    },
    student: {
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
        },
    },
    messages: {
        include: {
            senderUser: {
                include: {
                    profile: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    },
} as const;

const getThreadsBySchool = async (schoolId: string) => {
    return await prisma.messageThread.findMany({
        where: {
            class: {
                schoolId,
            },
        },
        include: threadInclude,
        orderBy: {
            updatedAt: "desc",
        },
    });
};

const getThreadsByTeacherUserId = async (userId: string) => {
    return await prisma.messageThread.findMany({
        where: {
            teacher: {
                userId,
            },
        },
        include: threadInclude,
        orderBy: {
            updatedAt: "desc",
        },
    });
};

const getThreadsByStudentUserId = async (userId: string) => {
    return await prisma.messageThread.findMany({
        where: {
            OR: [
                {
                    student: {
                        userId,
                    },
                },
                {
                    studentId: null,
                    class: {
                        enrollments: {
                            some: {
                                student: {
                                    userId,
                                },
                            },
                        },
                    },
                },
            ],
        },
        include: threadInclude,
        orderBy: {
            updatedAt: "desc",
        },
    });
};

const getTeacherClassesWithStudents = async (userId: string) => {
    return await prisma.class.findMany({
        where: {
            teacher: {
                userId,
            },
        },
        include: {
            course: true,
            enrollments: {
                include: {
                    student: {
                        include: {
                            user: {
                                include: {
                                    profile: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            startDate: "asc",
        },
    });
};

const getTeacherByUserId = async (userId: string) => {
    return await prisma.teacher.findUnique({
        where: {
            userId,
        },
    });
};

const getStudentByUserId = async (userId: string) => {
    return await prisma.student.findUnique({
        where: {
            userId,
        },
    });
};

const getEnrollmentByClassAndStudent = async (classId: string, studentId: string) => {
    return await prisma.enrollment.findUnique({
        where: {
            studentId_classId: {
                studentId,
                classId,
            },
        },
    });
};

const getClassById = async (classId: string) => {
    return await prisma.class.findUnique({
        where: {
            id: classId,
        },
        include: {
            teacher: true,
        },
    });
};

const getThreadByUnique = async (classId: string, teacherId: string, studentId: string) => {
    return await prisma.messageThread.findUnique({
        where: {
            classId_teacherId_studentId: {
                classId,
                teacherId,
                studentId,
            },
        },
        include: threadInclude,
    });
};

const getThreadById = async (threadId: string) => {
    return await prisma.messageThread.findUnique({
        where: {
            id: threadId,
        },
        include: threadInclude,
    });
};

const createThread = async (classId: string, teacherId: string, studentId: string) => {
    return await prisma.messageThread.create({
        data: {
            classId,
            teacherId,
            studentId,
        },
        include: threadInclude,
    });
};

const getGroupThreadByClassAndTeacher = async (classId: string, teacherId: string) => {
    return await prisma.messageThread.findFirst({
        where: {
            classId,
            teacherId,
            studentId: null,
        },
        include: threadInclude,
    });
};

const createGroupThread = async (classId: string, teacherId: string) => {
    return await prisma.messageThread.create({
        data: {
            classId,
            teacherId,
            studentId: null,
        },
        include: threadInclude,
    });
};

const sendMessage = async (threadId: string, senderUserId: string, content: string, imageUrl?: string, attachments?: unknown) => {
    return await prisma.$transaction(async (tx) => {
        await tx.message.create({
            data: {
                threadId,
                senderUserId,
                content,
                imageUrl,
                attachments: attachments as Prisma.InputJsonValue | undefined,
            },
        });

        await tx.messageThread.update({
            where: {
                id: threadId,
            },
            data: {
                updatedAt: new Date(),
            },
        });

        return await tx.messageThread.findUnique({
            where: {
                id: threadId,
            },
            include: threadInclude,
        });
    });
};

const messageRepo = {
    getThreadsBySchool,
    getThreadsByTeacherUserId,
    getThreadsByStudentUserId,
    getTeacherClassesWithStudents,
    getTeacherByUserId,
    getStudentByUserId,
    getEnrollmentByClassAndStudent,
    getClassById,
    getThreadByUnique,
    getThreadById,
    createThread,
    getGroupThreadByClassAndTeacher,
    createGroupThread,
    sendMessage,
};

export default messageRepo;
