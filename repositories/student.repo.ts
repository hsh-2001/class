import prisma from "@/lib/prisma";
import { IStudentCourseEnrollmentItem } from "@/types/enrollment";
import type { IUpdateProfileDTO } from "@/types/profile";

const getProfileByUserId = async (userId: string) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: true,
        },
    });
};

const updateProfile = async (userId: string, request: IUpdateProfileDTO) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            username: request.username,
            profile: {
                upsert: {
                    create: {
                        firstName: request.firstName,
                        lastName: request.lastName,
                        phone: request.phone ?? null,
                        gender: request.gender,
                        profile_url: request.profileUrl ?? null,
                    },
                    update: {
                        firstName: request.firstName,
                        lastName: request.lastName,
                        phone: request.phone ?? null,
                        gender: request.gender,
                        profile_url: request.profileUrl ?? null,
                    },
                },
            },
        },
        include: {
            profile: true,
        },
    });
};

const getStudentByUserId = async (userId: string) => {
    return await prisma.student.findUnique({
        where: { userId },
        include: {
            user: true,
        },
    });
};

const getAvailableCourseEnrollments = async (
    studentId: string,
    schoolId: string,
): Promise<IStudentCourseEnrollmentItem[]> => {
    const courses = await prisma.course.findMany({
        where: {
            schoolId,
            classes: {
                some: {},
            },
        },
        include: {
            classes: {
                include: {
                    enrollments: {
                        where: {
                            studentId,
                        },
                        select: {
                            id: true,
                            createdAt: true,
                        },
                    },
                },
                orderBy: {
                    startDate: "asc",
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });

    return courses.flatMap((course) =>
        course.classes.map((item) => ({
            courseId: course.id,
            courseName: course.name,
            courseCode: course.code,
            courseDescription: course.description ?? "",
            courseBanner: course.courseBanner ?? "",
            classId: item.id,
            className: item.name,
            startDate: item.startDate.toISOString(),
            endDate: item.endDate?.toISOString() ?? null,
            isEnrolled: item.enrollments.length > 0,
            enrolledAt: item.enrollments[0]?.createdAt?.toISOString() ?? null,
        })),
    );
};

const getClassById = async (classId: string, schoolId: string) => {
    return await prisma.class.findFirst({
        where: {
            id: classId,
            schoolId,
        },
    });
};

const getEnrollmentByStudentAndClass = async (studentId: string, classId: string) => {
    return await prisma.enrollment.findUnique({
        where: {
            studentId_classId: {
                studentId,
                classId,
            },
        },
    });
};

const createEnrollment = async (studentId: string, classId: string) => {
    return await prisma.enrollment.create({
        data: {
            studentId,
            classId,
        },
    });
};

const studentRepo = {
    getProfileByUserId,
    updateProfile,
    getStudentByUserId,
    getAvailableCourseEnrollments,
    getClassById,
    getEnrollmentByStudentAndClass,
    createEnrollment,
};

export default studentRepo;
