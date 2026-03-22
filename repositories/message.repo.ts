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
    participantOne: {
        include: {
            profile: true,
        },
    },
    participantTwo: {
        include: {
            profile: true,
        },
    },
    messages: {
        include: {
            replyToMessage: {
                include: {
                    senderUser: {
                        include: {
                            profile: true,
                        },
                    },
                },
            },
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
            OR: [
                {
                    class: {
                        schoolId,
                    },
                },
                {
                    participantOne: {
                        schoolId,
                    },
                    participantTwo: {
                        schoolId,
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

const getThreadsByUserId = async (userId: string) => {
    return await prisma.messageThread.findMany({
        where: {
            OR: [
                {
                    teacher: {
                        userId,
                    },
                },
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
                {
                    participantOneUserId: userId,
                },
                {
                    participantTwoUserId: userId,
                },
            ],
        },
        include: threadInclude,
        orderBy: {
            updatedAt: "desc",
        },
    });
};

const getSchoolUsers = async (schoolId: string, excludeUserId: string) => {
    return await prisma.user.findMany({
        where: {
            schoolId,
            id: {
                not: excludeUserId,
            },
        },
        include: {
            profile: true,
        },
        orderBy: {
            email: "asc",
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

const getDirectThreadByParticipants = async (participantOneUserId: string, participantTwoUserId: string) => {
    return await prisma.messageThread.findUnique({
        where: {
            participantOneUserId_participantTwoUserId: {
                participantOneUserId,
                participantTwoUserId,
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

const createDirectThread = async (participantOneUserId: string, participantTwoUserId: string) => {
    return await prisma.messageThread.create({
        data: {
            participantOneUserId,
            participantTwoUserId,
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

const getUserById = async (userId: string) => {
    return await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            profile: true,
            student: true,
            teacher: true,
        },
    });
};

const sendMessage = async (
    threadId: string,
    senderUserId: string,
    content: string,
    imageUrl?: string,
    attachments?: unknown,
    replyToMessageId?: string,
    isForwarded?: boolean,
) => {
    return await prisma.$transaction(async (tx) => {
        const messageData: Prisma.MessageUncheckedCreateInput = {
            threadId,
            senderUserId,
            replyToMessageId,
            isForwarded: Boolean(isForwarded),
            content,
            imageUrl,
            attachments: attachments as Prisma.InputJsonValue | undefined,
        };

        await tx.message.create({
            data: messageData,
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

const deleteMessage = async (threadId: string, messageId: string) => {
    return await prisma.$transaction(async (tx) => {
        const thread = await tx.messageThread.findUnique({
            where: {
                id: threadId,
            },
            select: {
                createdAt: true,
            },
        });

        await tx.message.delete({
            where: {
                id: messageId,
            },
        });

        const latestMessage = await tx.message.findFirst({
            where: {
                threadId,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                createdAt: true,
            },
        });

        await tx.messageThread.update({
            where: {
                id: threadId,
            },
            data: {
                updatedAt: latestMessage?.createdAt ?? thread?.createdAt ?? new Date(),
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
    getThreadsByUserId,
    getSchoolUsers,
    getTeacherByUserId,
    getStudentByUserId,
    getEnrollmentByClassAndStudent,
    getClassById,
    getThreadByUnique,
    getDirectThreadByParticipants,
    getThreadById,
    createThread,
    createDirectThread,
    getGroupThreadByClassAndTeacher,
    createGroupThread,
    getUserById,
    sendMessage,
    deleteMessage,
};

export default messageRepo;
