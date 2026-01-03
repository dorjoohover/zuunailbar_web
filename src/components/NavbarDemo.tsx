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
import { useEffect, useState } from "react";
import { AuthModal } from "./Login";
import { Button } from "@heroui/button";
import Link from "next/link";
import { siteData } from "@/lib/constants";
import { Logout } from "./Logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/models";
import { mobileFormatter } from "@/lib/functions";
import { usePathname, useRouter } from "next/navigation";
import { API, Api, baseUrl } from "@/utils/api";

const UserMenu = ({ user }: { user: User }) => {
  const name = user.nickname ?? mobileFormatter(user.mobile ?? "");
  const phone = mobileFormatter(user.mobile ?? "");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-9 w-9 shadow-xl">
          <AvatarImage src={`/api/file/${user.profile_img}`} alt={name} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-50">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            {user.nickname && (
              <p className="text-xs leading-none text-muted-foreground">
                {phone}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={"/profile"}
            className="bg-gradient-to-br hover:from-rose-100/80 hover:to-pink-100/80 cursor-pointer w-full py-2 my-1 text-gray-700 transition-all duration-300"
          >
            Профайл
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <Logout />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function NavbarDemo({ token }: { token?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | undefined>();
  const me = async () => {
    if (token) {
      try {
        const res = await fetch(`${API.user}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        const data = await res.json();
        if (data?.payload && data?.payload?.user) {
          setUser(data.payload.user);
        }
      } catch (error) {
        console.log("error", error);
        // deleteCookie();
      }
    }
  };

  useEffect(() => {
    me();
  }, [token]);
  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody className="min-w-[830px] md:flex">
        <NavItems items={siteData.navItems} />

        <NavbarLogo />

        <div className="flex items-center gap-4">
          {/* {!token ? <Login /> : <Logout />} */}
          <Button
            href="/order"
            as={Link}
            className=" whitespace-nowrap text-sm transition-all h-auto py-2  rounded-full bg-rose-500/90 hover:bg-pink-600 text-white hover:scale-105 font-medium shadow-lg shadow-rose-200/50 px-5 duration-300"
          >
            Захиалга
          </Button>
          {user ? <UserMenu user={user} /> : <AuthModal />}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav className="md:hidden">
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
              className="relative "
            >
              <span className="block">{item.name}</span>
            </Link>
          ))}
          {user && (
            <>
              <Link
                href={"/profile"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative "
              >
                Профайл
              </Link>
            </>
          )}
          <div className="flex flex-col w-full gap-4">
            <Link
              href={"/order"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full bg-white border text-dark text-center text-sm flex items-center justify-center rounded-md font-semibold size-10"
            >
              Захиалга өгөх
            </Link>
            {token ? <Logout /> : <AuthModal />}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
