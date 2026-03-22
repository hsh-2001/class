import axios from "axios";

export interface UploadApiResponse {
    data?: Array<{
        download_url?: string;
    }>;
}

const postUpload = async (formData: FormData) => {
    try {
        const url = process.env.NEXT_PUBLIC_UPLOAD_API as string;
        const apiKey = process.env.NEXT_PUBLIC_UPLOAD_API_KEY as string;
        const uploadResponse = await axios.post<UploadApiResponse>(url, formData, {
            headers: {
                "x-api-key": apiKey,
            },
        });
        return uploadResponse.data;
    } catch (error) {
        console.error("Error uploading file:", error);
    }
};

export const upload = async (path: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    return await postUpload(formData);
};

export const uploadMany = async (path: string, files: File[]) => {
    if (files.length === 0) {
        return { data: [] };
    }

    const formData = new FormData();
    files.forEach((file) => {
        formData.append("files", file);
    });
    formData.append("path", path);

    return await postUpload(formData);
};
