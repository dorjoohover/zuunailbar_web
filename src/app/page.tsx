import { Counter } from "@/components/counter";
import FeatureSection from "@/components/FeatureSection";
import HeroSection from "@/components/HeroSection";
import { siteData } from "@/lib/constants";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { ChevronRight, Handbag, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* bg-[url('/images/grid-bg.png')] bg-[url('/images/background.png')]  */}
      {/* bg-[#111315] */}
      <HeroSection />
      <FeatureSection />
      {/* <section className="py-24 bg-gray-200 flex-center">
        <div className="flex flex-col items-center w-full max-w-xl p-10 pb-20 bg-white rounded-2xl gap-y-3">
          <h1 className="text-3xl">Join our newsletter</h1>
          <h1>We'll send you a nice letter once per week. No spam.</h1>
          <div className="flex items-center h-12 mt-2 gap-x-2">
            <Input size="lg" className="h-full rounded-lg" placeholder="Your e-mail" />
            <Button className="h-full px-10 rounded-lg bg-primary-pink">Subscribe</Button>
          </div>
        </div>
      </section> */}
      <section className="py-20 bg-dark bg-no-repeat bg-cover bg-[url(/bg/banner-gradient.png)]">
        <div className="container grid items-center grid-cols-5 py-10">
          <div className="flex items-center col-span-2 space-x-5">
               <div className="border shadow-xl border-white/5 bg-gray-500/20 rounded-3xl size-17 aspect-square flex-center">
              <PhoneCall className="text-white" strokeWidth={"1.5px"} /> 
              </div>
            <div className="text-3xl text-white">
              <h1 className="">Танд асуулт байна уу?</h1>
              {/* <h1 className="">Манай үйлчилгээний зөвлөх</h1> */}
            </div>
          </div>
          <div className="col-span-1">
            {/* <div className="w-64 h-64 mask-[url('/masks/corner-mask.svg')] mask-size-cover"> */}
            {/* <img src="/your-image.jpg" alt="image" className="object-cover w-full h-full" /> */}
            {/* </div> */}
          </div>
          <div className="space-y-5">
            <h1 className="mb-3 text-dark-100">Lorem ipsum dolor sit amet.</h1>
            <h1 className="text-3xl font-medium text-primary-pink">(976) 9999 9999</h1>
            <Link href={"tel:+97699999999"} className="px-20 text-white border shadow-xl h-14 border-white/5 bg-gray-500/20 rounded-xl aspect-square flex-center">
              Холбогдох
              <ChevronRight className="text-white size-3" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
