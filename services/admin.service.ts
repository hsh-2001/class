import adminRepo from "@/repositories/admin.repo";
import authService from "@/services/auth.service";
import { IStudentListItem, TCreateStudentDTO } from "@/types/student";

const createStudent = async (studentData: TCreateStudentDTO) => {
    if (!studentData.email || !studentData.password || !studentData.firstName || !studentData.lastName || !studentData.gender) {
        throw new Error("MISSING_FIELDS");
    }

    const user = await authService.createStudentUser({
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
            role: student.user.role,
            firstName: student.user.profile!.firstName,
            lastName: student.user.profile!.lastName,
            phone: student.user.profile!.phone,
            gender: student.user.profile!.gender,
        }));
}

const updateStudent = async (id: string, data: Partial<TCreateStudentDTO>) => {
    return await adminRepo.updateStudent(id, data);
}

const getUserById = async (userId: string) => {
    return await adminRepo.getUserById(userId);
}

const adminService = {
    createStudent,
    getStudents,
    updateStudent,
    getUserById,
};

export default adminService;
