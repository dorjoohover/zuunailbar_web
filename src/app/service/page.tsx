"use client";

import { siteData } from "@/lib/constants";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const activeQuery = searchParams.get("active");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!activeQuery) return;
    const idx = siteData.detailService.findIndex((s) => s.id.toString() === activeQuery);
    if (idx >= 0) setActiveIndex(idx);
  }, [activeQuery]);

  const activeService = siteData.detailService[activeIndex];

  return (
    <div className="relative py-20">
      <div className="absolute top-0 left-0 size-full bg-cover bg-no-repeat bg-[url(/bg/blue-gradient.png)] bg-center opacity-20" />

      <div className="container relative z-10 grid items-center w-full grid-cols-2 gap-8 pt-10 mx-auto">
        {/* Left image */}
        <div className="relative flex-center">
          <div className="relative w-full overflow-hidden bg-gray-100 border aspect-square rounded-xl">
            <Image
              src="/images/nail/1.png"
              // siteData.detailService[activeIndex].image || '/images/nail/1.png'
              alt={activeService.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 z-10 from-dark via-transparent bg-gradient-to-t to-transparent size-full"></div>
            <div className="absolute bottom-0 left-0 z-20 p-10 text-white">
              <p>{siteData.detailService[activeIndex].description}</p>
            </div>
          </div>
        </div>

        {/* Right list */}
        <div className="flex flex-col overflow-y-auto">
          {siteData.detailService.map((service, idx) => (
            <div key={service.id} onMouseEnter={() => setActiveIndex(idx)} className={`flex justify-between items-center py-6 border-b border-dark cursor-pointer transition-opacity duration-300 ${idx === activeIndex ? "opacity-100" : "opacity-30"}`}>
              <div className="flex items-center gap-2">
                <span className="font-bold">00{service.id}</span>
                <h2 className="text-lg font-medium">{service.title}</h2>
              </div>
              <h2 className="text-lg font-bold">{service.price}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
