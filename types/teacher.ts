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

export class TeacherResponse implements ICreateTeacherDTO {
    id: string;
    userId: string;
    email: string;
    role: $Enums.Role;
    firstName: string;
    lastName: string;
    phone?: string | null;
    password: string;
    username?: string | undefined;
    age?: number | undefined;
    address?: string | undefined;
    gender: "MALE" | "FEMALE" | "OTHER";
    schoolId: string;
    constructor(data: ICreateTeacherDTO & { id: string; userId: string; role: $Enums.Role }) {
        this.id = data.id;
        this.userId = data.userId;
        this.email = data.email;
        this.role = data.role;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phone = data.phone || null;
        this.password = data.password;
        this.username = data.username;
        this.age = data.age;
        this.address = data.address;
        this.gender = data.gender;
        this.schoolId = data.schoolId;
    }


}