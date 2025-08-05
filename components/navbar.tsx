"use client";

import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";

import { Navbar as HeroUINavbar, NavbarContent, NavbarMenu, NavbarMenuToggle, NavbarBrand, NavbarItem, NavbarMenuItem } from "@heroui/navbar";
import { Button, ButtonGroup } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/lib/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { TwitterIcon, GithubIcon, DiscordIcon, HeartFilledIcon, SearchIcon, Logo } from "@/components/icons";
import Image from "next/image";

export const Navbar = () => {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        setShow(currentScrollY < lastScrollY); // scroll up => show, scroll down => hide
      } else {
        setShow(true); // always show when near top
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={<SearchIcon className="flex-shrink-0 text-base pointer-events-none text-default-400" />}
      type="search"
    />
  );

  return (
    // <div className={clsx("container sticky z-50 py-0 top-3 transition-transform duration-300", show ? "translate-y-0" : "-translate-y-full")}>
    <HeroUINavbar maxWidth="xl" className="py-2 bg-no-repeat bg-cover border-b-2 border-gray-50">
      <NavbarContent className="basis-2/5" justify="start">
        <ul className="justify-start hidden gap-4 ml-2 lg:flex">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink className={clsx(linkStyles({ color: "foreground" }), "data-[active=true]:text-primary font-medium data-[active=true]:font-medium")} color="foreground" href={item.href}>
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>
      <NavbarContent className="basis-1/5" justify="center">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
            <Image src="/images/logo-black.png" alt="logo" width={100} height={100} />
          <NextLink className="flex flex-col items-center justify-start gap-1" href="/">
            {/* <p className="font-bold text-inherit">Zu Nailbar</p> */}
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="justify-center hidden sm:flex basis-2/5" justify="end">
        <NavbarItem className="hidden gap-2 sm:flex">
          <ThemeSwitch />
          <Button className="bg-primary-pink">Захиалга</Button>
        </NavbarItem>
        {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
      </NavbarContent>

      <NavbarContent className="pl-4 sm:hidden basis-1" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="flex flex-col gap-2 mx-4 mt-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link color={index === 2 ? "primary" : index === siteConfig.navMenuItems.length - 1 ? "danger" : "foreground"} href="#" size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
    // </div>
  );
};
