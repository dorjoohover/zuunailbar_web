import { Counter } from "@/components/counter";
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
      <div className="bg-no-repeat bg-cover">
        <section className="container py-10 pb-0 ">
          <div className="flex h-full gap-4">
            <div className="h-[500px] basis-3/5 bg-no-repeat bg-cover relative overflow-hidden rounded-4xl">
              <Image src={"/images/nail/1.png"} width={1200} height={400} className="z-0 object-cover h-full" alt="" />
              {/* <div className="absolute inset-0 z-10 bg-diagonal-fade"></div> */}
            </div>
            <div className="h-[500px] relative overflow-hidden basis-2/5 rounded-4xl">
              <Image src={"/images/nail/2.png"} width={1200} height={400} className="z-0 object-cover h-full" alt="" />
              {/* <div className="absolute inset-0 z-10 bg-diagonal-fade"></div> */}
            </div>
          </div>
        </section>
        <section className="border-b border-gray-200">
          <div className="container grid grid-cols-4 py-16 divide-gray-200 divide-x-1">
            {siteData.features.map((item, index) => (
              <div key={index} className="justify-center gap-6 text-center col-center">
                <div className="border-2 rounded-xl size-18 aspect-square flex-center">{item.icon ? <item.icon className="" /> : <span className="text-xs text-gray-400">No Icon</span>}</div>
                <div className="space-y-2">
                  <h3 className="text-xl">Lorem, ipsum.</h3>
                  <p className="text-sm text-gray-500">Lorem ipsum dolor sit </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="container py-16">
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
      <section className="border-gray-200 border-y-1">
        <div className="container grid grid-cols-4 py-8 gap-y-1 gap-x-8">
          {siteData.detailService.map((item, index) => (
            <Link href={item.title} key={index}>
              <div className="flex flex-col items-center justify-center py-12 text-center duration-200 group outline-gray-200 hover:outline rounded-3xl gap-y-5">
                <div className="duration-200 bg-gray-200 rounded-3xl size-24 aspect-square flex-center group-hover:bg-primary-pink">{item.icon ? <item.icon className="size-8" /> : <span className="text-xs text-gray-400">No Icon</span>}</div>
                <h3 className="text-xl">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="h-[70vh] bg-dark w-full"></section>
      <section className="py-24 bg-gray-200 flex-center">
        <div className="flex flex-col items-center w-full max-w-xl p-10 pb-20 bg-white rounded-2xl gap-y-3">
          <h1 className="text-3xl">Join our newsletter</h1>
          <h1>We'll send you a nice letter once per week. No spam.</h1>
          <div className="flex items-center h-12 mt-2 gap-x-2">
            <Input size="lg" className="h-full rounded-lg" placeholder="Your e-mail" />
            <Button className="h-full px-10 rounded-lg bg-primary-pink">Subscribe</Button>
          </div>
        </div>
      </section>
      <section className="bg-dark">
        <div className="container grid items-center grid-cols-5 py-10">
          <div className="flex items-center col-span-2 space-x-5">
            <div className="h-20 aspect-square bg-dark-200 flex-center rounded-2xl">
              <PhoneCall className="text-white size-8" />
            </div>
            <div className="text-3xl text-white">
              <h1 className="">Танд асуулт байна уу?</h1>
              {/* <h1 className="">Манай үйлчилгээний зөвлөх</h1> */}
            </div>
          </div>
          <div className="col-span-1">
            <div className="w-64 h-64 mask-[url('/masks/corner-mask.svg')] mask-size-cover">
              <img src="/your-image.jpg" alt="image" className="object-cover w-full h-full" />
            </div>
          </div>
          <div className="space-y-5">
            <h1 className="text-dark-100">Lorem ipsum dolor sit amet.</h1>
            <h1 className="text-3xl font-medium text-primary-pink">(976) 9999 9999</h1>
            <Button className="px-10 text-xs font-medium tracking-wider text-white uppercase rounded py-7 bg-dark-200">
              Холбогдох
              <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
