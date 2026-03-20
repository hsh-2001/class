"use client";

import { App as AntApp, ConfigProvider, theme as antTheme, type ThemeConfig } from "antd";
import { useTheme } from "next-themes";

function getAntdThemeConfig(isDark: boolean): ThemeConfig {
  return {
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: isDark
      ? {
          colorPrimary: "#7dd3fc",
          colorBgBase: "#020617",
          colorBgLayout: "#020617",
          colorBgContainer: "#0f172a",
          colorBgElevated: "#111c34",
          colorBorder: "rgba(148, 163, 184, 0.22)",
          colorBorderSecondary: "rgba(148, 163, 184, 0.14)",
          colorText: "rgba(248, 250, 252, 0.92)",
          colorTextSecondary: "rgba(203, 213, 225, 0.72)",
          colorTextPlaceholder: "rgba(148, 163, 184, 0.68)",
          colorFillAlter: "rgba(148, 163, 184, 0.08)",
          colorFillSecondary: "rgba(148, 163, 184, 0.12)",
          colorSplit: "rgba(148, 163, 184, 0.14)",
        }
      : {
          colorPrimary: "#0369a1",
          colorBgBase: "#f8fafc",
          colorBgLayout: "#f8fafc",
          colorBgContainer: "#ffffff",
          colorBgElevated: "#ffffff",
          colorBorder: "rgba(15, 23, 42, 0.12)",
          colorBorderSecondary: "rgba(15, 23, 42, 0.08)",
          colorText: "rgba(15, 23, 42, 0.92)",
          colorTextSecondary: "rgba(51, 65, 85, 0.72)",
          colorTextPlaceholder: "rgba(100, 116, 139, 0.72)",
          colorFillAlter: "rgba(15, 23, 42, 0.04)",
          colorFillSecondary: "rgba(15, 23, 42, 0.06)",
          colorSplit: "rgba(15, 23, 42, 0.08)",
        },
  };
}

export default function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ConfigProvider theme={getAntdThemeConfig(isDark)}>
      <AntApp className="ant-app-shell">{children}</AntApp>
    </ConfigProvider>
  );
}
