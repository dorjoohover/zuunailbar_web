import { siteData } from "@/lib/constants";
import Image from "next/image";
import ServicesSection from "./ServicesSection";

import { ListType, icons, text } from "@/lib/const";
import { Feature } from "@/models/home.model";
import { Service } from "@/models";
import { cn } from "@/lib/utils";

export default function FeatureSection({
  data,
  services,
  main,
}: {
  data: ListType<Feature>;
  main: Service[];
  services: ListType<Service>;
}) {
  return (
    <section className="bg-white overflow-hidden rounded-[50px] -translate-y-0 mt-20 -mb-20 relative z-10">
      {/* Banner features */}
      <section className="rounded-[50px] relative z-10 bg-no-repeat bg-cover bg-black bg-[url(/bg/banner-gradient.png)] mx-[3vw]">
        <div className="container grid gap-5 py-16 xs:grid-cols-2 lg:grid-cols-4">
          {data.items.map((item) => {
            const Icon = icons[item.icon];
            return (
              <div
                key={item.id}
                className=" bg-card bg-gradient-to-b from-white to-rose-50/30 border-rose-100/50 shadow-2xl relative overflow-hidden border  rounded-3xl h-full "
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50/30 to-white rounded-3xl  p-4"></div>
                <div className="flex relative z-10 flex-col text-center py-8 gap-6 items-center">
                  <div className="flex items-center size-18 rounded-full transition-transform duration-300 bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 justify-center">
                    {item.icon ? (
                      <Icon
                        className="text-white"
                        size={32}
                        strokeWidth={"1.5px"}
                      />
                    ) : (
                      <span className="text-xs ">No Icon</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 h-12 flex items-center justify-center bg-clip-text text-transparent">
                      {item.title}
                    </h1>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* What we do */}
      <section className="container py-16 text-dark">
        <h1 className={cn(text, 'text-5xl font-medium')}>Бид юу хийдэг вэ?</h1>
        <div className="grid grid-cols-1 gap-10 mt-10 sm:grid-cols-2">
          {main.map((service) => {
            return (
              <div
                className="space-y-6 bg-card bg-gradient-to-b from-white to-rose-50/30 border-rose-100/50  pb-6 shadow-2xl relative overflow-hidden border  rounded-3xl h-full"
                key={service.id}
              >
                <div className="aspect-[2/1] bg-gray-200 w-full overflow-hidden rounded-2xl relative">
                  <Image
                    src={`/api/file/${service.image}`}
                    width={800}
                    height={800}
                    alt="logo"
                    className="object-cover size-full"
                  />
                </div>
                <div className="space-y-4 px-4">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent">
                    {service.name}
                  </h1>
                  <p className="text-gray-500">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services cards */}
      <ServicesSection services={services} />
    </section>
  );
}
