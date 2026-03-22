import { $Enums } from "@/prisma/generated/browser";
import adminRepo from "@/repositories/admin.repo";
import authService from "@/services/auth.service";
import { IStudentListItem, TCreateStudentDTO } from "@/types/student";
import { ITeacherListItem } from "@/types/teacher";
import { ICreateUserDTO, IUpdateUserDTO } from "@/types/user";

const createStudent = async (studentData: TCreateStudentDTO) => {
    if (!studentData.email || !studentData.password || !studentData.firstName || !studentData.lastName || !studentData.gender) {
        throw new Error("MISSING_FIELDS");
    }

    const user = await authService.createStudentUser({
        schoolId: studentData.schoolId || "school-01",
        username: studentData.username || "",
        email: studentData.email,
        password: studentData.password,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        phone: studentData.phone,
        gender: studentData.gender,
    });

    if (!user) {
        throw new Error("FAILED_CREATE");
    }

    return await adminRepo.createStudent(user.id);
}

const getStudents = async (): Promise<IStudentListItem[]> => {
    const students = await adminRepo.getStudents();

    return students
        .filter((student) => student.user.profile)
        .map((student) => ({
            id: student.id,
            userId: student.userId,
            email: student.user.email,
            username: student.user.username,
            role: student.user.role as $Enums.Role,
            firstName: student.user.profile!.firstName,
            lastName: student.user.profile!.lastName,
            phone: student.user.profile!.phone,
            gender: student.user.profile!.gender as $Enums.Gender,
            dateOfBirth: student.user.createdAt,
        }));
}

const updateStudent = async (id: string, data: IUpdateUserDTO) => {
    return await adminRepo.updateStudent(id, data);
}

const getUserById = async (userId: string) => {
    return await adminRepo.getUserById(userId);
}

const createTeacher = async (request: ICreateUserDTO) => {
    const user = await authService.createTeacher({
        ...request,
        role: "TEACHER" as $Enums.Role,
        schoolId: request.schoolId || "school-01",
    });

    if (!user) {
        throw new Error("FAILED_CREATE");
    }

    return await adminRepo.createTeacher(user.id);
}

const getTeachers = async (): Promise<ITeacherListItem[]> => {
    const teachers = await adminRepo.getAllTeachers();

    return teachers.map((teacher) => ({
        id: teacher.id,
        userId: teacher.userId,
        email: teacher.user.email,
        role: teacher.user.role as $Enums.Role,
        username: teacher.user.username,
        firstName: teacher.user.profile?.firstName || "",
        lastName: teacher.user.profile?.lastName || "",
        phone: teacher.user.profile?.phone || "",
        schoolId: teacher.user.schoolId,
        gender: teacher.user.profile?.gender as $Enums.Gender || "OTHER",
    }));
}

const updateTeacher = async (id: string, data: IUpdateUserDTO) => {
    return await adminRepo.updateTeacher(id, data);
}


const adminService = {
    createStudent,
    getStudents,
    updateStudent,
    getUserById,
    createTeacher,
    getTeachers,
    updateTeacher,
};

export default adminService;
