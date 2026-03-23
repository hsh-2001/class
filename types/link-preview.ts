export interface IGetLinkPreviewDTO {
    url: string;
}

export interface ILinkPreviewItem {
    authorName?: string;
    canonicalUrl: string;
    description: string;
    hostname: string;
    imageUrl?: string;
    mediaType: "link" | "video";
    providerName: string;
    siteName: string;
    title: string;
}
