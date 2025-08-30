"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";
import { useState } from "react";
import Login from "./Login";
import { Button } from "@heroui/button";
import Link from "next/link";
import { siteData } from "@/lib/constants";

export function NavbarDemo({ token }: { token?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody className="min-w-[630px]">
        <NavItems items={siteData.navItems} />
        <NavbarLogo />
        <div className="flex items-center gap-4">
          {!token && <Login />}
          {/* <NavbarButton variant="secondary"></NavbarButton> */}
          <Button
            href="/order"
            as={Link}
            className="px-4 text-black bg-white rounded-full"
          >
            Захиалга
          </Button>
          {/* <NavbarButton href="/" variant="primary"></NavbarButton> */}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {siteData.navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-white"
            >
              <span className="block">{item.name}</span>
            </Link>
          ))}
          <div className="flex flex-col w-full gap-4">
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Нэвтрэх
            </NavbarButton>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Захиалга өгөх
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
