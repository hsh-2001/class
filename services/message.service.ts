import type { Role } from "@/prisma/generated/enums";
import messageRepo from "@/repositories/message.repo";
import { ICreateMessageThreadDTO, IMessageClassOption, IMessageItem, IMessagePageData, IMessageThreadItem, ISendMessageDTO } from "@/types/message";

type MessageUserContext = {
    id: string;
    role: Role;
    schoolId: string;
};

const getDisplayName = (
    user: {
        email: string;
        username: string;
        profile: { firstName: string; lastName: string } | null;
    },
) => [user.profile?.firstName ?? "", user.profile?.lastName ?? ""].join(" ").trim() || user.username || user.email;

const mapMessageItem = (
    item: Awaited<ReturnType<typeof messageRepo.getThreadsBySchool>>[number]["messages"][number],
): IMessageItem => ({
    id: item.id,
    senderUserId: item.senderUserId,
    senderName: getDisplayName(item.senderUser),
    senderRole: item.senderUser.role,
    content: item.content,
    createdAt: item.createdAt.toISOString(),
});

const mapThreadItem = (
    item: Awaited<ReturnType<typeof messageRepo.getThreadsBySchool>>[number],
): IMessageThreadItem => ({
    id: item.id,
    classId: item.classId,
    className: item.class.name,
    courseName: item.class.course.name,
    courseCode: item.class.course.code,
    teacherId: item.teacherId,
    teacherName: getDisplayName(item.teacher.user),
    studentId: item.studentId,
    studentName: getDisplayName(item.student.user),
    updatedAt: item.updatedAt.toISOString(),
    lastMessagePreview: item.messages[item.messages.length - 1]?.content ?? "No messages yet.",
    messages: item.messages.map(mapMessageItem),
});

const mapTeacherClassOptions = (
    items: Awaited<ReturnType<typeof messageRepo.getTeacherClassesWithStudents>>,
): IMessageClassOption[] =>
    items.map((item) => ({
        value: item.id,
        label: `${item.name} - ${item.course.name} (${item.course.code})`,
        students: item.enrollments.map((enrollment) => ({
            value: enrollment.student.id,
            label: getDisplayName(enrollment.student.user),
        })),
    }));

const getMessagePageData = async (user: MessageUserContext): Promise<IMessagePageData> => {
    if (user.role === "ADMIN") {
        const threads = await messageRepo.getThreadsBySchool(user.schoolId);
        return {
            currentUserId: user.id,
            canCreateThread: false,
            canSendMessage: false,
            classOptions: [],
            threads: threads.map(mapThreadItem),
        };
    }

    if (user.role === "TEACHER") {
        const [threads, classOptions] = await Promise.all([
            messageRepo.getThreadsByTeacherUserId(user.id),
            messageRepo.getTeacherClassesWithStudents(user.id),
        ]);

        return {
            currentUserId: user.id,
            canCreateThread: true,
            canSendMessage: true,
            classOptions: mapTeacherClassOptions(classOptions),
            threads: threads.map(mapThreadItem),
        };
    }

    const threads = await messageRepo.getThreadsByStudentUserId(user.id);
    return {
        currentUserId: user.id,
        canCreateThread: false,
        canSendMessage: true,
        classOptions: [],
        threads: threads.map(mapThreadItem),
    };
};

const createThreadForTeacher = async (user: MessageUserContext, request: ICreateMessageThreadDTO) => {
    if (user.role !== "TEACHER") {
        throw new Error("UNAUTHORIZED");
    }

    if (!request.classId || !request.studentId) {
        throw new Error("MISSING_FIELDS");
    }

    const teacher = await messageRepo.getTeacherByUserId(user.id);
    if (!teacher) {
        throw new Error("UNAUTHORIZED");
    }

    const classItem = await messageRepo.getClassById(request.classId);
    if (!classItem || classItem.teacherId !== teacher.id) {
        throw new Error("UNAUTHORIZED");
    }

    const enrollment = await messageRepo.getEnrollmentByClassAndStudent(request.classId, request.studentId);
    if (!enrollment) {
        throw new Error("UNAUTHORIZED");
    }

    const existingThread = await messageRepo.getThreadByUnique(request.classId, teacher.id, request.studentId);
    if (!existingThread) {
        await messageRepo.createThread(request.classId, teacher.id, request.studentId);
    }

    return await getMessagePageData(user);
};

const sendMessageForUser = async (user: MessageUserContext, request: ISendMessageDTO) => {
    if (!request.threadId || !request.content?.trim()) {
        throw new Error("MISSING_FIELDS");
    }

    if (user.role === "ADMIN") {
        throw new Error("UNAUTHORIZED");
    }

    const thread = await messageRepo.getThreadById(request.threadId);
    if (!thread) {
        throw new Error("THREAD_NOT_FOUND");
    }

    if (user.role === "TEACHER" && thread.teacher.userId !== user.id) {
        throw new Error("UNAUTHORIZED");
    }

    if (user.role === "STUDENT" && thread.student.userId !== user.id) {
        throw new Error("UNAUTHORIZED");
    }

    await messageRepo.sendMessage(request.threadId, user.id, request.content.trim());
    return await getMessagePageData(user);
};

const messageService = {
    getMessagePageData,
    createThreadForTeacher,
    sendMessageForUser,
};

export default messageService;
