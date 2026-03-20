import { callLogin } from "@/lib/api-calling";
import { getApiErrorMessage } from "@/lib/api-error";
import { ILoginDTO } from "@/types/user";
import { useRouter } from "next/router";
import { useState } from "react";

export default function useAthentication() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginModel, setLoginModel] = useState<ILoginDTO>({
        email: "",
        password: "",
    });

    const handleSubmit = async () => {
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const response = await callLogin(loginModel);
            if (response?.data?.success) {
                localStorage.setItem("token", response.data.data.token);
                router.push("/home");
            }
        } catch (error: unknown) {
            console.log("Login failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        errorMessage,
        isSubmitting,
        loginModel,
        setLoginModel,
        handleSubmit,
    }
}
