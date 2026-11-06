import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7a1a26",
};

export const metadata: Metadata = {
  title: "أجراس اليمن الإخبارية | من قلب اليمن إلى العالم",
  description: "منصة إخبارية يمنية مستقلة، تقدم تغطية إخبارية شاملة وموثوقة على مدار الساعة لأحدث التطورات والأحداث المحلية والإقليمية والدولية.",
  keywords: ["أجراس اليمن", "أخبار اليمن", "اليمن", "أخبار عاجلة", "صحافة يمنية"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
