"use client";

import { ActionButton } from "@/components/shared/ActionButton";
import { siteData } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

import { useRouter } from "next/navigation";

export default function ServicesSection() {
  return (
    <section className="rounded-[50px] overflow-hidden relative">
      <div className="bg-cover bg-[url(/bg/white-gradient.png)]">
        <div className="container relative grid gap-5 pt-0 pb-16 divide-gray-700 xs:grid-cols-2 lg:grid-cols-4">
          <Image src={"/images/white-lash.png"} width={500} height={500} className="absolute object-contain -left-32 bottom-1 size-64 -rotate-10 floating-animation blur-xs" alt="floating lack" />
          <Image src={"/images/lash.png"} width={500} height={500} className="absolute z-10 object-contain -right-50 top-1 size-100 rotate-12 floating-animation" alt="floating lack" />
          {siteData.detailService.map((item, index) => (
            <ServiceCard key={index} item={item} index={index} />
          ))}
          <div className="my-5 col-span-full flex-center">
            <ActionButton href="#" onClick={() => {}} className="px-10 h-14">
              Үйлчилгээ авах
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ item, index }: { item: { icon?: React.ElementType; title: string; id: number; price: string }; index: number }) {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to order page with selected service
    router.push(`/service=${encodeURIComponent(item.id)}`);
  };

  return (
    <div onClick={() => router.push(`/service?active=${item.id}`)} key={index} className={cn("justify-start gap-6 px-8 py-10 text-center border shadow-md bg-white/40 border-gray-200/50 backdrop-blur-3xl rounded-3xl col-center cursor-pointer hover:scale-105 duration-300", index === 7 && "z-20")}>
      <div className="border shadow-xl bg-no-repeat border-gray-200/50 bg-[#101318]/80 bg-cover bg-[url(/bg/blue-gradient.png)] rounded-3xl size-18 aspect-square flex-center">{item.icon ? <item.icon className="text-white" strokeWidth={"1.5px"} /> : <span className="text-xs ">No Icon</span>}</div>
      <div className="space-y-2">
        <h1 className="text-xl">{item.title}</h1>
        <p className="text-xl font-bold text-dark-200">{item.price}</p>
      </div>
    </div>
  );
}
