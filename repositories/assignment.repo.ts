import prisma from "@/lib/prisma";

const assignmentInclude = {
    class: {
        include: {
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
        },
    },
} as const;

const getAssignmentsBySchool = async (schoolId: string) => {
    return await prisma.assignment.findMany({
        where: {
            class: {
                schoolId,
            },
        },
        include: assignmentInclude,
        orderBy: {
            dueDate: "asc",
        },
    });
};

const getAssignmentsByTeacherUserId = async (userId: string) => {
    return await prisma.assignment.findMany({
        where: {
            class: {
                teacher: {
                    userId,
                },
            },
        },
        include: assignmentInclude,
        orderBy: {
            dueDate: "asc",
        },
    });
};

const getAssignmentsByStudentUserId = async (userId: string) => {
    return await prisma.assignment.findMany({
        where: {
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
        include: assignmentInclude,
        orderBy: {
            dueDate: "asc",
        },
    });
};

const getClassOptionsBySchool = async (schoolId: string) => {
    return await prisma.class.findMany({
        where: {
            schoolId,
        },
        include: {
            course: true,
        },
        orderBy: {
            startDate: "asc",
        },
    });
};

const getClassOptionsByTeacherUserId = async (userId: string) => {
    return await prisma.class.findMany({
        where: {
            teacher: {
                userId,
            },
        },
        include: {
            course: true,
        },
        orderBy: {
            startDate: "asc",
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

const createAssignment = async (request: { classId: string; title: string; dueDate: string }) => {
    return await prisma.assignment.create({
        data: {
            classId: request.classId,
            title: request.title,
            dueDate: new Date(request.dueDate),
        },
        include: assignmentInclude,
    });
};

const assignmentRepo = {
    getAssignmentsBySchool,
    getAssignmentsByTeacherUserId,
    getAssignmentsByStudentUserId,
    getClassOptionsBySchool,
    getClassOptionsByTeacherUserId,
    getClassById,
    createAssignment,
};

export default assignmentRepo;
