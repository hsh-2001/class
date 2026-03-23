import dns from "node:dns/promises";
import net from "node:net";
import { ILinkPreviewItem } from "@/types/link-preview";

const REQUEST_TIMEOUT_MS = 5000;
const MAX_HTML_BYTES = 512_000;
const DEFAULT_USER_AGENT = "ClassSystemLinkPreviewBot/1.0";

const decodeHtmlEntities = (value: string) => {
    return value
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();
};

const normalizeWhitespace = (value: string) => {
    return decodeHtmlEntities(value.replace(/\s+/g, " ").trim());
};

const getMetaContent = (html: string, attribute: "property" | "name", key: string) => {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
        new RegExp(`<meta[^>]*${attribute}=["']${escapedKey}["'][^>]*content=["']([^"']+)["'][^>]*>`, "i"),
        new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*${attribute}=["']${escapedKey}["'][^>]*>`, "i"),
    ];

    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match?.[1]) {
            return normalizeWhitespace(match[1]);
        }
    }

    return "";
};

const getTitleFromHtml = (html: string) => {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return titleMatch?.[1] ? normalizeWhitespace(titleMatch[1]) : "";
};

const getHostnameLabel = (hostname: string) => {
    return hostname
        .replace(/^www\./, "")
        .split(".")
        .filter(Boolean)
        .slice(0, -1)
        .join(" ")
        .replace(/\b\w/g, (char) => char.toUpperCase()) || hostname;
};

const isPrivateIpv4 = (address: string) => {
    const [first, second] = address.split(".").map(Number);

    if (first === 10 || first === 127 || first === 0) {
        return true;
    }

    if (first === 169 && second === 254) {
        return true;
    }

    if (first === 172 && second >= 16 && second <= 31) {
        return true;
    }

    if (first === 192 && second === 168) {
        return true;
    }

    return false;
};

const isPrivateIpv6 = (address: string) => {
    const normalized = address.toLowerCase();

    return normalized === "::1"
        || normalized === "::"
        || normalized.startsWith("fc")
        || normalized.startsWith("fd")
        || normalized.startsWith("fe80");
};

const isBlockedAddress = (address: string) => {
    const family = net.isIP(address);

    if (family === 4) {
        return isPrivateIpv4(address);
    }

    if (family === 6) {
        return isPrivateIpv6(address);
    }

    return false;
};

const assertSafeUrl = async (url: URL) => {
    if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("INVALID_URL");
    }

    if (url.username || url.password) {
        throw new Error("INVALID_URL");
    }

    if (url.port && !["80", "443"].includes(url.port)) {
        throw new Error("INVALID_URL");
    }

    const hostname = url.hostname.toLowerCase();

    if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
        throw new Error("INVALID_URL");
    }

    if (net.isIP(hostname) && isBlockedAddress(hostname)) {
        throw new Error("INVALID_URL");
    }

    const addresses = await dns.lookup(hostname, { all: true, verbatim: true });

    if (addresses.length === 0 || addresses.some((entry) => isBlockedAddress(entry.address))) {
        throw new Error("INVALID_URL");
    }
};

const absoluteUrl = (maybeRelativeUrl: string, baseUrl: string) => {
    try {
        return new URL(maybeRelativeUrl, baseUrl).toString();
    } catch {
        return undefined;
    }
};

const getYoutubeVideoId = (url: URL) => {
    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();

    if (hostname === "youtu.be") {
        return url.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
        if (url.pathname === "/watch") {
            return url.searchParams.get("v");
        }

        if (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/")) {
            return url.pathname.split("/").filter(Boolean)[1] || null;
        }
    }

    return null;
};

const isYoutubeUrl = (url: URL) => {
    return getYoutubeVideoId(url) !== null;
};

const getMediaType = (ogType: string, hostname: string) => {
    if (ogType.toLowerCase().includes("video")) {
        return "video" as const;
    }

    if (hostname.includes("youtube.") || hostname === "youtu.be" || hostname.includes("vimeo.")) {
        return "video" as const;
    }

    return "link" as const;
};

