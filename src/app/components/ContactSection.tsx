import { ChevronRight, PhoneCall } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ContactSection() {
  return (
    <section className="py-20 bg-dark bg-no-repeat bg-cover bg-[url(/bg/banner-gradient.png)]">
      <div className="container grid items-center gap-4 py-10 sm:grid-cols-5 sm:gap-0">
        <div className="flex items-center justify-center col-span-2 space-x-5 sm:justify-start">
          <div className="border shadow-xl border-white/5 bg-gray-500/20 rounded-3xl size-17 aspect-square flex-center">
            <PhoneCall className="text-white" strokeWidth={"1.5px"} />
          </div>
          <div className="text-3xl text-white">
            <h1 className="">Танд асуулт байна уу?</h1>
          </div>
        </div>
        <div className="col-span-1"></div>
        <div className="col-span-2 space-y-5 col-center sm:block">
          <h1 className="mb-3 text-dark-100">Lorem ipsum dolor sit amet.</h1>
          <h1 className="text-3xl font-medium text-primary-pink">(976) 9999 9999</h1>
          <Link href={"tel:+97699999999"} className="glass-button">
            Холбогдох
            <ChevronRight className="text-white size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
