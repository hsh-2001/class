import { callGetOverview } from "@/lib/api-calling";
import { IOverview } from "@/types/overview";
import { useState } from "react";

export default function useOverview() {
    const [overview, setOverview] = useState<IOverview | null>(null);

    const getOverview = async () => {
        try {
            const response = await callGetOverview();
            setOverview(response.data);
        } catch (error) {
            console.error("Failed to fetch overview:", error);
        }
    }

    return {
        overview,
        getOverview,
    }
}