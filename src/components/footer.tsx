"use client";

import { siteData } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Footer() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isService = pathname === "/service";

  return (
    <footer
      className={cn(
        "border-gray-200 border-y bg-white z-10 relative rounded-[50px]",
        isHome && "-mt-20"
      )}
    >
      <div className="container grid grid-cols-6 gap-4 py-12">
        {/* <Image src={"/images/logo.png"} /> */}
        <div className="space-y-6 col-span-6 sm:col-span-">
          <h1 className="text-2xl">+(976) ️8608 0708</h1>
          <p>
            Бид Солонгос улсын yogurtnail, mayour зэрэг брэндүүдийн будаг,
            суурь, топыг үйлчилгээндээ ашигладаг бөгөөд үргэлж шинэ содон
            бүтээгдэхуун, илүү загварлаг байдлыг үйлчилгээндээ нэвтрүүлж байдаг
            билээ🥰 Мөн бүх үйлчилгээндээ стандартын дагуу ариутгасан багаж
            хэрэгсэлээс гадна 1 удаагийн туслах хэрэгслүүдийг ашигладаг
            байгаа.🎀
          </p>
          <div className="flex gap-x-2">
            {siteData.footerLinks.map((item, index) => (
              <Link
                href={item.url}
                target="_blank"
                className="flex items-center duration-150 bg-gray-100 size-11 flex-center rounded-xl gap-x-2 hover:bg-dark hover:text-white"
                key={index}
              >
                <item.icon className="size-4" />
              </Link>
            ))}
          </div>
        </div>
        {/* <div className="space-y-6 col-span-2">
            
        </div> */}
        <div className="space-y-6 col-span-6 sm:col-span-2">
          <h1>Main</h1>
          <ul className="space-y-3 text-dark-100">
            {siteData.navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
