import { callGetOverview } from "@/lib/api-calling";
import { IOverview } from "@/types/overview";
import { useState } from "react";
import useLoading from "./useLoading";

export default function useOverview() {
    const [overview, setOverview] = useState<IOverview | null>(null);
    const { startLoading, stopLoading, isLoading } = useLoading();

    const getOverview = async () => {
        startLoading('get');
        try {
            const response = await callGetOverview();
            setOverview(response.data);
        } catch (error) {
            console.error("Failed to fetch overview:", error);
        } finally {
            stopLoading('get');
        }
    }

    return {
        overview,
        getOverview,
        isLoading,
    }
}