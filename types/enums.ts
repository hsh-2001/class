export const Role = {
    ADMIN: "ADMIN",
    STUDENT: "STUDENT",
    TEACHER: "TEACHER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];
