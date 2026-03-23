import linkPreviewRepo from "@/repositories/link-preview.repo";
import { IGetLinkPreviewDTO } from "@/types/link-preview";

const getLinkPreview = async (request: IGetLinkPreviewDTO) => {
    const rawUrl = request.url?.trim();

    if (!rawUrl) {
        throw new Error("MISSING_FIELDS");
    }

    const normalizedUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
        ? rawUrl
        : `https://${rawUrl}`;

    return await linkPreviewRepo.fetchPreview(normalizedUrl);
};

const linkPreviewService = {
    getLinkPreview,
};

export default linkPreviewService;
