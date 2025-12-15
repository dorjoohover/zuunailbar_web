import "../globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/lib/site";
import { fontSans } from "@/lib/fonts";
import Footer from "@/components/footer";
import ScrollToTopButton from "@/components/scrollToTopButton";
import { cookies } from "next/headers";
import { NavbarDemo } from "@/components/NavbarDemo";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/logo/zu-white.png",
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
  const store = await cookies();
  const token = store.get("token")?.value;
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased scroll-smooth ",
          fontSans.variable
        )}
        style={{
          margin: "0 !important",
        }}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <main className="">
            <ScrollToTopButton />
            {/* <Navbar /> */}
            <NavbarDemo token={token} />
            {children}
            <Footer />
            <div className="flex items-center justify-center w-full py-10">
              <Link
                isExternal
                className="flex items-center gap-1 text-current text-dark-100"
                href="/"
                title="Zu nailbar"
              >
                <span>© {new Date().getFullYear()} Zu Nailbar.</span>
                <span>All rights reserved.</span>
              </Link>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
