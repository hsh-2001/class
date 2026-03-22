import axios from "axios";
export const upload = async (path: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    try {
        const url = process.env.NEXT_PUBLIC_UPLOAD_API as string;
        const apiKey = process.env.NEXT_PUBLIC_UPLOAD_API_KEY as string;
        const upload = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "x-api-key": apiKey,
            },
        });
        return upload.data;
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}