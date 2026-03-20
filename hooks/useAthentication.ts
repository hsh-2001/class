import { callLogin } from "@/lib/api-calling";
import { ILoginDTO } from "@/types/user";
import { useRouter } from "next/router";
import { useState } from "react";

export default function useAthentication() {
    const router = useRouter();
    const [loginModel, setLoginModel] = useState<ILoginDTO>({
        email: "",
        password: "",
    });

    const handleSubmit = async () => {
        try {
            const response = await callLogin(loginModel);
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                router.push("/home");
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    return {
        loginModel,
        setLoginModel,
        handleSubmit,
    }
}