import type { Metadata } from "next";
import "@/assets/styles/main.css";

export const metadata: Metadata = {
  title: "Class System",
  description: "Online class management dashboard",
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
