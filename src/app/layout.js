import "./globals.css";
import Providers from "@/components/ui/providers";
import Appsidebar from "@/components/Appsidebar";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "LeadCRM",
  description: "Lead Management System",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <SidebarProvider>
            <div className="flex h-screen overflow-hidden w-full">

              <Suspense fallback={null}>
                <Appsidebar />
              </Suspense>

              <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

                
                <header className="h-12 flex items-center px-4 border-b border-border shrink-0">
                  <SidebarTrigger className="mr-3" />
                  <span className="text-sm font-medium text-muted-foreground">LeadCRM</span>
                </header>

                <main className="flex-1 overflow-y-auto bg-background w-full">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground text-sm">Loading...</p>
                    </div>
                  }>
                    {children}
                  </Suspense>
                </main>

              </div>

            </div>
          </SidebarProvider>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}