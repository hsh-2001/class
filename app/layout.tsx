import type { Metadata } from "next";
import "@/assets/styles/main.css";
import { getSiteUrl, seoDefaults } from "@/lib/seo";

export const metadata: Metadata = {
  applicationName: seoDefaults.applicationName,
  title: seoDefaults.defaultTitle,
  description: seoDefaults.defaultDescription,
  metadataBase: new URL(getSiteUrl()),
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
