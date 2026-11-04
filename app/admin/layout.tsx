import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeConfigProvider } from "@/components/theme-customizer";
import { Toaster } from "@/components/ui/sonner";
import { DirectionProvider } from "@radix-ui/react-direction";
import { AdminScopeEnforcer } from "@/components/admin-scope-enforcer";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DirectionProvider dir="rtl">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ThemeConfigProvider>
          <div
            dir="rtl"
            data-admin-root="true"
            className={`${ibmPlexArabic.variable} admin-scope min-h-full flex-1 flex flex-col font-admin antialiased`}
            style={{
              fontFamily:
                'var(--font-ibm-plex-arabic), "IBM Plex Sans Arabic", sans-serif',
            }}
          >
            <AdminScopeEnforcer />
            {children}
          </div>
          <Toaster dir="rtl" />
        </ThemeConfigProvider>
      </ThemeProvider>
    </DirectionProvider>
  );
}
