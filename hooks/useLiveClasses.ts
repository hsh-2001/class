import { getApiErrorMessage } from "@/lib/api-error";
import { callGetLiveClasses } from "@/lib/api-calling";
import { LiveClassResponse, ILiveClassPageData } from "@/types/live-class";
import { useCallback, useEffect, useState } from "react";

export default function useLiveClasses() {
    const [sessions, setSessions] = useState<LiveClassResponse[]>([]);
    const [canManage, setCanManage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLiveClasses = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await callGetLiveClasses();
            if (response.data.success) {
                const payload = response.data.data as ILiveClassPageData;
                setSessions(payload.sessions.map((item) => new LiveClassResponse(item)));
                setCanManage(payload.canManage);
            }
        } catch (error: unknown) {
            console.error(getApiErrorMessage(error, "Failed to fetch live classes."));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchLiveClasses();
    }, [fetchLiveClasses]);

    const liveCount = sessions.filter((item) => item.status === "LIVE").length;
    const upcomingSessions = sessions.filter((item) => item.status === "UPCOMING");
    const nextSession = upcomingSessions[0] ?? null;
    const endedCount = sessions.filter((item) => item.status === "ENDED").length;

    return {
        canManage,
        endedCount,
        fetchLiveClasses,
        isLoading,
        liveCount,
        nextSession,
        sessions,
        upcomingCount: upcomingSessions.length,
    };
}
