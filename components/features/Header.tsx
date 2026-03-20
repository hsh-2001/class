import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useSyncExternalStore } from "react";

function useIsClient() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

export default function Header({onToggleSidebar, isSidebarOpen}: {onToggleSidebar: () => void, isSidebarOpen: boolean}) {
  const mounted = useIsClient();
  const { setTheme, theme } = useTheme();

  const themeOptions = [
    { label: "Light", value: "light", icon: Sun },
    { label: "Dark", value: "dark", icon: Moon },
    // { label: "System", value: "system", icon: Monitor },
  ] as const;

  const [isWidth1000Px, setIsWidth1000Px] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsWidth1000Px(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b w-full border-black/10 bg-white/85 backdrop-blur h-20 dark:border-white/10 dark:bg-slate-950/85 header">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 items-center">
          {isWidth1000Px && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="relative w-10 h-10 flex items-center justify-center"
            >
              <X
                className={`h-6 w-6 text-slate-600 dark:text-slate-300 absolute transition-all duration-300 ease-in-out
                ${isSidebarOpen ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 rotate-90"}`}
              />
              <Menu
                className={`h-6 w-6 text-slate-600 dark:text-slate-300 absolute transition-all duration-300 ease-in-out
                ${isSidebarOpen ? "scale-0 opacity-0 -rotate-90" : "scale-100 opacity-100 rotate-0"}`}
              />
            </button>
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Class System
          </p>
        </div>

        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            {/* {navItems.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="rounded-full px-4 py-2 transition hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-950"
                >
                  {item}
                </button>
              </li>
            ))} */}
            <li className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/75 p-1 dark:border-slate-800 dark:bg-slate-900/90">
              {themeOptions.map(({ icon: Icon, label, value }) => {
                const isActive = mounted && theme === value;

                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`Switch theme to ${label.toLowerCase()} mode`}
                    className={[
                      "flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition",
                      isActive
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                    ].join(" ")}
                    onClick={() => setTheme(value)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
