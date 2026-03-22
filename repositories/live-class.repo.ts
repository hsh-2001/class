import prisma from "@/lib/prisma";

const liveClassInclude = {
    course: true,
    teacher: {
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
        },
    },
} as const;

const getLiveClassesBySchool = async (schoolId: string) => {
    return await prisma.class.findMany({
        where: {
            schoolId,
        },
        include: liveClassInclude,
        orderBy: {
            startDate: "asc",
        },
    });
};

const getLiveClassesByTeacherUserId = async (userId: string) => {
    return await prisma.class.findMany({
        where: {
            teacher: {
                userId,
            },
        },
        include: liveClassInclude,
        orderBy: {
            startDate: "asc",
        },
    });
};

const getLiveClassesByStudentUserId = async (userId: string) => {
    return await prisma.class.findMany({
        where: {
            enrollments: {
                some: {
                    student: {
                        userId,
                    },
                },
            },
        },
        include: liveClassInclude,
        orderBy: {
            startDate: "asc",
        },
    });
};

const liveClassRepo = {
    getLiveClassesBySchool,
    getLiveClassesByTeacherUserId,
    getLiveClassesByStudentUserId,
};

export default liveClassRepo;
