'use client'

import { siteData } from "@/lib/constants";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="container relative py-24">
      <Image src={"/logo/zu-black.png"} width={1000} height={1000} alt="logo" className="absolute top-[35%] left-[50%] -translate-y-[50%] -translate-x-[50%] object-contain lg:w-2/3 w-full opacity-5" />
      <div className="relative flex flex-col items-start w-full pt-10 space-y-20">
        <div className="space-y-8">
          <h1 className="text-5xl font-semibold sm:text-7xl">
            <span>Zu Nailbar</span>
            <br /> Төгс
            <span className="gradient-text"> гоо сайхан</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-dark-200"> "ZU Nailbar" нь таны өдөр тутмын амьдралд өөртөө итгэх итгэл, гоо сайхны мэдрэмж, амар тайван байдлыг нэгэн зэрэг бэлэглэх зорилготой, мэргэжлийн ур чадвар, өндөр чанартай материал, эрүүл ахуйн дээд стандарт, халуун дулаан үйлчилгээгээрээ ялгардаг, таныг анхнаас нь угтах мөчөөс эхлэн тухтай орчин, тансаг мэдрэмж, таны хүссэн загвар болон өнгөний онцгой шийдлээр гайхшруулж, зөвхөн таны гоо сайхны аяллын дурсамжийг бүтээдэг онцгой газар юм.</p>
        </div>

        <section className="rounded-[50px] relative z-10 bg-no-repeat bg-cover bg-black bg-[url(/bg/banner-gradient.png)]">
          <div className="container grid grid-cols-1 gap-5 p-10 divide-gray-700 lg:grid-cols-3 sm:grid-cols-2">
            {siteData.address.map((item, index) => (
              <Link href={item.link} target="_blank" key={index} className="flex flex-col justify-center gap-6 p-10 duration-150 border shadow-md border-white/5 bg-gray-500/30 backdrop-blur-3xl rounded-3xl hover:bg-gray-500/50">
                {/* bg-[url('/images/glass-frame.png')] */}
                <>
                  <div className="flex items-center justify-start gap-4 text-white">
                    <div className="border shadow-xl border-white/5 bg-gray-500/20 rounded-xl size-14 aspect-square flex-center">
                      {/*  */}
                      <MapPin className="text-white" strokeWidth={"1.5px"} />
                    </div>
                    <h1 className="text-lg font-semibold">Салбар {item.id}</h1>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-white text-md">{item.name}</h1>
                    <p className="text-sm text-gray-400">{item.city}</p>
                  </div>
                </>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
