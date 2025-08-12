import { siteData } from "@/lib/constants";
import Image from "next/image";
import React from "react";
import { HeroParallax } from "./ui/hero-parallax";

export const products = [
  {
    title: "1",
    link: "/",
    thumbnail: "/nail/image.png",
  },
  {
    title: "2",
    link: "/",
    thumbnail: "/nail/image.png",
  },
  {
    title: "3",
    link: "/",
    thumbnail: "/nail/image.png",
  },

  {
    title: "4",
    link: "/",
    thumbnail: "/nail/image.png",
  },
  {
    title: "5",
    link: "/",
    thumbnail: "/nail/image.png",
  },
  {
    title: "6",
    link: "/",
    thumbnail: "/nail/image.png",
  },

  {
    title: "7",
    link: "/",
    thumbnail: "/nail/image.png",
  },
  {
    title: "8",
    link: "/.com",
    thumbnail: "/nail/image.png",
  },
  {
    title: "9",
    link: "/",
    thumbnail: "/nail/image.png",
  },
  {
    title: "10",
    link: "/",
    thumbnail: "/nail/image.png",
  },
  {
    title: "11",
    link: "/",
    thumbnail: "/nail/image.png",
  },

  {
    title: "7",
    link: "/",
    thumbnail: "/nail/image.png",
  },
  {
    title: "8",
    link: "/.com",
    thumbnail: "/nail/image.png",
  },
  {
    title: "9",
    link: "/",
    thumbnail: "/nail/image.png",
  },
  {
    title: "10",
    link: "/",
    thumbnail: "/nail/image.png",
  },
  {
    title: "11",
    link: "/",
    thumbnail: "/nail/image.png",
  },
];

export default function HeroSection() {
  return (
    <div className="bg-no-repeat bg-cover">
      <HeroParallax products={products} />
      {/* <section className="container py-10 pb-0 ">
        <div className="flex h-full gap-4">
          <div className="h-[500px] basis-3/5 bg-no-repeat bg-cover relative rounded-4xl ">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden custom_shadow"></div>
            <Image src={"/images/nail/1.png"} width={1200} height={400} className="relative z-10 object-cover h-full overflow-hidden border-b border-l border-pink-50/40 rounded-4xl backdrop-blur-md-2xl" alt="" />
          </div>
          <div className="h-[500px] relative overflow-hidden basis-2/5 rounded-4xl">
            <Image src={"/images/nail/2.png"} width={1200} height={400} className="z-0 object-cover h-full" alt="" />
          </div>
        </div>
      </section>*/}
    </div>
  );
}
