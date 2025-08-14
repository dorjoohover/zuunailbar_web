import { siteData } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ServicesSection from "./ServicesSection";

export default function FeatureSection() {
  return (
    <section className="bg-white overflow-hidden rounded-[50px] -translate-y-0 mt-20 -mb-20 relative z-10">
      {/* Banner features */}
      <section className="rounded-[50px] relative z-10 bg-no-repeat bg-cover bg-black bg-[url(/bg/banner-gradient.png)] mx-[3vw]">
        <div className="container grid gap-5 py-16 divide-gray-700 xs:grid-cols-2 lg:grid-cols-4">
          {siteData.features.map((item, index) => (
            <div key={index} className="justify-center gap-6 py-10 text-center border shadow-md border-white/5 bg-gray-500/30 backdrop-blur-3xl rounded-3xl col-center">
              {/* bg-[url('/images/glass-frame.png')] */}
              <div className="border shadow-xl border-white/5 bg-gray-500/20 rounded-3xl size-18 aspect-square flex-center">
                {/*  */}
                {item.icon ? <item.icon className="text-white" strokeWidth={"1.5px"} /> : <span className="text-xs ">No Icon</span>}
              </div>
              <div className="space-y-2">
                <h1 className="text-xl text-white">{item.title}</h1>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="container py-16 text-dark">
        <h1 className="text-5xl">Бид юу хийдэг вэ?</h1>
        <div className="grid grid-cols-2 gap-10 mt-10">
          {siteData.mainService.map((item, index) => (
            <div className="space-y-6" key={index}>
              <div className="aspect-[2/1] bg-gray-200 w-full overflow-hidden rounded-2xl relative">
                <Image src={item.image} width={800} height={800} alt="logo" className="object-cover size-full" />
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl">{item.title}</h1>
                <p className="text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services cards */}
      <ServicesSection />
    </section>
  );
}
