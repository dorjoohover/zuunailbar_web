"use client";

import { ListType, mnDate } from "@/lib/const";
import {
  firstLetterUpper,
  formatTime,
  getDayName,
  money,
  parseDate,
} from "@/lib/functions";
import { Branch, IOrder, IUserService, Service, User } from "@/models";
import { Button } from "@heroui/button";
import Image from "next/image";
import { totalPrice } from "./Step1";
import { ReviewCard } from "@/components/card";
import {
  Calendar,
  LocateIcon,
  MapPin,
  User as LUser,
  Folder,
  Clock,
  Wallet,
} from "lucide-react";

interface Step4Props {
  values: Partial<IOrder> & {
    times?: string;
  };
  branches: ListType<Branch>;
  users: ListType<User>;
  services: ListType<Service>;
}

export default function Step4({
  values,
  branches,
  services,
  users,
}: Step4Props) {
  const branch = branches.items.filter((a) => a.id == values.branch_id)[0];
  const user = users.items.filter((a) => a.id == values.users?.[0])?.[0];
  const duration = values.details?.reduce(
    (acc, item) => acc + (item?.duration ?? 0),
    0
  );
  const service_ids = values.details?.map((d) => d.service_id);
  const total = totalPrice({
    services: services.items,
    values: service_ids!,
  });
  const pre = values.details?.reduce((acc, item) => acc + (item?.pre ?? 0), 0);
  const date = values.order_date ?? mnDate();

  return (
    <div className="space-y-10">
      <h2 className="mb-8 text-xl font-semibold text-center gap-y-10">
        Захиалгын тойм
      </h2>
      <div className="border border-gray-300 rounded-lg py-2 px-4">
        <div className="grid grid-cols-1 space-y-2">
          <ReviewCard Icon={MapPin} title="Байршил">
            <div>
              <p className="text-gray-500 text-sm">
                {firstLetterUpper(branch.name)}
              </p>
              <p className="text-gray-500 text-xs">{branch.address}</p>
            </div>
          </ReviewCard>
          <ReviewCard Icon={Calendar} title="Өдөр | Цаг" bold={true}>
            <div>
              <p className="text-gray-500 text-sm">
                {getDayName(date.getDay() == 0 ? 7 : date.getDay())},{" "}
                {date.getMonth() + 1}-р сарын {date.getDate()},{" "}
                {date.getFullYear()}
              </p>
              <p className="text-gray-500 text-xs">
                {formatTime(values.start_time!)}
              </p>
            </div>
          </ReviewCard>
          <ReviewCard Icon={LUser} title="Үйлчилгээ | Артист" bold={true}>
            <div className="w-full">
              {values.details?.map((service, i) => {
                const min = service.min_price ?? 0;
                const max = service.max_price ?? 0;
                const ttl =
                  min == max || max == 0
                    ? money(min.toString())
                    : `${money(min.toString())} - ${money(max.toString())}`;
                return (
                  <div
                    className="bg-gray-100 px-2 py-3 rounded-md flex justify-between items-center"
                    key={i}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm">
                          {firstLetterUpper(service.service_name ?? "")}
                        </p>
                        <span className="rounded-md bg-gray-200 px-2 py-1 text-xs">
                          {service.duration} мин
                        </span>
                      </div>
                      <span className="text-gray-500 flex items-center gap-1 text-xs">
                        <LUser size={12} color="#6B7280" />{" "}
                        {firstLetterUpper(user.nickname ?? "")}
                      </span>
                    </div>
                    {min != 0 && <p>{ttl}₮</p>}
                  </div>
                );
              })}
            </div>
          </ReviewCard>
          {values.customer_desc && (
            <ReviewCard Icon={Folder} title="Тайлбар">
              <div>
                <p className="text-gray-500 text-sm">
                  {firstLetterUpper(values.customer_desc)}
                </p>
              </div>
            </ReviewCard>
          )}
        </div>
        <div className="flex pt-8 justify-between">
          {pre && pre > 0 ? (
            <div>
              <div className="flex items-center gap-2">
                <Wallet size={14} color="#6B7280" />
                <p className="text-sm text-gray-500">Урьдчилгаа</p>
              </div>
              <p className="text-md">{money(pre.toString())}₮</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <Clock size={14} color="#6B7280" />
                <p className="text-sm text-gray-500">Нийт хугацаа</p>
              </div>
              <p className="text-md">{duration} мин</p>
            </div>
          )}
          <div className="flex flex-col items-end">
            <p className="text-sm text-gray-500">Нийт үнэ</p>
            <p className="text-lg ">{total}₮</p>
          </div>
        </div>
      </div>
{/* 
      <Image
        src="/"
        alt="Qpay: QR code"
        width={500}
        height={500}
        className="object-cover w-full bg-gray-200 aspect-square rounded-xl size-full flex-center"
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <Button className="text-white bg-dark">Шалгах</Button>
        <Button isLoading className="text-white bg-dark">
          Шалгаж байна
        </Button>
        <Button className="text-white bg-teal-500">Баталгаажлаа</Button>
      </div> */}
    </div>
  );
}
