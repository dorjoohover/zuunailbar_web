"use client";

import { Calendar } from "@heroui/calendar";
import { Button } from "@heroui/button";
import { Clock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CalendarDate, DateValue, isWeekend } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";

interface Step2Props {
  date: CalendarDate | null;
  setDate: (val: CalendarDate | null) => void;
  choiceTime: string;
  setChoiceTime: (val: string) => void;
  choiceArtist: string;
  setChoiceArtist: (val: string) => void;
  errors: Record<string, string>;
  clearError: (field: string) => void;
}

export default function Step2({ date, setDate, choiceTime, setChoiceTime, choiceArtist, setChoiceArtist, errors, clearError }: Step2Props) {
  const { locale } = useLocale();

  const now = new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());

  const disabledRanges: [CalendarDate, CalendarDate][] = [
    [now, now.add({ days: 5 })],
    [now.add({ days: 14 }), now.add({ days: 16 })],
    [now.add({ days: 23 }), now.add({ days: 24 })],
  ];

  const isDateUnavailable = (date: DateValue) => {
    if (!("year" in date && "month" in date && "day" in date)) return false;
    const d = date as CalendarDate;
    if (isWeekend(d, locale)) return true;
    return disabledRanges.some(([start, end]) => d.compare(start) >= 0 && d.compare(end) <= 0);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <p className="mb-2 font-medium">Захиалга өгөх өдөр сонгох:</p>
        <Calendar
          aria-label="Select date"
          value={date}
          onChange={(val) => {
            if (isDateUnavailable(val)) return;
            setDate(val);
            if (errors.date) clearError("date");
          }}
          isDateUnavailable={isDateUnavailable}
        />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
      </div>

      <div className="w-full">
        <p className="mb-2 font-medium">Захиалга өгөх цагийг сонгох:</p>
        <div className="flex w-full space-x-2">
          {["10:00", "12:00", "13:00"].map((c) => (
            <Button
              key={c}
              onClick={() => {
                setChoiceTime(c);
                if (errors.choiceTime) clearError("choiceTime");
              }}
              className={choiceTime === c ? "order-button-solid bg-dark text-white" : "border border-gray-400 bg-white"}
            >
              <Clock className="size-4" />
              {c}
            </Button>
          ))}
        </div>
        {errors.choiceTime && <p className="mt-1 text-sm text-red-600">{errors.choiceTime}</p>}
      </div>

      <div>
        <p className="mb-2 font-medium">Артист сонгох:</p>
        <ScrollArea className="w-full whitespace-normal">
          <div className="flex pb-4 space-x-4">
            {["Tsetsgee", "Shuree", "Erdenee", "a", "b", "d"].map((c) => (
              <Button
                key={c}
                onClick={() => {
                  setChoiceArtist(c);
                  if (errors.choiceArtist) clearError("choiceArtist");
                }}
                className={cn(choiceArtist === c ? "order-button-solid bg-dark text-white" : "border border-gray-400 bg-white", "h-24 aspect-[2/1] flex justify-start items-center p-4")}
              >
                <Image src="/artist1.png" width={100} height={100} alt="" className="overflow-hidden bg-gray-200 rounded-lg size-18" />
                {c}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {errors.choiceArtist && <p className="mt-1 text-sm text-red-600">{errors.choiceArtist}</p>}
      </div>
    </div>
  );
}
