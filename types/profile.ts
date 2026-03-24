import type { Gender } from "@/prisma/generated/enums";

export interface IProfile {
    userId: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: Gender;
    profileUrl: string;
    schoolName?: string
}

export interface IUpdateProfileDTO {
    username: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    gender: Gender;
    profileUrl?: string | null;
    schoolName?: string;
}
