"use client";

import {
    getDefaultRouteForRole,
    getUserRoleFromStorage,
    isRoleAllowedForRoute,
} from "@/lib/role-access";
import { useRouter } from "next/router";
import { useEffect, useSyncExternalStore } from "react";

function useIsClient() {
    return useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    );
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const isClient = useIsClient();

    const token = isClient ? window.localStorage.getItem("token") || "" : "";
    const role = isClient ? getUserRoleFromStorage() : undefined;
    const isAuthorized = !!token && !!role && isRoleAllowedForRoute(role, router.pathname);

    useEffect(() => {
        if (!isClient) {
            return;
        }

        if (!token) {
            router.replace("/login");
            return;
        }

        if (!role) {
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("user");
            router.replace("/login");
            return;
        }

        if (!isRoleAllowedForRoute(role, router.pathname)) {
            router.replace(getDefaultRouteForRole(role));
        }
    }, [isClient, role, router, router.pathname, token]);

    if (!isClient || !isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
