import { IClassListItem, ICreateClassDTO } from "@/types/class";
import prisma from "@/lib/prisma";
import { ICreateCourseDTO, IUpdateCourseDTO } from "@/types/course";
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

const createCourse = async (request: ICreateCourseDTO) => {
    return await prisma.course.create({
        data: {
            name: request.name,
            code: request.code,
            description: request.description,
            courseBanner: request.courseBanner,
            schoolId: request.schoolId,
        },
    });
}

const updateCourse = async (request: IUpdateCourseDTO) => {
    return await prisma.course.update({
        where: {
            id: request.id,
        },
        data: {
            ...(request.name !== undefined ? { name: request.name } : {}),
            ...(request.code !== undefined ? { code: request.code } : {}),
            ...(request.courseBanner !== undefined ? { courseBanner: request.courseBanner } : {}),
            ...(request.description !== undefined ? { description: request.description } : {}),
        },
    });
}

const getAllCourses = async (schoolId: string) => {
    return await prisma.course.findMany({
        where: {
            schoolId: schoolId,
        },
        orderBy: {
            name: "asc",
        },
    });
}

const createClass = async (schoolId: string, request: ICreateClassDTO) => {
    return await prisma.class.create({
        data: {
            name: request.name,
            courseId: request.courseId,
            teacherId: request.teacherId,
            startDate: new Date(request.startDate),
            endDate: request.endDate ? new Date(request.endDate) : null,
            schoolId,
        },
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
    });
}

const getAllClasses = async (schoolId: string): Promise<IClassListItem[]> => {
    const classes = await prisma.class.findMany({
        where: {
            schoolId,
        },
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
        orderBy: {
            startDate: "asc",
        },
    });

    return classes.map((item) => ({
        id: item.id,
        name: item.name,
        courseId: item.courseId,
        teacherId: item.teacherId,
        startDate: item.startDate.toISOString(),
        endDate: item.endDate?.toISOString() ?? null,
        schoolId: item.schoolId ?? null,
        courseName: item.course.name,
        courseCode: item.course.code,
        teacherName: [
            item.teacher.user.profile?.firstName ?? "",
            item.teacher.user.profile?.lastName ?? "",
        ].join(" ").trim() || item.teacher.user.username || item.teacher.user.email,
    }));
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
    createCourse,
    getAllCourses,
    updateCourse,
    createClass,
    getAllClasses,
};

export default adminRepo;
