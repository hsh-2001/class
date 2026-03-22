import { emitMessagePageDataToUser } from "@/lib/socket-server";
import type { Role } from "@/prisma/generated/enums";
import messageRepo from "@/repositories/message.repo";
import {
    ICreateMessageThreadDTO,
    IMessageAttachment,
    IMessageItem,
    IMessageMemberOption,
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
    const replyToMessage = item.replyToMessage
        ? {
            id: item.replyToMessage.id,
            senderUserId: item.replyToMessage.senderUserId,
            senderName: getDisplayName(item.replyToMessage.senderUser),
            content: item.replyToMessage.content,
            attachments: normalizeAttachments(item.replyToMessage.attachments, item.replyToMessage.imageUrl),
        }
        : undefined;

    return {
        id: item.id,
        senderUserId: item.senderUserId,
        senderName: getDisplayName(item.senderUser),
        senderUsername: item.senderUser.username,
        senderEmail: item.senderUser.email,
        senderProfileUrl: item.senderUser.profile?.profile_url ?? undefined,
        senderRole: item.senderUser.role,
        content: item.content,
        attachments,
        imageUrl: item.imageUrl ?? undefined,
        replyToMessage,
        createdAt: item.createdAt.toISOString(),
    };
};

const getAvatarLabel = (value: string) => value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("") || "DM";

const mapThreadItem = (
    item: Awaited<ReturnType<typeof messageRepo.getThreadsBySchool>>[number],
    currentUserId: string,
) => {
    const messages = item.messages.map(mapMessageItem);
    const lastMessage = messages[messages.length - 1];
    const isDirectThread = Boolean(item.participantOneUserId && item.participantTwoUserId);

    if (isDirectThread) {
        const otherParticipant = item.participantOneUserId === currentUserId
            ? item.participantTwo
            : item.participantOne;
        const title = otherParticipant ? getDisplayName(otherParticipant) : "Direct message";
        const subtitle = otherParticipant
            ? `${otherParticipant.role.toLowerCase()} • ${otherParticipant.email}`
            : "Direct message";

        return {
            id: item.id,
            kind: "DIRECT" as const,
            classId: "",
            className: "",
            courseName: "",
            courseCode: "",
            teacherId: "",
            teacherName: "",
            studentId: null,
            studentName: "",
            isGroup: false,
            memberCount: 2,
            title,
            subtitle,
            avatarLabel: getAvatarLabel(title),
            avatarUrl: otherParticipant?.profile?.profile_url ?? undefined,
            updatedAt: item.updatedAt.toISOString(),
            lastMessagePreview: getLastMessagePreview(lastMessage),
            messages,
        };
    }

    const isGroup = !item.studentId;
    const memberCount = item.class?.enrollments.length ? item.class.enrollments.length + 1 : 0;
    const otherUser = !isGroup
        ? item.teacher?.user.id === currentUserId
            ? item.student?.user
            : item.teacher?.user
        : null;
    const title = isGroup
        ? item.class?.name ?? "Class Group"
        : otherUser
            ? getDisplayName(otherUser)
            : "Conversation";
    const subtitle = isGroup
        ? `${memberCount} members • ${item.class?.course.code ?? ""}`
        : `${item.class?.name ?? ""} • ${item.class?.course.code ?? ""}`;

    return {
        id: item.id,
        kind: isGroup ? "CLASS_GROUP" as const : "CLASS_DIRECT" as const,
        classId: item.classId ?? "",
        className: item.class?.name ?? "",
        courseName: item.class?.course.name ?? "",
        courseCode: item.class?.course.code ?? "",
        teacherId: item.teacherId ?? "",
        teacherName: item.teacher ? getDisplayName(item.teacher.user) : "",
        studentId: item.studentId,
        studentName: isGroup ? "Class Group" : getDisplayName(item.student!.user),
        isGroup,
        memberCount,
        title,
        subtitle,
        avatarLabel: isGroup ? (item.class?.name ?? "CG").slice(0, 2).toUpperCase() : getAvatarLabel(title),
        avatarUrl: isGroup ? undefined : otherUser?.profile?.profile_url ?? undefined,
        updatedAt: item.updatedAt.toISOString(),
        lastMessagePreview: getLastMessagePreview(lastMessage),
        messages,
    };
};

const mapMemberOption = (
    item: Awaited<ReturnType<typeof messageRepo.getSchoolUsers>>[number],
): IMessageMemberOption => ({
    value: item.id,
    label: getDisplayName(item),
    username: item.username,
    email: item.email,
    role: item.role,
    profileUrl: item.profile?.profile_url ?? undefined,
});

const getMessagePageData = async (user: MessageUserContext): Promise<IMessagePageData> => {
    const [threads, members] = await Promise.all([
        messageRepo.getThreadsByUserId(user.id),
        messageRepo.getSchoolUsers(user.schoolId, user.id),
    ]);

    return {
        currentUserId: user.id,
        canCreateThread: members.length > 0,
        canSendMessage: true,
        classOptions: [],
        memberOptions: members.map(mapMemberOption),
        threads: threads.map((item) => mapThreadItem(item, user.id)),
    };
};

