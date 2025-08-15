import "../globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/lib/site";
import { fontSans } from "@/lib/fonts";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTopButton from "@/components/scrollToTopButton";
import { baseUrl } from "@/utils/api";
import Template from "./template";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased scroll-smooth ",
          fontSans.variable
        )}
      >
        <Template>
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <main className="">
              <ScrollToTopButton />
              <Navbar />
              {children}
              <Footer />
              <div className="flex items-center justify-center w-full py-10">
                <Link
                  isExternal
                  className="flex items-center gap-1 text-current"
                  href="https://heroui.com?utm_source=next-app-template"
                  title="heroui.com homepage"
                >
                  <span className="text-dark-100">© 2025 Zu Nailbar by</span>
                  <p className="">Lorem</p>
                  <span className="text-dark-100">| All Rigth Reserved</span>
                </Link>
              </div>
            </main>
          </Providers>
        </Template>
      </body>
    </html>
  );
}
