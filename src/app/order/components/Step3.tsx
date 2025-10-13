"use client";

import { Calendar } from "@heroui/calendar";
import { Button } from "@heroui/button";
import { Clock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DateValue, fromDate } from "@internationalized/date";
import { BookingSchedule, IOrder, User } from "@/models";
import { ListType } from "@/lib/const";
import { formatTime, selectDate, usernameFormatter } from "@/lib/functions";
import { useCallback, useMemo } from "react";
import { Textarea } from "@heroui/input";

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
  values: { date?: Date; time?: string; user?: string };

  // eniig hiine
  users: ListType<User>;
  booking: BookingSchedule;
  onChange: <K extends keyof IOrder>(key: K, value: IOrder[K]) => void;
  // clearError: (field: string) => void;
}

export default function Step3({
  // date,
  onChange,
  users,
  booking,
  // setDate,
  // choiceTime,
  // setChoiceTime,
  // choiceArtist,
  // setChoiceArtist,
  errors,
  showError,

  values,
  // clearError,
}: Step2Props) {
  const isSameDayTZ = (a: Date, b: Date, tz = "Asia/Ulaanbaatar") => {
    const ymd = (d: Date) => {
      const p = new Intl.DateTimeFormat("en-CA", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(d);
      const pick = (t: string) =>
        String(p.find((x) => x.type === t)?.value).padStart(2, "0");
      return `${p.find((x) => x.type === "year")?.value}-${pick("month")}-${pick("day")}`;
    };
    return ymd(a) === ymd(b);
  };
  const overlapInfo = useMemo(() => {
    if (!values.date || !booking?.overlap)
      return { hours: [] as number[], userIds: [] as string[] };

    const d = values.date as Date;
    const hourSeen: Record<number, 1> = {};
    const userIds: string[] = [];

    // booking.overlap: Record<string, { date: Date | string; times: number[] }[]>
    for (const [userId, entries] of Object.entries(booking.overlap)) {
      let touched = false;

      for (const e of entries ?? []) {
        const od = e.date instanceof Date ? e.date : new Date(e.date);
        if (!isSameDayTZ(od, d)) continue;

        // times нь number[] гэж интерфэйстээ заасан тул шууд явуулна
        for (const n of e.times ?? []) {
          if (Number.isFinite(n)) hourSeen[n] = 1;
        }
        touched = true;
      }

      // Тухайн өдөрт дор хаяж 1 давхцсан цагтай бол л нэмнэ
      if (touched) userIds.push(userId);
    }

    const hours = Object.keys(hourSeen)
      .map(Number)
      .sort((a, b) => a - b);
    return { hours, userIds };
  }, [booking?.overlap, values.date]);
  const ymdUB = (d: Date | string) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Ulaanbaatar",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d instanceof Date ? d : new Date(d));
  const ymdFromDV = (dv: { year: number; month: number; day: number }) =>
    `${dv.year}-${String(dv.month).padStart(2, "0")}-${String(dv.day).padStart(2, "0")}`;

  const unavailableDays = useMemo(() => {
    const days: Record<string, 1> = {};
    if (!booking?.overlap) return days;

    for (const entries of Object.values(booking.overlap)) {
      for (const e of entries ?? []) {
        console.log(e.times, e.date);
        console.log(ymdUB(e.date));
        if (!e?.date || !Array.isArray(e.times) || e.times.length === 0)
          continue;
        days[ymdUB(e.date)] = 1;
      }
    }
    return days;
  }, [booking?.overlap]);
  const isDateUnavailable = useCallback(
    (dv: DateValue) => {
      return !!unavailableDays[ymdFromDV(dv)];
    },
    [unavailableDays]
  );
  const overlap = overlapInfo.hours;
  const suitableUsers = useMemo(() => {
    const list = users?.items ?? [];
    const overlap = booking?.overlap;

    if (!list.length) return [];
    if (!overlap) return list; // overlap байхгүй бол бүх хэрэглэгч

    const hasDate = !!values?.date;
    const hasTime =
      values?.time !== undefined &&
      values?.time !== null &&
      values?.time !== "";
    const timeNum = hasTime ? Number(values.time) : NaN;

    // day-ийг UB-аар нормчлох
    const ymdUB = (d: Date | string) =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Ulaanbaatar",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d instanceof Date ? d : new Date(d));

    // date/time аль нь ч байхгүй → бүх хэрэглэгч
    if (!hasDate && !hasTime) return list;

    // сонгосон өдөр (UB)
    const selDay = hasDate ? ymdUB(values.date as Date) : null;

    return list.filter((u: any) => {
      if (!u?.id) return false;
      const entries = overlap[u.id] ?? []; // [{ date, times }]

      for (let i = 0; i < entries.length; i++) {
        const e = entries[i];
        if (!e) continue;

        // date шалгалт
        if (hasDate && ymdUB(e.date) !== selDay) continue;

        // time шалгалт
        if (hasTime) {
          const arr = Array.isArray(e.times) ? e.times : [];
          const ok = arr.some((t: any) => Number(t) === timeNum);
          if (!ok) continue;
        }

        // бүх нөхцөл тэнцлээ
        return true;
      }

      return false;
    });
  }, [users?.items, booking?.overlap, values?.date, values?.time]);
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <p className="font-medium">Захиалга өгөх өдөр сонгох:</p>
        <Calendar
          aria-label="Select date"
          value={
            values.date ? fromDate(values.date, "Asia/Ulaanbaatar") : undefined
          }
          onChange={(val) => {
            if (!isDateUnavailable(val)) return;

            onChange("order_date", selectDate(val));
            onChange("start_time", undefined);
            // if (errors.date) clearError("date");
          }}
          isDateUnavailable={(v) => !isDateUnavailable(v)}
          calendarWidth={"100%"}
          className="w-full"
          // weekdayStyle='long'
        />
        {errors.date && showError && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
        )}
      </div>

      <div className="w-full space-y-2">
        <p className="font-medium">Захиалга өгөх цагийг сонгох:</p>
        <div className="flex w-full space-x-2">
          {overlap.map((c) => (
            <Button
              key={c}
              className={
                values.time === c.toString()
                  ? "order-button-solid bg-dark text-white"
                  : "border border-gray-400 bg-white"
              }
              onPress={() => {
                onChange("start_time", c.toString());
              }}
            >
              <Clock className="size-4" />
              {formatTime(c)}
            </Button>
          ))}
        </div>
        {errors.time && showError && (
          <p className="mt-1 text-sm text-red-600">{errors.time}</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="font-medium">Артист сонгох:</p>
        <ScrollArea className="w-full whitespace-normal">
          <div className="flex pb-4 space-x-4">
            {suitableUsers.map((user) => {
              const isSelected = values.user === user.id;

              return (
                <Button
                  variant="solid"
                  key={user.id}
                  onPress={() => onChange("user_id", user.id)}
                  className={cn(
                    isSelected
                      ? "bg-neutral-300"
                      : " border-neutral-200 bg-gray-100",
                    "h-20 aspect-[7/3] flex justify-start items-center p-2 gap-4"
                  )}
                >
                  <Image
                    src={
                      user.profile_img
                        ? `/api/file/${user.profile_img}`
                        : "/images/logo-black.png"
                    }
                    width={100}
                    height={100}
                    alt={usernameFormatter(user)}
                    className="object-cover overflow-hidden bg-gray-200 rounded-lg size-17 aspect-square"
                  />
                  <div className="text-left">
                    <h1 className="">Artist:</h1>
                    <span className="font-semibold truncate">
                      {usernameFormatter(user)}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {errors.user && showError && (
          <p className="mt-1 text-sm text-red-600">{errors.user}</p>
        )}
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
