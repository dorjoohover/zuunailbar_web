export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Zu Nailbar Web",
  description: "Manicure, Pedicure",
  navItems: [
    {
      label: "Нүүр",
      href: "/",
    },
    {
      label: "Үйлчилгээ",
      href: "/service",
    },
    {
      label: "Бидний тухай",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
