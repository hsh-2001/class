import studentRepo from "@/repositories/student.repo";
import type { Gender } from "@/prisma/generated/enums";
import messageService from "@/services/message.service";
import { IStudentCourseEnrollmentItem } from "@/types/enrollment";
import { IProfile, IUpdateProfileDTO } from "@/types/profile";

type StudentProfileUser = {
    id: string;
    email: string;
    username: string;
    profile: {
        firstName: string;
        lastName: string;
        phone: string | null;
        gender: Gender;
        profile_url: string | null;
    } | null;
};

const mapProfile = (user: StudentProfileUser): IProfile => {
    return {
        userId: user.id,
        email: user.email,
        username: user.username ?? "",
        firstName: user.profile?.firstName ?? "",
        lastName: user.profile?.lastName ?? "",
        phone: user.profile?.phone ?? "",
        gender: user.profile?.gender ?? "MALE",
        profileUrl: user.profile?.profile_url ?? "",
    };
}

const getProfile = async (userId: string) => {
    const user = await studentRepo.getProfileByUserId(userId);
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    return mapProfile(user);
}

const updateProfile = async (userId: string, request: IUpdateProfileDTO) => {
    const user = await studentRepo.updateProfile(userId, request);
    return mapProfile(user);
}

const getCourseEnrollments = async (userId: string): Promise<IStudentCourseEnrollmentItem[]> => {
    const student = await studentRepo.getStudentByUserId(userId);
    if (!student) {
        throw new Error("STUDENT_NOT_FOUND");
    }

    return await studentRepo.getAvailableCourseEnrollments(student.id, student.user.schoolId);
}

const enrollInCourse = async (userId: string, classId: string) => {
    const student = await studentRepo.getStudentByUserId(userId);
    if (!student) {
        throw new Error("STUDENT_NOT_FOUND");
    }

    const classRecord = await studentRepo.getClassById(classId, student.user.schoolId);
    if (!classRecord) {
        throw new Error("CLASS_NOT_FOUND");
    }

    const existingEnrollment = await studentRepo.getEnrollmentByStudentAndClass(student.id, classId);
    if (existingEnrollment) {
        throw new Error("ALREADY_ENROLLED");
    }

    await studentRepo.createEnrollment(student.id, classId);
    const groupThread = await messageService.ensureClassGroupThreadForClass(classId);
    await messageService.notifyRealtimeParticipants(groupThread.id);
    return await studentRepo.getAvailableCourseEnrollments(student.id, student.user.schoolId);
}

const studentService = {
    getProfile,
    updateProfile,
    getCourseEnrollments,
    enrollInCourse,
};

export default studentService;
