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

export function ActionButton({ href, children, className, onClick }: ActionButtonProps) {
  const baseClasses = "text-white border shadow-xl  min-h-10 border-white/5 rounded-xl flex-center bg-[#101318] bg-cover bg-[url(/bg/banner-gradient.png)]";

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
