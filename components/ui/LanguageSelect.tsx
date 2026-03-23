"use client";

import { languageOptions } from "@/lib/i18n";
import { Globe } from "lucide-react";
import { ConfigProvider, Select } from "antd";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

export default function LanguageSelect({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const isDark = resolvedTheme === "dark";

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            selectorBg: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)",
            activeBorderColor: isDark ? "rgba(255,255,255,0.16)" : "rgba(15,23,42,0.14)",
            hoverBorderColor: isDark ? "rgba(125,211,252,0.48)" : "rgba(3,105,161,0.48)",
            optionSelectedBg: isDark ? "rgba(125,211,252,0.16)" : "rgba(14,165,233,0.12)",
            optionActiveBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.04)",
            activeOutlineColor: isDark ? "rgba(125,211,252,0.18)" : "rgba(3,105,161,0.12)"
          }
        },
        token: {
          colorBgElevated: isDark ? "#111c34" : "#ffffff",
          colorBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)",
          colorText: isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.92)",
          colorTextPlaceholder: isDark ? "rgba(203,213,225,0.72)" : "rgba(100,116,139,0.72)"
        }
      }}
    >
      <Select
        aria-label={t("common.language")}
        value={i18n.resolvedLanguage ?? "en"}
        onChange={(value) => void i18n.changeLanguage(value)}
        options={languageOptions}
        suffixIcon={<Globe className={`h-4 w-4 ${isDark ? "text-slate-300" : "text-slate-500"}`} />}
        variant="outlined"
        className={className ?? "w-36 [&_.ant-select-selector]:!rounded-full [&_.ant-select-selector]:!shadow-none"}
      />
    </ConfigProvider>
  );
}
