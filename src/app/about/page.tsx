"use client";

import { text } from "@/lib/const";
import { siteData } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="container relative py-24">
      <Image
        src={"/logo/zu-black.png"}
        width={1000}
        height={1000}
        alt="logo"
        className="absolute top-[35%] left-[50%] -translate-y-[50%] -translate-x-[50%] object-contain lg:w-2/3 w-full opacity-5"
      />
      <div className="relative flex flex-col items-start w-full pt-10 space-y-20">
        <div className="space-y-8">
          <h1 className="text-5xl font-semibold sm:text-7xl">
            <span>Zu Nailbar</span>
            <br /> Төгс
            <span className="gradient-text"> гоо сайхан</span>
          </h1>
          <p className="max-w-2xl mb-2 mx-auto text-lg sm:text-xl text-dark-200">
            {" "}
            Zu Nailbar хумсны салон нь 2018 оноос хойш тасралтгүй үйл
            ажиллагаагаа явуулж байгаа бөгөөд 2021 онд Солонгос улсын чанар,
            аюулгүй байдлын стандартыг бүрэн хангасан Yogurt хумсны будагны
            брендийг Монголдоо хамгийн анх нэвтрүүлснээр үйлчлүүлэгчиддээ
            чанартай үйлчилгээг чанартай бүтээгдэхүүнээр авах боломжийг бий
            болгосон юм. Өнөөдөр бид Орос болон Солонгосын орчин үеийн
            технологийг хослуулан маникюр, педикюрын үйлчилгээг чанарын өндөр
            түвшинд хүргэхийн зэрэгцээ эрүүл ахуй, ариун цэврийн олон улсын
            стандартыг баримталдаг нь хамгийн гол үнэ цэнэ юм.
            Үйлчлүүлэгчдийнхээ эрүүл мэнд, аюулгүй байдлыг хамгийн тэргүүнд
            тавьж, найдвартай, чанартай үйлчилгээг үзүүлэхээр бид зорин ажиллаж
            байна.
          </p>
          <p className="max-w-2xl mb-2 mx-auto text-lg sm:text-xl text-dark-200">
            Давуу тал:
          </p>
          <ul className="max-w-2xl mx-auto text-lg list-disc ml-6 sm:text-xl text-dark-200">
            <li>Чанартай бүтээгдэхүүн </li>
            <li>Мэргэжлийн туршлагатай артистууд</li>
            <li>Ариун цэвэр, эрүүл ахуйн олон улсын стандарт</li>
          </ul>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {siteData.about.map((feature, i) => {
            const { Icon, title, text } = feature;
            return (
              <div
                key={i}
                className="bg-linear-to-r from-rose-300 to-rose-500 shadow-xl transition-all duration-300 rounded-2xl px-10 py-6 h-full flex justify-center flex-col items-center text-center "
              >
                <Icon className="text-rose-50" size={60} />
                <h1 className="text-white my-4 font-bold text-2xl">{title}</h1>
                <p className="text-white/80">{text}</p>
              </div>
            );
          })}
        </section>
        <section className="rounded-[50px] relative z-10 ">
          <div className="container grid grid-cols-1 gap-5 p-10 divide-gray-700 lg:grid-cols-2 sm:grid-cols-2 ">
            {siteData.address.map((item, index) => (
              <Link
                href={item.link}
                target="_blank"
                key={index}
                className="flex flex-col justify-center gap-6 p-10 duration-150 border-3 shadow-md border-rose-300/50 hover:shadow-md border-rose-400 bg-gradient-to-br from-rose-50 to-pink-50 group hover:border-rose-500 rounded-3xl "
              >
                {/* bg-[url('/images/glass-frame.png')] */}
                <>
                  <div className="flex items-center justify-start gap-4 text-white">
                    <div className="border shadow-xl bg-rose-500 rounded-xl size-14 aspect-square flex-center group-hover:bg-rose-600 transition-all duration-150">
                      {/*  */}
                      <MapPin className="text-white" strokeWidth={"1.5px"} />
                    </div>
                    <h1
                      className={cn(
                        text,
                        "text-lg group-hover:to-rose-600 transition-all duration-150"
                      )}
                    >
                      Салбар {item.id}
                    </h1>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-md font-medium">{item.name}</h1>
                    <p className="text-sm text-gray-500">{item.city}</p>
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
