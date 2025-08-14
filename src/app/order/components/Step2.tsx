"use client";

import { Calendar } from "@heroui/calendar";
import { Button } from "@heroui/button";
import { Clock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  CalendarDate,
  DateValue,
  fromDate,
  getLocalTimeZone,
  isWeekend,
} from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import {
  Booking,
  IBooking,
  IOrder,
  IUserService,
  User,
  UserService,
} from "@/models";
import { dateValueToDate, ListType, mnDate } from "@/lib/const";
import { formatTime, selectDate, usernameFormatter } from "@/lib/functions";
import { useEffect, useMemo, useState } from "react";

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
  users: User[];
  booking: ListType<IBooking>;
  onChange: <K extends keyof IOrder>(key: K, value: IOrder[K]) => void;
  // clearError: (field: string) => void;
}

export default function Step2({
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
  const isDateUnavailable = (date: DateValue) => {
    return booking.items.some((b) => {
      const bd = new Date(b.date);

      return (
        bd.getFullYear() === date.year &&
        bd.getMonth() + 1 === date.month &&
        bd.getUTCDate() === date.day
      );
    });
  };
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
    if (!values.date || !booking?.items?.length)
      return { hours: [], userIds: [] as string[] };

    const d = values.date as Date;
    const hourSeen: Record<number, 1> = {};
    const userSeen: Record<string, 1> = {};

    (booking.items as any[]).forEach((b) => {
      (b?.overlap ?? []).forEach((o: any) => {
        if (!o?.times) return;

        const od = new Date(b.date.substring(0, 10));
        if (!isSameDayTZ(od, d)) return;

        const parts = Array.isArray(o.times)
          ? o.times
          : String(o.times).split("|");
        for (let i = 0; i < parts.length; i++) {
          const n = Number(String(parts[i]).trim());
          if (Number.isFinite(n)) hourSeen[n] = 1;
        }
        if (o.user_id) userSeen[o.user_id] = 1;
      });
    });

    const hours = Object.keys(hourSeen)
      .map(Number)
      .sort((a, b) => a - b);
    const userIds = Object.keys(userSeen);
    return { hours, userIds };
  }, [booking?.items, values.date]);
  const overlap = overlapInfo.hours;
  const suitableUsers = useMemo(() => {
    if (!users?.length) return [];
    // объект lookup ашиглаж, ES5-д найдвартай байлгая
    const pick: Record<string, 1> = {};
    for (let i = 0; i < overlapInfo.userIds.length; i++) {
      pick[overlapInfo.userIds[i]] = 1;
    }
    return users.filter((u: any) => !!u?.id && pick[u.id] === 1);
  }, [users, overlapInfo.userIds]);
  return (
    <div className="w-full space-y-6">
      <div>
        <p className="mb-2 font-medium">Захиалга өгөх өдөр сонгох:</p>

        <Calendar
          aria-label="Select date"
          value={
            values.date ? fromDate(values.date, "Asia/Ulaanbaatar") : undefined
          }
          onChange={(val) => {
            if (!isDateUnavailable(val)) return;

            onChange("order_date", selectDate(val));
            // if (errors.date) clearError("date");
          }}
          isDateUnavailable={(v) => !isDateUnavailable(v)}
        />
        {errors.date && showError && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
        )}
      </div>

      <div className="w-full">
        <p className="mb-2 font-medium">Захиалга өгөх цагийг сонгох:</p>
        <div className="flex w-full space-x-2">
          {overlap.map((c) => (
            <Button
              key={c}
              className={
                values.time === c.toString()
                  ? "order-button-solid bg-dark text-white"
                  : "border border-gray-400 bg-white"
              }
              onClick={() => {
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

      <div>
        <p className="mb-2 font-medium">Артист сонгох:</p>
        <ScrollArea className="w-full whitespace-normal">
          <div className="flex pb-4 space-x-4">
            {suitableUsers.map((user) => {
              const isSelected = values.user === user.id;

              return (
                <Button
                  key={user.id}
                  onClick={() => onChange("user_id", user.id)}
                  className={cn(
                    isSelected
                      ? "order-button-solid bg-dark text-white"
                      : "border border-gray-400 bg-white",
                    "h-24 aspect-[2/1] flex justify-start items-center p-4 gap-4"
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
                    className="overflow-hidden bg-gray-200 rounded-lg size-18"
                  />
                  <span className="truncate">{usernameFormatter(user)}</span>
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
    </div>
  );
}
