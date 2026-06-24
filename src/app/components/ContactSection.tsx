import { button, icon, text } from "@/lib/const";
import { cn } from "@/lib/utils";
import { ChevronRight, PhoneCall } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ContactSection() {
  return (
    <section className="py-20 bg-card bg-gradient-to-b from-white to-rose-50/30 border-rose-100/50 shadow-2xl relative overflow-hidden border  rounded-3xl h-full">
      <div className="container grid items-center gap-4 py-10 sm:grid-cols-5 sm:gap-0">
        <div className="flex items-center justify-center col-span-2 space-x-5 sm:justify-start">
          <div className={icon}>
            <PhoneCall className="text-white" strokeWidth={"1.5px"} />
          </div>
          <div className="text-3xl text-white">
            <h1 className={text}>Танд асуулт байна уу?</h1>
          </div>
        </div>
        <div className="col-span-1"></div>
        <div className="col-span-2  space-y-5 col-center sm:block">
          <h1 className="mb-3 text-gray-500">Холбоо барих</h1>
          <h1 className={cn(text, 'font-semibold')}>
            (976) 8608 0708
          </h1>
          <Link href={"tel:+97686080708"} className={cn(button, 'flex w-auto max-w-[150px] rounded-md justify-between items-center text-lg gap-1')}>
            Холбогдох
            <ChevronRight className="text-white " size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
