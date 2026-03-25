import type { Role } from "@/prisma/generated/enums";

export const APP_ROLES = {
    ADMIN: "ADMIN",
    STUDENT: "STUDENT",
    TEACHER: "TEACHER",
} as const satisfies Record<string, Role>;

export type AppRole = Role;

export const routeRoleAccess: Record<string, AppRole[]> = {
    "/": [APP_ROLES.ADMIN, APP_ROLES.TEACHER],
    "/members": [APP_ROLES.ADMIN],
    "/courses": [APP_ROLES.ADMIN, APP_ROLES.STUDENT],
    "/live-classes": [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER],
    "/schedule": [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER],
    "/assignments": [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER],
    "/messages": [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER],
    "/settings": [APP_ROLES.ADMIN],
    "/profile": [APP_ROLES.ADMIN, APP_ROLES.STUDENT, APP_ROLES.TEACHER],
};

export const isRoleAllowedForRoute = (role: AppRole | undefined, pathname: string) => {
    if (!role) {
        return false;
    }

    const allowedRoles = routeRoleAccess[pathname];
    if (!allowedRoles) {
        return true;
    }

    return allowedRoles.includes(role);
};

export const getDefaultRouteForRole = (role: AppRole | undefined) => {
    if (!role) {
        return "/login";
    }

    const matchedRoute = Object.entries(routeRoleAccess).find(([, roles]) => roles.includes(role));
    return matchedRoute?.[0] ?? "/";
};

export const getUserRoleFromStorage = (): AppRole | undefined => {
    if (typeof window === "undefined") {
        return undefined;
    }

    const rawUser = window.localStorage.getItem("user");
    if (!rawUser) {
        return undefined;
    }

    try {
        const parsedUser = JSON.parse(rawUser) as { role?: AppRole };
        return parsedUser.role;
    } catch {
        return undefined;
    }
};
