const DEFAULT_SITE_URL = "http://localhost:3000";
const DEFAULT_TITLE = "Class System";
const DEFAULT_DESCRIPTION = "Class System is an internal school dashboard for schedules, assignments, courses, and messaging.";
const NO_INDEX_ROBOTS = "noindex, nofollow, noarchive, nosnippet, noimageindex";
const INDEX_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const DEFAULT_OG_IMAGE_PATH = "/og-default.png";

export const PRIVATE_PATHS = [
    "/",
    "/assignments",
    "/courses",
    "/live-classes",
    "/members",
    "/messages",
    "/profile",
    "/schedule",
    "/settings",
] as const;

const PAGE_SEO: Record<string, { title: string; description: string; keywords?: string[]; robots?: string }> = {
    "/": {
        title: "Dashboard",
        description: "Review classes, pending work, and unread updates from the internal class dashboard.",
    },
    "/assignments": {
        title: "Assignments",
        description: "Track assignment status, due dates, and classroom work inside Class System.",
    },
    "/courses": {
        title: "Courses",
        description: "Manage course records, classes, and enrollment information in Class System.",
    },
    "/live-classes": {
        title: "Live Classes",
        description: "Check upcoming live classes and session details for your school.",
    },
    "/login": {
        title: "School Login",
        description: "Sign in to Class System to manage schedules, assignments, courses, and school communication.",
        keywords: ["school portal", "class management system", "student dashboard", "teacher dashboard", "school login"],
        robots: INDEX_ROBOTS,
    },
    "/members": {
        title: "Members",
        description: "Browse and manage school members within Class System.",
    },
    "/messages": {
        title: "Messages",
        description: "Open direct and class group conversations in the Class System messaging workspace.",
    },
    "/profile": {
        title: "Profile",
        description: "Review and update your account information in Class System.",
    },
    "/schedule": {
        title: "Schedule",
        description: "View your weekly class schedule, sessions, and planning windows.",
    },
    "/settings": {
        title: "Settings",
        description: "Adjust account preferences and classroom notification settings.",
    },
};

export type PageSeo = {
    canonicalUrl: string;
    description: string;
    keywords: string[];
    openGraph: {
        description: string;
        image: string;
        siteName: string;
        title: string;
        type: "website";
        url: string;
    };
    robots: string;
    title: string;
    twitter: {
        card: "summary_large_image";
        description: string;
        image: string;
        title: string;
    };
};

export const getSiteUrl = () => {
    const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

    if (!configuredUrl) {
        return DEFAULT_SITE_URL;
    }

    return configuredUrl.replace(/\/+$/, "");
};

export const getPageSeo = (pathname: string, asPath?: string): PageSeo => {
    const routeSeo = PAGE_SEO[pathname] ?? {
        title: "Dashboard",
        description: DEFAULT_DESCRIPTION,
        keywords: [],
    };
    const normalizedPath = (asPath ?? pathname).split("#")[0]?.split("?")[0] || pathname;
    const canonicalPath = normalizedPath === "/" ? "" : normalizedPath.replace(/\/+$/, "");
    const canonicalUrl = `${getSiteUrl()}${canonicalPath}`;
    const title = routeSeo.title === DEFAULT_TITLE ? DEFAULT_TITLE : `${routeSeo.title} | ${DEFAULT_TITLE}`;
    const image = `${getSiteUrl()}${DEFAULT_OG_IMAGE_PATH}`;

    return {
        canonicalUrl,
        description: routeSeo.description,
        keywords: routeSeo.keywords ?? [],
        openGraph: {
            description: routeSeo.description,
            image,
            siteName: DEFAULT_TITLE,
            title,
            type: "website",
            url: canonicalUrl,
        },
        robots: routeSeo.robots ?? NO_INDEX_ROBOTS,
        title,
        twitter: {
            card: "summary_large_image",
            description: routeSeo.description,
            image,
            title,
        },
    };
};

export const seoDefaults = {
    applicationName: DEFAULT_TITLE,
    defaultDescription: DEFAULT_DESCRIPTION,
    defaultTitle: DEFAULT_TITLE,
    ogImagePath: DEFAULT_OG_IMAGE_PATH,
    robots: NO_INDEX_ROBOTS,
};
