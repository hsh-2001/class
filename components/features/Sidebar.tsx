import { sidebarItems } from "@/lib/sidebar-items";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SideBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
    const router = useRouter();
    const handleClickItem = () => {
        onToggleSidebar();
    }
    return (
        <aside className="sidebar h-[calc(100vh-5rem)] w-65 shrink-0 border-r border-black/10 bg-white/90 p-4 text-slate-900 backdrop-blur dark:border-white/10 dark:bg-black/85 dark:text-slate-100">
            <div className="flex h-full flex-col">
                <div className="px-3 pb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
                        Learning Space
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Deep dive into your class management dashboard.
                    </p>
                </div>

                <nav aria-label="Sidebar navigation" className="flex-1 overflow-y-auto">
                    <ul className="space-y-1.5">
                        {sidebarItems.map(({ href, icon: Icon, label }) => {
                            const isActive = router.pathname === href;

                            return (
                                <li key={label}>
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
                                        <span>{label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="mt-4 rounded-lg bg-black/5 px-4 py-3 text-sm text-slate-600 dark:bg-white/10 dark:text-slate-300">
                    Quick access to your daily class tasks.
                </div>
            </div>
        </aside>
    );
}
