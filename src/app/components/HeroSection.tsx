"use client";
import React, { useMemo, useState } from "react";
import { HeroParallax } from "../../components/ui/hero-parallax";
import { ListType } from "@/lib/const";
import { Home } from "@/models/home.model";

export default function HeroSection({ data }: { data: ListType<Home> }) {
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
      <HeroParallax data={data?.items ?? []} />
    </div>
  );
}
