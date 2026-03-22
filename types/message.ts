export interface IMessageItem {
    id: string;
    senderUserId: string;
    senderName: string;
    senderUsername: string;
    senderEmail: string;
    senderProfileUrl?: string;
    senderRole: "ADMIN" | "STUDENT" | "TEACHER";
    content: string;
    attachments: IMessageAttachment[];
    imageUrl?: string;
    isForwarded: boolean;
    replyToMessage?: IMessageReplyPreview;
    createdAt: string;
}

export interface IMessageReplyPreview {
    id: string;
    senderUserId: string;
    senderName: string;
    content: string;
    attachments: IMessageAttachment[];
}

export interface IMessageMemberOption {
    value: string;
    label: string;
    username: string;
    email: string;
    role: "ADMIN" | "STUDENT" | "TEACHER";
    profileUrl?: string;
}

export type MessageAttachmentKind = "IMAGE" | "FILE";

export interface IMessageAttachment {
    url: string;
    name: string;
    mimeType: string;
    size: number;
    kind: MessageAttachmentKind;
}

export interface IMessageThreadItem {
    id: string;
    kind: "CLASS_GROUP" | "CLASS_DIRECT" | "DIRECT";
    classId: string;
    className: string;
    courseName: string;
    courseCode: string;
    teacherId: string;
    teacherName: string;
    studentId: string | null;
    studentName: string;
    isGroup: boolean;
    memberCount: number;
    title: string;
    subtitle: string;
    avatarLabel: string;
    avatarUrl?: string;
    updatedAt: string;
    lastMessagePreview: string;
    hasMoreMessages: boolean;
    messages: IMessageItem[];
}

export interface IMessageThreadMessagesPage {
    threadId: string;
    hasMoreMessages: boolean;
    messages: IMessageItem[];
}

export interface IMessageStudentOption {
    value: string;
    label: string;
}

export interface IMessageClassOption {
    value: string;
    label: string;
    students: IMessageStudentOption[];
}

export interface IMessagePageData {
    currentUserId: string;
    canCreateThread: boolean;
    canSendMessage: boolean;
    classOptions: IMessageClassOption[];
    memberOptions: IMessageMemberOption[];
    threads: IMessageThreadItem[];
}

export interface ICreateMessageThreadDTO {
    recipientUserId: string;
}

export interface ISendMessageDTO {
    threadId: string;
    content: string;
    attachments?: IMessageAttachment[];
    replyToMessageId?: string;
    isForwarded?: boolean;
}

export interface IDeleteMessageDTO {
    threadId: string;
    messageId: string;
}

export const MESSAGE_ATTACHMENT_MAX_SIZE = 3 * 1024 * 1024;
export const MESSAGE_ATTACHMENT_ACCEPT = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt";

export interface IMessageSocketUser {
    id: string;
    role: "ADMIN" | "STUDENT" | "TEACHER";
    schoolId: string;
}

export interface IMessageSocketAck<T = IMessagePageData> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface MessageServerToClientEvents {
    "message:page-data": (payload: IMessagePageData) => void;
}

export interface MessageClientToServerEvents {
    "message:send": (
        payload: ISendMessageDTO,
        callback: (response: IMessageSocketAck) => void,
    ) => void;
    "message:thread:create": (
        payload: ICreateMessageThreadDTO,
        callback: (response: IMessageSocketAck) => void,
    ) => void;
}

export class MessageThreadResponse implements IMessageThreadItem {
    id: string;
    kind: "CLASS_GROUP" | "CLASS_DIRECT" | "DIRECT";
    classId: string;
    className: string;
    courseName: string;
    courseCode: string;
    teacherId: string;
    teacherName: string;
    studentId: string | null;
    studentName: string;
    isGroup: boolean;
    memberCount: number;
    title: string;
    subtitle: string;
    avatarLabel: string;
    avatarUrl?: string;
    updatedAt: string;
    lastMessagePreview: string;
    hasMoreMessages: boolean;
    messages: IMessageItem[];

    constructor(data: IMessageThreadItem) {
        this.id = data.id;
        this.kind = data.kind;
        this.classId = data.classId;
        this.className = data.className;
        this.courseName = data.courseName;
        this.courseCode = data.courseCode;
        this.teacherId = data.teacherId;
        this.teacherName = data.teacherName;
        this.studentId = data.studentId;
        this.studentName = data.studentName;
        this.isGroup = data.isGroup;
        this.memberCount = data.memberCount;
        this.title = data.title;
        this.subtitle = data.subtitle;
        this.avatarLabel = data.avatarLabel;
        this.avatarUrl = data.avatarUrl ?? undefined;
        this.updatedAt = data.updatedAt;
        this.lastMessagePreview = data.lastMessagePreview;
        this.hasMoreMessages = Boolean(data.hasMoreMessages);
        this.messages = (data.messages ?? []).map((message) => ({
            ...message,
            content: message.content ?? "",
            attachments: Array.isArray(message.attachments) ? message.attachments : [],
            imageUrl: message.imageUrl ?? undefined,
            isForwarded: Boolean(message.isForwarded),
            replyToMessage: message.replyToMessage,
        }));
    }
}
