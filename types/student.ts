import type { Gender } from "@/types/enums";
import type { Dayjs } from "dayjs";

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
    role: string;
    email: string;
    password: string;
    username?: string;
    dateOfBirth?: string | Date | Dayjs;
    age?: number;
    address?: string;
}

export interface IStudentListItem extends IStudent {
    email: string;
    username?: string;
    role: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    gender: Gender;
    dateOfBirth?: string | Date | Dayjs;
}

export type TCreateStudentDTO = ICreateStudentDTO;
export type TUpdateStudentDTO = Partial<Omit<ICreateStudentDTO, "password" | "schoolId" | "role">> & { id: string };

export class StudentResponse implements IStudentListItem {
    id: string;
    userId: string;
    email: string;
    username?: string;
    role: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    gender: Gender;
    dateOfBirth?: string | Date | Dayjs;

    constructor(data: IStudentListItem) {
        this.id = data.id;
        this.userId = data.userId;
        this.email = data.email;
        this.username = data.username || "--";
        this.role = data.role;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phone = data.phone;
        this.gender = data.gender;
        this.dateOfBirth = data.dateOfBirth;
    }
}
