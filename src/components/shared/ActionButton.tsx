"use client";

import Link from "next/link";
import { Button } from "@heroui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  href?: string; // if provided, acts as link
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ActionButton({
  href,
  children,
  className,
  onClick,
}: ActionButtonProps) {
  const baseClasses =
    " whitespace-nowrap text-sm transition-all h-auto py-2  rounded-full bg-rose-500/90 hover:bg-pink-600 text-white hover:scale-105 font-medium shadow-lg shadow-rose-200/50 px-5 duration-300";

  if (href) {
    return (
      <Button as={Link} href={href} className={cn(baseClasses, className)}>
        {children}
      </Button>
    );
  }

  return (
    <Button className={cn(baseClasses, className)} onPress={onClick}>
      {children}
    </Button>
  );
}