const buildFallbackPreview = (url: URL): ILinkPreviewItem => {
    const hostname = url.hostname.replace(/^www\./, "");
    const label = getHostnameLabel(hostname);

    return {
        canonicalUrl: url.toString(),
        description: hostname,
        hostname,
        mediaType: getMediaType("", hostname),
        providerName: label,
        siteName: label,
        title: url.pathname === "/" ? label : `${label} ${url.pathname}`,
    };
};

const fetchYoutubePreview = async (url: URL): Promise<ILinkPreviewItem | null> => {
    const videoId = getYoutubeVideoId(url);
    if (!videoId) {
        return null;
    }

    const oembedUrl = new URL("https://www.youtube.com/oembed");
    oembedUrl.searchParams.set("url", url.toString());
    oembedUrl.searchParams.set("format", "json");

    const response = await fetch(oembedUrl, {
        headers: {
            "user-agent": DEFAULT_USER_AGENT,
            "accept-language": "en-US,en;q=0.8",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
        return null;
    }

    const payload = await response.json() as {
        author_name?: string;
        provider_name?: string;
        thumbnail_url?: string;
        title?: string;
    };
    const hostname = url.hostname.replace(/^www\./, "");
    const providerName = payload.provider_name?.trim() || "YouTube";
    const title = payload.title?.trim() || "YouTube";
    const authorName = payload.author_name?.trim();

    return {
        authorName,
        canonicalUrl: url.toString(),
        description: authorName ? `By ${authorName}` : `youtube.com/watch?v=${videoId}`,
        hostname,
        imageUrl: payload.thumbnail_url?.trim() || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        mediaType: "video",
        providerName,
        siteName: providerName,
        title,
    };
};

const fetchPreview = async (inputUrl: string): Promise<ILinkPreviewItem> => {
    const url = new URL(inputUrl);
    await assertSafeUrl(url);

    if (isYoutubeUrl(url)) {
        const youtubePreview = await fetchYoutubePreview(url);
        if (youtubePreview) {
            return youtubePreview;
        }
    }

    const response = await fetch(url, {
        headers: {
            "user-agent": DEFAULT_USER_AGENT,
            "accept-language": "en-US,en;q=0.8",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const finalUrl = new URL(response.url);
    await assertSafeUrl(finalUrl);

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.includes("text/html")) {
        return buildFallbackPreview(finalUrl);
    }

    const html = (await response.text()).slice(0, MAX_HTML_BYTES);
    const hostname = finalUrl.hostname.replace(/^www\./, "");
    const ogType = getMetaContent(html, "property", "og:type");
    const title = getMetaContent(html, "property", "og:title")
        || getMetaContent(html, "name", "twitter:title")
        || getTitleFromHtml(html)
        || getHostnameLabel(hostname);
    const description = getMetaContent(html, "property", "og:description")
        || getMetaContent(html, "name", "description")
        || getMetaContent(html, "name", "twitter:description")
        || hostname;
    const siteName = getMetaContent(html, "property", "og:site_name")
        || getHostnameLabel(hostname);
    const providerName = siteName;
    const canonicalUrl = absoluteUrl(
        getMetaContent(html, "property", "og:url")
        || getMetaContent(html, "name", "twitter:url")
        || response.url,
        response.url,
    ) ?? response.url;
    const imageUrl = absoluteUrl(
        getMetaContent(html, "property", "og:image")
        || getMetaContent(html, "name", "twitter:image"),
        response.url,
    );

    return {
        canonicalUrl,
        description,
        hostname,
        imageUrl,
        mediaType: getMediaType(ogType, hostname),
        providerName,
        siteName,
        title,
    };
};

const linkPreviewRepo = {
    fetchPreview,
};

export default linkPreviewRepo;
