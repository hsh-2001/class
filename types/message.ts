export interface IMessageItem {
    id: string;
    senderUserId: string;
    senderName: string;
    senderRole: "ADMIN" | "STUDENT" | "TEACHER";
    content: string;
    createdAt: string;
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
}

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
        this.messages = data.messages;
    }
}
