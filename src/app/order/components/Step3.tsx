"use client";

import { formatTime, parseDate } from "@/lib/functions";
import { Button } from "@heroui/button";
import Image from "next/image";

interface Step3Props {
  values: {
    branch: string;
    user: string;
    services: string[];
    date: Date;
    time: string;
  };
}

export default function Step3({ values }: Step3Props) {
  return (
    <div className="space-y-10">
      <h2 className="mb-8 text-xl font-semibold text-center gap-y-10">Таны захиалгын мэдээлэл</h2>
      <div className="grid grid-cols-2 space-y-2">
        <h1>
          <span className="font-semibold">Салбар:</span> {values.branch}
        </h1>
        <h1>
          <span className="font-semibold">Үйлчилгээ:</span> {values.services.join(" | ")}
        </h1>
        <h1>
          <span className="font-semibold">Огноо:</span> {values.date && parseDate(values.date, false)}
        </h1>
        <h1>
          <span className="font-semibold">Захиалгын цаг:</span> {formatTime(values.time)}
        </h1>
        <h1>
          <span className="font-semibold">Артист:</span> {values.user}
        </h1>
      </div>
      <div className="flex flex-col text-center gap-y-5">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-center">Баталгаажуулах /Урьдчилгаа/</h1>
          <h3 className="text-sm text-gray-600">2025/08/08</h3>
        </div>
        <h1 className="text-3xl font-extrabold">10'000₮</h1>
        <Image src="/" alt="Qpay: QR code" width={500} height={500} className="object-cover w-full bg-gray-200 aspect-square rounded-xl size-full flex-center" />
        <div className="flex flex-col items-center justify-center gap-2">
          <Button className="text-white bg-dark">Шалгах</Button>
          <Button isLoading className="text-white bg-dark">
            Шалгаж байна
          </Button>
          <Button className="text-white bg-teal-500">Баталгаажлаа</Button>
        </div>
      </div>
    </div>
  );
}
