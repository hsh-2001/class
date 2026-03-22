import type { Gender, Role } from "@/prisma/generated/enums";

export interface IUserProfileDTO {
    firstName: string;
    lastName: string;
    phone?: string | null;
    gender?: Gender;
}

export interface IUser {
    id: string;
    email: string;
    password: string;
    role: Role;
    profile?: IUserProfileDTO | null;
}

export interface ICreateUserDTO {
    schoolId: string;
    email: string;
    username?: string;
    password: string;
    role: Role;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    gender?: Gender;
}

export interface IUpdateUserDTO {
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    gender?: Gender;
}

export type IUserDTO = Omit<IUser, "password">;

export type ILoginDTO = Pick<IUser, "email" | "password">;
