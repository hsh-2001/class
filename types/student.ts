import type { Gender } from "@/prisma/generated/enums";

export interface IStudent {
    id: string;
    userId: string;
}

export interface IStudentProfileInput {
    firstName: string;
    lastName: string;
    phone?: string | null;
    gender: Gender;
}

export interface ICreateStudentDTO extends IStudentProfileInput {
    schoolId: string;
    email: string;
    password: string;
    username?: string;
    dateOfBirth?: string | Date;
    age?: number;
    address?: string;
}

export interface IStudentListItem extends IStudent {
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    gender: Gender;
}

export type TCreateStudentDTO = ICreateStudentDTO;

export class StudentResponse implements IStudentListItem {
    id: string;
    userId: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    gender: Gender;

    constructor(data: IStudentListItem) {
        this.id = data.id;
        this.userId = data.userId;
        this.email = data.email;
        this.role = data.role;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phone = data.phone;
        this.gender = data.gender;
    }
}
