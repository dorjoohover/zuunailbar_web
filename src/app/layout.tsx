import "../globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import Script from "next/script";
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
  const metaPixelId = process.env.META_PIXEL_ID;

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased scroll-smooth ",
          fontSans.variable,
        )}
        style={{
          margin: "0 !important",
        }}
      >
        {/* Meta Pixel Code — META_PIXEL_ID байхгүй бол (локал dev) ачаалахгүй */}
        {metaPixelId && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${JSON.stringify(metaPixelId)});
fbq('track', 'PageView');`}
            </Script>
            <noscript>
              <img
                alt=""
                height="1"
                src={`https://www.facebook.com/tr?id=${encodeURIComponent(metaPixelId)}&ev=PageView&noscript=1`}
                style={{ display: "none" }}
                width="1"
              />
            </noscript>
          </>
        )}
        {/* End Meta Pixel Code */}
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
