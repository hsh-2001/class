import LanguageSelect from "@/components/ui/LanguageSelect";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { sidebarItems } from "@/lib/sidebar-items";
import { getUserRoleFromStorage } from "@/lib/role-access";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";

function useIsClient() {
    return useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    );
}

export default function SideBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
    const router = useRouter();
    const isClient = useIsClient();
    const role = isClient ? getUserRoleFromStorage() : undefined;
    const { t } = useTranslation();

    const handleClickItem = () => {
        onToggleSidebar();
    }

    const visibleSidebarItems = sidebarItems.filter((item) => role ? item.roles.includes(role) : false);

    return (
        <aside className="sidebar h-[calc(100vh-5rem)] w-65 shrink-0 border-r border-black/10 bg-white/90 p-4 text-slate-900 backdrop-blur dark:border-white/10 dark:bg-black/85 dark:text-slate-100">
            <div className="flex h-full flex-col">
                <div className="px-3 pb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
                        {t("sidebar.learningSpace")}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {t("sidebar.deepWorkZone")}
                    </p>
                </div>

                <nav aria-label="Sidebar navigation" className="flex-1 overflow-y-auto">
                    <ul className="space-y-1.5">
                        {visibleSidebarItems.map(({ href, icon: Icon, labelKey }) => {
                            const isActive = router.pathname === href;

                            return (
                                <li key={labelKey}>
                                    <Link
                                        href={href}
                                        className={[
                                            "flex w-full items-center gap-3 rounded-full px-3 py-3 text-left text-sm font-medium transition",
                                            isActive
                                                ? "bg-black/90 text-white dark:bg-white/90 dark:text-black"
                                                : "text-slate-600 hover:bg-black/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-slate-100",
                                        ].join(" ")}
                                        onClick={handleClickItem}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{t(labelKey)}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="mt-4 space-y-3">
                    <div className="md:hidden">
                        <LanguageSelect className="w-[92%] h-10 [&_.ant-select-selector]:rounded-full! [&_.ant-select-selector]:shadow-none!" />
                    </div>
                    <div className="md:hidden w-full">
                        <ThemeToggle className="w-full [&>button]:w-full" />
                    </div>
                    <div className="rounded-lg bg-black/5 px-4 py-3 text-sm text-slate-600 dark:bg-white/10 dark:text-slate-300">
                        {t("sidebar.quickAccess")}
                    </div>
                </div>
            </div>
        </aside>
    );
}
