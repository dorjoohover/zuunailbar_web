"use client";
import { Calendar } from "@heroui/calendar";
import { Clock1 } from "lucide-react";
import { DateValue, fromDate } from "@internationalized/date";
import { IOrder, IOrderDetail } from "@/models";
import { formatTime, selectDate, toYMD } from "@/lib/functions";
import { Textarea } from "@heroui/input";
import { motion } from "motion/react";
import LoadingScreen from "./loading";
import { isSameDay } from "date-fns";
interface Step2Props {
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
    // users?: Record<string, string>;
  };
  limit: number;
  loading: boolean;
  slots: Record<string, number[]>;
  onChange: <K extends keyof IOrder>(key: K, value: IOrder[K]) => void;
}

export default function Step2({
  onChange,
  slots,
  loading,

  errors,
  showError,

  values,
}: Step2Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateUnavailable = (value: DateValue) => {
    const date = new Date(value.year, value.month - 1, value.day);

    if (
      value.year == today.getFullYear() &&
      value.month == today.getMonth() + 1 &&
      value.day < today.getDate()
    )
      return false;

    // slot байгаа бол unavailable
    return slots[toYMD(date)] !== undefined;
  };
  const duration = values.parallel
    ? Math.max(...(values.details?.map((item) => item?.duration ?? 0) ?? [0]))
    : values.details?.reduce((acc, item) => acc + (item?.duration ?? 0), 0);
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
              className="
    w-full border border-rose-200/50
    [&_[data-selected=true]:not([aria-disabled=true])]:bg-rose-500/90
    [&_[data-selected=true]:not([aria-disabled=true])]:text-white
    [&_[data-hover=true]:not([aria-disabled=true])]:bg-rose-100
    [&_[data-hover=true]:not([aria-disabled=true])]:text-rose-500/90

    /* disabled дээр effect унтраах */
    [&_[aria-disabled=true]]:bg-transparent
    [&_[aria-disabled=true]]:text-muted-foreground
        [&_[data-today=true]:not([data-selected=true]):not([aria-disabled=true])]:ring-1
    [&_[data-today=true]:not([data-selected=true]):not([aria-disabled=true])]:ring-rose-400
    [&_[data-today=true]:not([data-selected=true]):not([aria-disabled=true])]:text-rose-700
  "
              classNames={{
                content: "bg-rose-50",
                title: "text-black",
                gridHeaderRow: "text-black",
                nextButton: "text-black",
                prevButton: "text-black",
                cellButton: "rounded-sm",
              }}
            />

            {errors.date && showError && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>
          <div className="flex-1 ">
            <p className="text-muted-foreground text-xs mb-1">Цаг сонгох</p>
            <div className="flex rounded-xl mb-2 justify-between border text-rose-500 shadow-lg shadow-rose-50 p-2 border border-rose-400/50">
              <div className="flex items-center gap-1.5 text-rose-500">
                <Clock1 size={15} className="text-rose-500" />
                <p className="text-sm ">Хугацаа:</p>
              </div>

              {duration ? <p className="text-sm">{duration} мин</p> : <span />}
            </div>
            <p className="text-muted-foreground text-xs mb-1">
              Боломжит цагууд
            </p>
            <div className="grid grid-cols-3 gap-2">
              {loading ? (
                <motion.div exit={{ opacity: 0 }} className="w-full col-span-3">
                  <LoadingScreen />
                </motion.div>
              ) : values.date ? (
                slots[toYMD(values.date)]?.map((time, i) => {
                  const selectedDate = new Date(
                    values.date as unknown as string
                  );
                  const now = new Date();

                  const isToday = isSameDay(selectedDate, now);
                  const isPastTime = isToday && now.getHours() >= Number(time);

                  if (isPastTime) return null;

                  const isSelected = values.time === String(time);

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onChange("start_time", String(time))}
                      className={`text-center shadow-sm shadow-rose-500/10 text-sm border p-2 transition-all duration-300 hover:shadow-sm rounded-lg
      ${
        isSelected
          ? "border-none bg-rose-500/90 text-primary-foreground"
          : "border-rose-400/50 bg-rose-50 text-rose-800 hover:border-rose-600/50"
      }
    `}
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
