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
import { formatTime, selectDate, usernameFormatter } from "@/lib/functions";
import { useCallback, useMemo } from "react";
import { Textarea } from "@heroui/input";
import { motion } from "motion/react";
import LoadingScreen from "./loading";
import { I18nProvider } from "@react-aria/i18n";
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
  slots: DateTime;
  onChange: <K extends keyof IOrder>(key: K, value: IOrder[K]) => void;
  // clearError: (field: string) => void;
}

export default function Step3({
  // date,
  onChange,
  users,
  slots,
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
  const date = mnDate();
  const today = mnDate(date);
  date.setDate(date.getDate() + limit);
  const days = Object.keys(slots).map(Number);
  console.log(slots, values);
  let selectedDay = values.date ? mnDate(values.date).getDay() - 1 : undefined;
  if (selectedDay && selectedDay == -1) selectedDay = 6;
  const times = selectedDay != undefined ? slots[selectedDay] : null;
  const isDateUnavailable = (value: DateValue) => {
    const current = mnDate(new Date(value.year, value.month - 1, value.day));
    let day = current.getDay() - 1;
    if (day == -1) day = 6;
    if (current < today || current > date) return false;
    if (!days.includes(day)) return false;
    if (slots[day]?.length == 0) return false;
    if (slots[day]?.[0] == 0 && slots[day]?.length == 1) return false;
    return true;
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
              color="primary"
              aria-label="Өдөр сонгох"
              value={
                values.date ? fromDate(values.date, "Asia/Ulaanbaatar") : null
              }
              onChange={(val) => {
                // if (!isDateUnavailable(val)) return;
                onChange("order_date", selectDate(val));
                onChange("start_time", undefined);
                // if (errors.date) clearError("date");
              }}
              defaultValue={
                values.date ? fromDate(values.date, "Asia/Ulaanbaatar") : null
              }
              errorMessage={"Буруу өдөр сонгосон."}
              isDateUnavailable={(v) => !isDateUnavailable(v)}
              calendarWidth={"100%"}
              className="w-full border border-primary"
              // weekdayStyle='long'
            />
            {errors.date && showError && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>
          <div className="flex-1 ">
            <p className="text-muted-foreground text-xs mb-1">Цаг сонгох</p>
            <div className="flex rounded-xl mb-2 justify-between border bg-accent/50 p-2 border border-primary">
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
              ) : times && times.length > 0 ? (
                times?.map((time, i) => {
                  if (time! + 0)
                    return (
                      <button
                        className={`text-start text-sm border p-2 transition-all duration-300 hover:shadow-sm  rounded-lg ${values.time == `${time}` ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50"}`}
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
