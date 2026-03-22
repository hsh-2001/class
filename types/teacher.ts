import { $Enums } from "@/prisma/generated/browser";

export interface ITeacher {
    id: string;
}

export interface ITeacherProfileInput {
    firstName: string;
    lastName: string;
    phone?: string | null;
    gender: "MALE" | "FEMALE" | "OTHER";
    schoolId: string;
}

export interface ICreateTeacherDTO extends ITeacherProfileInput {
    email: string;
    password: string;
    username?: string;
    age?: number;
    address?: string;
}

export interface ITeacherListItem extends ITeacherProfileInput {
    id: string;
    userId: string;
    email: string;
    role: $Enums.Role;
    username?: string;
}

export type IUpdateTeacherDTO = Partial<Omit<ICreateTeacherDTO, "password" | "schoolId">> & { id: string };

export class TeacherResponse implements ITeacherListItem {
    id: string;
    userId: string;
    email: string;
    role: $Enums.Role;
    firstName: string;
    lastName: string;
    phone?: string | null;
    username?: string | undefined;
    gender: "MALE" | "FEMALE" | "OTHER";
    schoolId: string;
    constructor(data: ITeacherListItem) {
        this.id = data.id;
        this.userId = data.userId;
        this.email = data.email;
        this.role = data.role;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phone = data.phone || null;
        this.username = data.username;
        this.gender = data.gender;
        this.schoolId = data.schoolId;
    }
}
