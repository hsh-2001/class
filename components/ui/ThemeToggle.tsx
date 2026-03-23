"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import SToggleButton from "./SToggleButton";

export default function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <SToggleButton
      isActive={resolvedTheme === "light"}
      onChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      name={{ option1: t("common.light"), option2: t("common.dark") }}
      icon={{ icon1: <Sun />, icon2: <Moon /> }}
      className={className}
    />
  );
}
