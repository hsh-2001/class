import axios from "axios";

export class AppApiError extends Error {
    status: number;

    constructor(message: string, status = 500) {
        super(message);
        this.name = "AppApiError";
        this.status = status;
    }
}

export function getApiErrorMessage(
    error: unknown,
    fallbackMessage = "Something went wrong. Please try again."
) {
    if (error instanceof AppApiError) {
        return error.message || fallbackMessage;
    }

    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || error.message || fallbackMessage;
    }

    if (error instanceof Error) {
        return error.message || fallbackMessage;
    }

    return fallbackMessage;
}
