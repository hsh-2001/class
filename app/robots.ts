import type { MetadataRoute } from "next";
import { PRIVATE_PATHS } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/login"],
                disallow: ["/api/", ...PRIVATE_PATHS],
            },
        ],
    };
}
