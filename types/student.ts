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