const notifyRealtimeParticipants = async (threadId: string) => {
    const thread = await messageRepo.getThreadById(threadId);
    if (!thread) {
        return;
    }

    if (thread.teacher?.userId) {
        const teacherPageData = await getMessagePageData({
            id: thread.teacher.userId,
            role: thread.teacher.user.role,
            schoolId: thread.teacher.user.schoolId,
        });
        emitMessagePageDataToUser(thread.teacher.userId, teacherPageData);
    }

    if (thread.participantOneUserId && thread.participantTwoUserId) {
        if (thread.participantOne) {
            const firstParticipantPageData = await getMessagePageData({
                id: thread.participantOne.id,
                role: thread.participantOne.role,
                schoolId: thread.participantOne.schoolId,
            });
            emitMessagePageDataToUser(thread.participantOne.id, firstParticipantPageData);
        }

        if (thread.participantTwo) {
            const secondParticipantPageData = await getMessagePageData({
                id: thread.participantTwo.id,
                role: thread.participantTwo.role,
                schoolId: thread.participantTwo.schoolId,
            });
            emitMessagePageDataToUser(thread.participantTwo.id, secondParticipantPageData);
        }

        return;
    }

    if (thread.student) {
        const studentPageData = await getMessagePageData({
            id: thread.student.userId,
            role: thread.student.user.role,
            schoolId: thread.student.user.schoolId,
        });
        emitMessagePageDataToUser(thread.student.userId, studentPageData);
        return;
    }

    if (!thread.class) {
        return;
    }

    await Promise.all(thread.class.enrollments.map(async (enrollment) => {
        const studentPageData = await getMessagePageData({
            id: enrollment.student.userId,
            role: enrollment.student.user.role,
            schoolId: enrollment.student.user.schoolId,
        });
        emitMessagePageDataToUser(enrollment.student.userId, studentPageData);
    }));
};

const ensureClassGroupThreadForClass = async (classId: string) => {
    const classItem = await messageRepo.getClassById(classId);
    if (!classItem) {
        throw new Error("CLASS_NOT_FOUND");
    }

    const existingThread = await messageRepo.getGroupThreadByClassAndTeacher(classItem.id, classItem.teacherId);
    if (existingThread) {
        return existingThread;
    }

    return await messageRepo.createGroupThread(classItem.id, classItem.teacherId);
};

const createThreadForTeacher = async (user: MessageUserContext, request: ICreateMessageThreadDTO) => {
    if (!request.recipientUserId) {
        throw new Error("MISSING_FIELDS");
    }

    if (request.recipientUserId === user.id) {
        throw new Error("INVALID_RECIPIENT");
    }

    const recipientUser = await messageRepo.getUserById(request.recipientUserId);
    if (!recipientUser || recipientUser.schoolId !== user.schoolId) {
        throw new Error("UNAUTHORIZED");
    }

    const [participantOneUserId, participantTwoUserId] = [user.id, request.recipientUserId].sort();

    const existingThread = await messageRepo.getDirectThreadByParticipants(participantOneUserId, participantTwoUserId);
    const thread = existingThread ?? await messageRepo.createDirectThread(participantOneUserId, participantTwoUserId);
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

    const thread = await messageRepo.getThreadById(request.threadId);
    if (!thread) {
        throw new Error("THREAD_NOT_FOUND");
    }

    if (request.replyToMessageId) {
        const replyTarget = thread.messages.find((message) => message.id === request.replyToMessageId);
        if (!replyTarget) {
            throw new Error("REPLY_TARGET_NOT_FOUND");
        }
    }

    if (thread.participantOneUserId || thread.participantTwoUserId) {
        if (thread.participantOneUserId !== user.id && thread.participantTwoUserId !== user.id) {
            throw new Error("UNAUTHORIZED");
        }
    } else {
        if (user.role === "TEACHER" && thread.teacher?.userId !== user.id) {
            throw new Error("UNAUTHORIZED");
        }

        if (user.role === "STUDENT") {
            if (thread.student && thread.student.userId !== user.id) {
                throw new Error("UNAUTHORIZED");
            }

            if (!thread.student) {
                const isEnrolled = thread.class?.enrollments.some((enrollment) => enrollment.student.userId === user.id);
                if (!isEnrolled) {
                    throw new Error("UNAUTHORIZED");
                }
            }
        }
    }

    await messageRepo.sendMessage(
        request.threadId,
        user.id,
        content,
        imageUrl,
        attachments,
        request.replyToMessageId,
    );
    await notifyRealtimeParticipants(request.threadId);
    return await getMessagePageData(user);
};

const messageService = {
    getMessagePageData,
    createThreadForTeacher,
    mapUserContext,
    notifyRealtimeParticipants,
    ensureClassGroupThreadForClass,
    sendMessageForUser,
};

export default messageService;
