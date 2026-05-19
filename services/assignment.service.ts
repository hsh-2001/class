import assignmentRepo from "@/repositories/assignment.repo";
import { IAssignmentClassOption, IAssignmentListItem, IAssignmentPageData, ICreateAssignmentDTO } from "@/types/assignment";
import type { Role } from "@/types/enums";

type AssignmentUserContext = {
    id: string;
    role: Role;
    schoolId: string;
};

const mapAssignment = (
    assignment: Awaited<ReturnType<typeof assignmentRepo.getAssignmentsBySchool>>[number],
): IAssignmentListItem => ({
    id: assignment.id,
    title: assignment.title,
    dueDate: assignment.dueDate.toISOString(),
    createdAt: assignment.createdAt.toISOString(),
    classId: assignment.classId,
    className: assignment.class.name,
    courseName: assignment.class.course.name,
    courseCode: assignment.class.course.code,
    teacherName:
        [assignment.class.teacher.user.profile?.firstName ?? "", assignment.class.teacher.user.profile?.lastName ?? ""]
            .join(" ")
            .trim() || assignment.class.teacher.user.username || assignment.class.teacher.user.email,
});

const mapClassOption = (
    classItem: Awaited<ReturnType<typeof assignmentRepo.getClassOptionsBySchool>>[number],
): IAssignmentClassOption => ({
    value: classItem.id,
    label: `${classItem.name} - ${classItem.course.name} (${classItem.course.code})`,
});

const getAssignmentsForUser = async (user: AssignmentUserContext): Promise<IAssignmentPageData> => {
    if (user.role === "ADMIN") {
        const [assignments, classOptions] = await Promise.all([
            assignmentRepo.getAssignmentsBySchool(user.schoolId),
            assignmentRepo.getClassOptionsBySchool(user.schoolId),
        ]);

        return {
            assignments: assignments.map(mapAssignment),
            classOptions: classOptions.map(mapClassOption),
            canManage: true,
        };
    }

    if (user.role === "TEACHER") {
        const [assignments, classOptions] = await Promise.all([
            assignmentRepo.getAssignmentsByTeacherUserId(user.id),
            assignmentRepo.getClassOptionsByTeacherUserId(user.id),
        ]);

        return {
            assignments: assignments.map(mapAssignment),
            classOptions: classOptions.map(mapClassOption),
            canManage: true,
        };
    }

    const assignments = await assignmentRepo.getAssignmentsByStudentUserId(user.id);
    return {
        assignments: assignments.map(mapAssignment),
        classOptions: [],
        canManage: false,
    };
};

const createAssignmentForUser = async (user: AssignmentUserContext, request: ICreateAssignmentDTO) => {
    if (user.role === "STUDENT") {
        throw new Error("UNAUTHORIZED");
    }

    if (!request.classId || !request.title || !request.dueDate) {
        throw new Error("MISSING_FIELDS");
    }

    const classItem = await assignmentRepo.getClassById(request.classId);
    if (!classItem) {
        throw new Error("CLASS_NOT_FOUND");
    }

    if (user.role === "ADMIN" && classItem.schoolId !== user.schoolId) {
        throw new Error("UNAUTHORIZED");
    }

    if (user.role === "TEACHER" && classItem.teacher.userId !== user.id) {
        throw new Error("UNAUTHORIZED");
    }

    await assignmentRepo.createAssignment(request);
    return await getAssignmentsForUser(user);
};

const assignmentService = {
    getAssignmentsForUser,
    createAssignmentForUser,
};

export default assignmentService;
