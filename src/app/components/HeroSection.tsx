"use client";
import React, { useMemo, useState } from "react";
import { HeroParallax } from "../../components/ui/hero-parallax";
import { ListType } from "@/lib/const";
import { Home } from "@/models/home.model";

export default function HeroSection({ data }: { data: ListType<Home> }) {
  function useAllImagesLoaded(urls: string[]) {
    const [loaded, setLoaded] = useState(0);
    const total = urls.length;
    const done = total === 0 || loaded >= total;

    const handleDone = () => setLoaded((c) => c + 1);

    //  Scroll lock
    React.useEffect(() => {
      if (!done) {
        const prevOverflow = document.body.style.overflow;
        const prevTouch = document.body.style.touchAction;
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
        return () => {
          document.body.style.overflow = prevOverflow;
          document.body.style.touchAction = prevTouch;
        };
      }
    }, [done]);

    return { done, total, loaded, handleDone };
  }
  const urls = useMemo(() => data.items.map((p) => `/api/file/${p.image}`), [data]);

  const { done, total, loaded, handleDone } = useAllImagesLoaded(urls);

  return (
    <div className="bg-no-repeat bg-cover">
      {/* {!done && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-10">
            <div className="pulse"></div>
            <div className="text-sm text-gray-600">
              Зургууд: {loaded}/{total}
            </div>
          </div>
        </div>
      )} */}
      <HeroParallax data={data?.items ?? []} handleDone={handleDone} />
    </div>
  );
}
