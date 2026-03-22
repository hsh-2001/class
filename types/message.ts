export interface IMessageItem {
    id: string;
    senderUserId: string;
    senderName: string;
    senderRole: "ADMIN" | "STUDENT" | "TEACHER";
    content: string;
    attachments: IMessageAttachment[];
    imageUrl?: string;
    createdAt: string;
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
    classId: string;
    className: string;
    courseName: string;
    courseCode: string;
    teacherId: string;
    teacherName: string;
    studentId: string;
    studentName: string;
    updatedAt: string;
    lastMessagePreview: string;
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
    threads: IMessageThreadItem[];
}

export interface ICreateMessageThreadDTO {
    classId: string;
    studentId: string;
}

export interface ISendMessageDTO {
    threadId: string;
    content: string;
    attachments?: IMessageAttachment[];
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
    classId: string;
    className: string;
    courseName: string;
    courseCode: string;
    teacherId: string;
    teacherName: string;
    studentId: string;
    studentName: string;
    updatedAt: string;
    lastMessagePreview: string;
    messages: IMessageItem[];

    constructor(data: IMessageThreadItem) {
        this.id = data.id;
        this.classId = data.classId;
        this.className = data.className;
        this.courseName = data.courseName;
        this.courseCode = data.courseCode;
        this.teacherId = data.teacherId;
        this.teacherName = data.teacherName;
        this.studentId = data.studentId;
        this.studentName = data.studentName;
        this.updatedAt = data.updatedAt;
        this.lastMessagePreview = data.lastMessagePreview;
        this.messages = (data.messages ?? []).map((message) => ({
            ...message,
            content: message.content ?? "",
            attachments: Array.isArray(message.attachments) ? message.attachments : [],
            imageUrl: message.imageUrl ?? undefined,
        }));
    }
}
