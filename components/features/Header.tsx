"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelect from "../ui/LanguageSelect";
import ThemeToggle from "../ui/ThemeToggle";


export default function Header({ onToggleSidebar, isSidebarOpen }: { onToggleSidebar: () => void, isSidebarOpen: boolean }) {
  const { t } = useTranslation();

  const [isWidth1000Px, setIsWidth1000Px] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.innerWidth < 1000;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsWidth1000Px(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="sticky z-10 top-0 border-b w-full items-center border-black/10 bg-white/85 backdrop-blur h-20 dark:border-white/10 dark:bg-slate-950/85 header">
      <div className="mx-auto h-full flex w-full items-center justify-between px-2 sm:px-4">
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
            {t("common.systemName")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSelect className="w-36 [&_.ant-select-selector]:!rounded-full [&_.ant-select-selector]:!shadow-none" />
          </div>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
