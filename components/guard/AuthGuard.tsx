"use client";
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

    useEffect(() => {
        if (isClient && !token) {
            router.replace("/login");
        }
    }, [isClient, router, token]);

    if (!isClient || !token) {
        return null;
    }

    return <>{children}</>;
}
