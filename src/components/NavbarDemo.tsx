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
      <DropdownMenuTrigger asChild>
        <Button
          variant="light"
          className="h-9 py-0 hover:bg-accent hover:text-accent-foreground"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={`/api/file/${user.profile_img}`} alt={name} />
            <AvatarFallback className="text-xs">
              {name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon color="white" className="h-3  w-3 ml-1" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" >
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
          <Link href={"/profile"}>Профайл</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/my"}>Миний захиалгын түүх</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Logout />
        </DropdownMenuItem>
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
      <NavBody className="min-w-[630px]">
        <NavItems items={siteData.navItems} />
        <NavbarLogo />

        <div className="flex items-center gap-4">
          {/* {!token ? <Login /> : <Logout />} */}
          <Button
            href="/order"
            as={Link}
            className="px-4 text-black bg-white rounded-full"
          >
            Захиалга
          </Button>
          {user ? <UserMenu user={user} /> : <AuthModal />}
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
            {token ? <Logout /> : <AuthModal />}
            <Link
            href={'/order'}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full bg-white border text-dark text-center text-sm flex items-center justify-center rounded-md font-semibold size-10"
            >
              Захиалга өгөх
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
