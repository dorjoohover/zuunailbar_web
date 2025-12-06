"use client";

import { Calendar } from "@heroui/calendar";
import { Button } from "@heroui/button";
import { Clock, Clock1 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DateValue, fromDate } from "@internationalized/date";
import {
  BookingSchedule,
  DateTime,
  IOrder,
  IOrderDetail,
  User,
} from "@/models";
import { ListType, mnDate } from "@/lib/const";
import {
  formatTime,
  selectDate,
  toYMD,
  usernameFormatter,
} from "@/lib/functions";
import { useCallback, useMemo } from "react";
import { Textarea } from "@heroui/input";
import { motion } from "motion/react";
import LoadingScreen from "./loading";
import { I18nProvider } from "@react-aria/i18n";
import { OrderSlot, ParallelOrderSlot, Slot } from "@/models/slot.model";
import { isSameDay } from "date-fns";
interface Step3Props {
  errors: {
    date?: string;
    time?: string;
    user?: string;
  };
  showError: boolean;
  values: {
    date?: Date;
    time?: string;
    details: IOrderDetail[] | undefined;
    description: string | undefined;
    parallel?: boolean;
    users?: Record<string, string>;
  };
  limit: number;
  loading: boolean;
  slots: OrderSlot | ParallelOrderSlot;
  onChange: <K extends keyof IOrder>(key: K, value: IOrder[K]) => void;
}

export default function Step3({
  onChange,
  slots,
  loading,

  errors,
  showError,

  values,
}: Step3Props) {
  const [service, user] = Object.entries(values.users!)[0];
  const slot = values.parallel
    ? (slots as ParallelOrderSlot)[service][user]
    : (slots as OrderSlot)[user];
  const isDateUnavailable = (value: DateValue) => {
    const date = toYMD(new Date(value.year, value.month - 1, value.day));

    return slot.slots[date] != undefined;
  };
  const duration = values.details?.reduce(
    (acc, item) => acc + (item?.duration ?? 0),
    0 // reduce-ийн анхны утга
  );

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <p className="font-medium">Захиалга өгөх өдөр болон цаг сонгох</p>
        <div className="flex flex-col sm:flex-row  gap-4">
          <div className="flex-1">
            <p className="text-muted-foreground text-xs mb-1">Өдөр сонгох</p>
            <Calendar
              aria-label="Өдөр сонгох"
              value={
                values.date ? fromDate(values.date, "Asia/Ulaanbaatar") : null
              }
              onChange={(val) => {
                onChange("order_date", selectDate(val));
                onChange("start_time", undefined);
              }}
              defaultValue={
                values.date ? fromDate(values.date, "Asia/Ulaanbaatar") : null
              }
              errorMessage={"Буруу өдөр сонгосон."}
              isDateUnavailable={(v) => !isDateUnavailable(v)}
              calendarWidth={"100%"}
              className="w-full border border-rose-200/50"
              classNames={{
                pickerHighlight: "bg-rose-400",
              }}
            />
            {errors.date && showError && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>
          <div className="flex-1 ">
            <p className="text-muted-foreground text-xs mb-1">Цаг сонгох</p>
            <div className="flex rounded-xl mb-2 justify-between border bg-rose-100/50 p-2 border border-rose-400/50">
              <div className="flex items-center gap-1.5 ">
                <Clock1 size={15} className="text-primary" />
                <p className="text-sm ">Хугацаа:</p>
              </div>

              {duration ? <p className="text-sm">{duration} мин</p> : <span />}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {loading ? (
                <motion.div exit={{ opacity: 0 }} className="w-full col-span-3">
                  <LoadingScreen />
                </motion.div>
              ) : values.date ? (
                slot.slots[toYMD(values.date)]?.map((time, i) => {
                  if (time! + 0)
                    return (
                      <button
                        className={`text-start text-sm border p-2 transition-all duration-300 hover:shadow-sm  rounded-lg ${values.time == `${time}` ? "border-rose-400 bg-rose-200 text-primary-foreground" : "border-rose-400/50 bg-rose-100/50 hover:border-rose-600/50"}`}
                        key={i}
                        onClick={() => onChange("start_time", `${time}`)}
                      >
                        {formatTime(time)}
                      </button>
                    );
                })
              ) : (
                <div className="w-full mt-4 col-span-3">
                  <p className="text-lg text-center">Цаг олдсонгүй.</p>
                </div>
              )}
            </div>
            {errors.time && showError && (
              <p className="mt-1 text-sm text-red-600">{errors.time}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="font-medium">Захиалгын дэлгэрэнгүй</h1>
        <Textarea
          onChange={(e) => onChange("description", e.target.value)}
          minRows={5}
          placeholder="Хумс хүнд гэмтэлтэй гэх мэт..."
          className="placeholder:text-gray-100"
        />
      </div>
    </div>
  );
}
