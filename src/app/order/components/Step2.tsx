"use client";

import { Calendar } from "@heroui/calendar";
import { Button } from "@heroui/button";
import { Clock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DateValue, fromDate } from "@internationalized/date";
import {
  BookingSchedule,
  IOrder,
  IOrderDetail,
  User,
  UserService,
} from "@/models";
import { ListType } from "@/lib/const";
import { formatTime, selectDate, usernameFormatter } from "@/lib/functions";
import { useCallback, useMemo } from "react";
import { Textarea } from "@heroui/input";
import { ArtistCard } from "@/components/card";

interface Step2Props {
  // date: CalendarDate | null;
  // setDate: (val: CalendarDate | null) => void;
  // choiceTime: string;
  // setChoiceTime: (val: string) => void;
  // choiceArtist: string;
  // setChoiceArtist: (val: string) => void;
  errors: {
    date?: string;
    time?: string;
    user?: string;
  };
  showError: boolean;
  values: IOrderDetail[];
  userServices: UserService[];
  // eniig hiine
  users: ListType<User>;
  onChange: <K extends keyof IOrder>(key: K, value: IOrder[K]) => void;
  // clearError: (field: string) => void;
}

export default function Step2({
  // date,
  onChange,
  users,
  userServices,
  errors,
  showError,
  values,
  // clearError,
}: Step2Props) {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <p className="font-medium ">Артист сонгох (заавал биш)</p>
        <p className="text-gray-500 text-xs">
          Артистаа сонгох эсвэл автоматаар хуваарилах боломжтой.
        </p>
      </div>
      <div className="w-full  bg-gray-100 flex justify-center items-center border border-gray-300 rounded-sm h-[60px]">
        <p className="text-sm text-gray-500">
          Артист сонгогдоогүй байна. Автоматаар хуваарилах эсвэл хүссэн артистаа
          сонгоно уу.
        </p>
      </div>

      {values.map((v, i) => {
        return (
          <div className="grid grid-cols-2 gap-4">
            {users.items.map((user, index) => {
              return (
                <ArtistCard
                  data={user}
                  onClick={(id: string) => {}}
                  selected={false}
                  key={index}
                />
              );
            })}
          </div>
        );
      })}
      <div className="space-y-2">
        <h1 className="font-medium">Захиалгын дэлгэрэнгүй</h1>
        <Textarea
          onChange={(e) => onChange("customer_desc", e.target.value)}
          minRows={5}
          placeholder="Хумс хүнд гэмтэлтэй гэх мэт..."
          className="placeholder:text-gray-100"
        />
      </div>
    </div>
  );
}
