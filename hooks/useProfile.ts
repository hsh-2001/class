import { getApiErrorMessage } from "@/lib/api-error";
import { callGetStudentProfile, callUpdateStudentProfile } from "@/lib/api-calling";
import { IProfile, IUpdateProfileDTO } from "@/types/profile";
import { useCallback, useState } from "react";

export default function useProfile() {
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchProfile = useCallback(async () => {
        try {
            setErrorMessage("");
            setIsLoading(true);
            const response = await callGetStudentProfile();
            if (response.data.success) {
                setProfile(response.data.data);
            }
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, "Failed to load profile."));
        } finally {
            setIsLoading(false);
        }
    }, []);

    const setProfileField = <K extends keyof IUpdateProfileDTO>(field: K, value: IUpdateProfileDTO[K]) => {
        setProfile((current) => current ? { ...current, [field]: value } : current);
    }

    const updateProfile = async (request: IUpdateProfileDTO) => {
        try {
            setErrorMessage("");
            setSuccessMessage("");
            setIsSubmitting(true);

            const response = await callUpdateStudentProfile(request);
            if (response.data.success) {
                const updatedProfile = response.data.data as IProfile;
                setProfile(updatedProfile);

                if (typeof window !== "undefined") {
                    const rawUser = window.localStorage.getItem("user");
                    if (rawUser) {
                        const currentUser = JSON.parse(rawUser);
                        window.localStorage.setItem("user", JSON.stringify({
                            ...currentUser,
                            username: updatedProfile.username,
                            profile: updatedProfile,
                        }));
                    }
                }

                setSuccessMessage("Profile updated successfully.");
            }
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, "Failed to update profile."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        profile,
        isLoading,
        isSubmitting,
        errorMessage,
        successMessage,
        fetchProfile,
        setProfileField,
        updateProfile,
    };
}
