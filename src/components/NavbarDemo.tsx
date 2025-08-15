"use client";
import { Navbar, NavBody, NavItems, MobileNav, NavbarLogo, NavbarButton, MobileNavHeader, MobileNavToggle, MobileNavMenu } from "./ui/resizable-navbar";
import { useState } from "react";
import Login from "./Login";
import { Button } from "@heroui/button";
import Link from "next/link";

export function NavbarDemo() {
  const navItems = [
    {
      name: "Үйлчилгээ",
      link: "/service",
    },
    {
      name: "Бидний тухай",
      link: "/about",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavItems items={navItems} />
        <NavbarLogo />
        <div className="flex items-center gap-4">
          <Login />
          {/* <NavbarButton variant="secondary"></NavbarButton> */}
          <Button href="/order" as={Link} className="px-4 bg-white rounded-full">
            Захиалга
          </Button>
          {/* <NavbarButton href="/" variant="primary"></NavbarButton> */}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          {navItems.map((item, idx) => (
            <a key={`mobile-link-${idx}`} href={item.link} onClick={() => setIsMobileMenuOpen(false)} className="relative text-neutral-600 dark:text-neutral-300">
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex flex-col w-full gap-4">
            <NavbarButton onClick={() => setIsMobileMenuOpen(false)} variant="primary" className="w-full">
              Login
            </NavbarButton>
            <NavbarButton onClick={() => setIsMobileMenuOpen(false)} variant="primary" className="w-full">
              Book a call
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
