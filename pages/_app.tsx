import type { AppProps } from "next/app";
import MainLayout from "@/components/layouts/MainLayout";
import { ThemeProvider } from "next-themes";
import "@/assets/styles/main.css";
import "@/assets/styles/ant-custom.css";
import AuthGuard from "@/components/guard/AuthGuard";
import AntdThemeProvider from "@/components/providers/AntdThemeProvider";

type LayoutAwareComponent = AppProps["Component"] & {
  disableLayout?: boolean;
};

export default function App({ Component, pageProps }: AppProps) {
  const PageComponent = Component as LayoutAwareComponent;

  if (PageComponent.disableLayout) {
    return <PageComponent {...pageProps} />;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthGuard>
        <MainLayout>
          <AntdThemeProvider>
            <PageComponent {...pageProps} />
          </AntdThemeProvider>
        </MainLayout>
      </AuthGuard>
    </ThemeProvider>
  );
}
