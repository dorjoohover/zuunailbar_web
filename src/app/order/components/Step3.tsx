"use client";

import { Calendar } from "@heroui/calendar";
import { Button } from "@heroui/button";
import { Clock, Clock1 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DateValue, fromDate } from "@internationalized/date";
import { BookingSchedule, IOrder, IOrderDetail, User } from "@/models";
import { ListType, mnDate } from "@/lib/const";
import { formatTime, selectDate, usernameFormatter } from "@/lib/functions";
import { useCallback, useMemo } from "react";
import { Textarea } from "@heroui/input";
import { motion } from "motion/react";
import LoadingScreen from "./loading";
interface Step3Props {
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
  values: {
    date?: Date;
    time?: string;
    details: IOrderDetail[] | undefined;
    description: string | undefined;
  };
  // eniig hiine
  users: ListType<User>;
  limit: number;
  loading: boolean;
  times: number[] | null;
  date: Date | null;
  onChange: <K extends keyof IOrder>(key: K, value: IOrder[K]) => void;
  // clearError: (field: string) => void;
}

export default function Step3({
  // date,
  onChange,
  users,
  times,
  date,
  limit,
  loading,
  // setDate,
  // choiceTime,
  // setChoiceTime,
  // choiceArtist,
  // setChoiceArtist,
  errors,
  showError,

  values,
  // clearError,
}: Step3Props) {
  const formattedDate = date ? mnDate(date) : mnDate();
  const isDateUnavailable = (value: DateValue) => {
    const today = formattedDate;
    const currentDay = today.getDate();

    // Огнооны объект гаргаж харьцуулалт хийх
    const maxAvailableDate = mnDate();
    maxAvailableDate.setDate(maxAvailableDate.getDate() + limit - 1);

    const valueDate = new Date(value.year, value.month - 1, value.day);

    return !(valueDate < today || valueDate > maxAvailableDate);
  };
  const duration = values.details?.reduce(
    (acc, item) => acc + (item?.duration ?? 0),
    0 // reduce-ийн анхны утга
  );
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <p className="font-medium">Захиалга өгөх өдөр болон цаг сонгох</p>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-gray-500 text-xs mb-1">Өдөр сонгох</p>
            <Calendar
              aria-label="Select date"
              value={
                values.date
                  ? fromDate(values.date, "Asia/Ulaanbaatar")
                  : undefined
              }
              onChange={(val) => {
                // if (!isDateUnavailable(val)) return;
                onChange("order_date", selectDate(val));
                onChange("start_time", undefined);
                // if (errors.date) clearError("date");
              }}
              isDateUnavailable={(v) => !isDateUnavailable(v)}
              calendarWidth={"100%"}
              className="w-full border border-gray-300"
              // weekdayStyle='long'
            />
            {errors.date && showError && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>
          <div className="flex-1 ">
            <p className="text-gray-500 text-xs mb-1">Цаг сонгох</p>
            <div className="flex rounded-xl mb-2 justify-between border bg-gray-200 p-2 border border-gray-300">
              <div className="flex items-center gap-1.5 ">
                <Clock1 size={15} color="gray" />
                <p className="text-sm">Хугацаа:</p>
              </div>

              {duration ? <p className="text-sm">{duration} мин</p> : <span />}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {loading ? (
                <motion.div exit={{ opacity: 0 }} className="w-full col-span-3">
                  <LoadingScreen />
                </motion.div>
              ) : (
                times?.map((time, i) => {
                  return (
                    <button
                      className={`text-start text-sm border p-2 border-gray-300 transition-all duration-300 hover:shadow-lg  rounded-md ${values.time == `${time}` ? "bg-gray-400" : ""}`}
                      key={i}
                      onClick={() => onChange("start_time", `${time}`)}
                    >
                      {formatTime(time)}
                    </button>
                  );
                })
              )}
            </div>
            {errors.date && showError && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>
        </div>
      </div>

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
