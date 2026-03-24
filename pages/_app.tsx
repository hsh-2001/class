import type { AppProps } from "next/app";
import MainLayout from "@/components/layouts/MainLayout";
import { ThemeProvider } from "next-themes";
import "@/assets/styles/main.css";
import "@/assets/styles/ant-custom.css";
import AuthGuard from "@/components/guard/AuthGuard";
import AntdThemeProvider from "@/components/providers/AntdThemeProvider";
import I18nProvider from "@/components/providers/I18nProvider";
import Head from "next/head";
import { useRouter } from "next/router";
import { getPageSeo, seoDefaults } from "@/lib/seo";
import GuestLayout from "@/components/layouts/GuestLayout";

type LayoutAwareComponent = AppProps["Component"] & {
  disableLayout?: boolean;
};

export default function App({ Component, pageProps }: AppProps) {
  const PageComponent = Component as LayoutAwareComponent;
  const router = useRouter();
  const seo = getPageSeo(router.pathname, router.asPath);

  if (PageComponent.disableLayout) {
    return (
      <>
        <Head>
          <title>{seo.title}</title>
          <meta name="application-name" content={seoDefaults.applicationName} />
          <meta name="description" content={seo.description} />
          {seo.keywords.length > 0 ? <meta name="keywords" content={seo.keywords.join(", ")} /> : null}
          <meta name="robots" content={seo.robots} />
          <meta name="googlebot" content={seo.robots} />
          <link rel="canonical" href={seo.canonicalUrl} />
          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content={seo.openGraph.type} />
          <meta property="og:site_name" content={seo.openGraph.siteName} />
          <meta property="og:title" content={seo.openGraph.title} />
          <meta property="og:description" content={seo.openGraph.description} />
          <meta property="og:url" content={seo.openGraph.url} />
          <meta property="og:image" content={seo.openGraph.image} />
          <meta name="twitter:card" content={seo.twitter.card} />
          <meta name="twitter:title" content={seo.twitter.title} />
          <meta name="twitter:description" content={seo.twitter.description} />
          <meta name="twitter:image" content={seo.twitter.image} />
        </Head>
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <GuestLayout>
              <AntdThemeProvider>
                <PageComponent {...pageProps} />
              </AntdThemeProvider>
            </GuestLayout>
          </ThemeProvider>
        </I18nProvider>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="application-name" content={seoDefaults.applicationName} />
        <meta name="description" content={seo.description} />
        {seo.keywords.length > 0 ? <meta name="keywords" content={seo.keywords.join(", ")} /> : null}
        <meta name="robots" content={seo.robots} />
        <meta name="googlebot" content={seo.robots} />
        <link rel="canonical" href={seo.canonicalUrl} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content={seo.openGraph.type} />
        <meta property="og:site_name" content={seo.openGraph.siteName} />
        <meta property="og:title" content={seo.openGraph.title} />
        <meta property="og:description" content={seo.openGraph.description} />
        <meta property="og:url" content={seo.openGraph.url} />
        <meta property="og:image" content={seo.openGraph.image} />
        <meta name="twitter:card" content={seo.twitter.card} />
        <meta name="twitter:title" content={seo.twitter.title} />
        <meta name="twitter:description" content={seo.twitter.description} />
        <meta name="twitter:image" content={seo.twitter.image} />
      </Head>
      <I18nProvider>
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
      </I18nProvider>
    </>
  );
}
