import { emitMessagePageDataToUser } from "@/lib/socket-server";
import type { Role } from "@/prisma/generated/enums";
import messageRepo from "@/repositories/message.repo";
import {
    ICreateMessageThreadDTO,
    IMessageAttachment,
    IMessageClassOption,
    IMessageItem,
    IMessagePageData,
    IMessageSocketUser,
    ISendMessageDTO,
    MESSAGE_ATTACHMENT_MAX_SIZE,
} from "@/types/message";

type MessageUserContext = {
    id: string;
    role: Role;
    schoolId: string;
};

const mapUserContext = (user: IMessageSocketUser): MessageUserContext => ({
    id: user.id,
    role: user.role,
    schoolId: user.schoolId,
});

const getDisplayName = (
    user: {
        email: string;
        username: string;
        profile: { firstName: string; lastName: string } | null;
    },
) => [user.profile?.firstName ?? "", user.profile?.lastName ?? ""].join(" ").trim() || user.username || user.email;

const normalizeAttachments = (
    attachments: unknown,
    legacyImageUrl?: string | null,
): IMessageAttachment[] => {
    const normalized = Array.isArray(attachments)
        ? attachments.flatMap((item) => {
            if (!item || typeof item !== "object") {
                return [];
            }

            const candidate = item as Partial<IMessageAttachment>;
            if (
                typeof candidate.url !== "string"
                || typeof candidate.name !== "string"
                || typeof candidate.mimeType !== "string"
                || typeof candidate.size !== "number"
                || (candidate.kind !== "IMAGE" && candidate.kind !== "FILE")
            ) {
                return [];
            }

            return [{
                url: candidate.url,
                name: candidate.name,
                mimeType: candidate.mimeType,
                size: candidate.size,
                kind: candidate.kind,
            }];
        })
        : [];

    if (normalized.length > 0) {
        return normalized;
    }

    if (!legacyImageUrl) {
        return [];
    }

    return [{
        url: legacyImageUrl,
        name: "Photo",
        mimeType: "image/*",
        size: 0,
        kind: "IMAGE",
    }];
};

const getLastMessagePreview = (message?: { content: string; attachments: IMessageAttachment[] }) => {
    if (!message) {
        return "No messages yet.";
    }

    if (message.content) {
        return message.content;
    }

    if (message.attachments.length === 1) {
        return message.attachments[0]?.kind === "IMAGE"
            ? "Photo"
            : `File: ${message.attachments[0]?.name ?? "Attachment"}`;
    }

    if (message.attachments.length > 1) {
        return `${message.attachments.length} attachments`;
    }

    return "No messages yet.";
};

const mapMessageItem = (
    item: Awaited<ReturnType<typeof messageRepo.getThreadsBySchool>>[number]["messages"][number],
): IMessageItem => {
    const attachments = normalizeAttachments(item.attachments, item.imageUrl);

    return {
        id: item.id,
        senderUserId: item.senderUserId,
        senderName: getDisplayName(item.senderUser),
        senderRole: item.senderUser.role,
        content: item.content,
        attachments,
        imageUrl: item.imageUrl ?? undefined,
        createdAt: item.createdAt.toISOString(),
    };
};

const mapThreadItem = (
    item: Awaited<ReturnType<typeof messageRepo.getThreadsBySchool>>[number],
) => {
    const messages = item.messages.map(mapMessageItem);
    const lastMessage = messages[messages.length - 1];

    return {
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
        lastMessagePreview: getLastMessagePreview(lastMessage),
        messages,
    };
};

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

const notifyRealtimeParticipants = async (threadId: string) => {
    const thread = await messageRepo.getThreadById(threadId);
    if (!thread) {
        return;
    }

    const teacherPageData = await getMessagePageData({
        id: thread.teacher.userId,
        role: thread.teacher.user.role,
        schoolId: thread.teacher.user.schoolId,
    });
    emitMessagePageDataToUser(thread.teacher.userId, teacherPageData);

    const studentPageData = await getMessagePageData({
        id: thread.student.userId,
        role: thread.student.user.role,
        schoolId: thread.student.user.schoolId,
    });
    emitMessagePageDataToUser(thread.student.userId, studentPageData);
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
    const thread = existingThread ?? await messageRepo.createThread(request.classId, teacher.id, request.studentId);
    await notifyRealtimeParticipants(thread.id);

    return await getMessagePageData(user);
};

const sendMessageForUser = async (user: MessageUserContext, request: ISendMessageDTO) => {
    const content = request.content?.trim() ?? "";
    const attachments = (request.attachments ?? []).filter(
        (attachment): attachment is IMessageAttachment =>
            Boolean(attachment)
            && typeof attachment.url === "string"
            && attachment.url.trim().length > 0
            && typeof attachment.name === "string"
            && attachment.name.trim().length > 0
            && typeof attachment.mimeType === "string"
            && attachment.mimeType.trim().length > 0
            && typeof attachment.size === "number"
            && attachment.size >= 0
            && (attachment.kind === "IMAGE" || attachment.kind === "FILE"),
    );
    const imageUrl = attachments.find((attachment) => attachment.kind === "IMAGE")?.url;

    if (!request.threadId || (!content && attachments.length === 0)) {
        throw new Error("MISSING_FIELDS");
    }

    if (attachments.length !== (request.attachments ?? []).length) {
        throw new Error("INVALID_ATTACHMENTS");
    }

    if (attachments.some((attachment) => attachment.size > MESSAGE_ATTACHMENT_MAX_SIZE)) {
        throw new Error("ATTACHMENT_TOO_LARGE");
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

    await messageRepo.sendMessage(request.threadId, user.id, content, imageUrl, attachments);
    await notifyRealtimeParticipants(request.threadId);
    return await getMessagePageData(user);
};

const messageService = {
    getMessagePageData,
    createThreadForTeacher,
    mapUserContext,
    notifyRealtimeParticipants,
    sendMessageForUser,
};

export default messageService;
