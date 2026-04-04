import { useState } from "react";

type LoadingState = Record<string, boolean>;

export default function useLoading() {
    const [loading, setLoading] = useState<LoadingState>({});

    const startLoading = (key: string) => {
        setLoading((prev) => ({
            ...prev,
            [key]: true,
        }));
    };

    const stopLoading = (key: string) => {
        setLoading((prev) => ({
            ...prev,
            [key]: false,
        }));
    };

    const isLoading = (key: string) => {
        return !!loading[key];
    };

    const resetLoading = () => {
        setLoading({});
    };

    return {
        startLoading,
        stopLoading,
        isLoading,
        resetLoading,
    };
}