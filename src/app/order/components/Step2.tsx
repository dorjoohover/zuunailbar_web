"use client";

import { Calendar } from "@heroui/calendar";
import { Button } from "@heroui/button";
import { ArrowRight, Clock, User2, XIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DateValue, fromDate } from "@internationalized/date";
import {
  BookingSchedule,
  IOrder,
  IOrderDetail,
  IUserService,
  User,
  UserService,
} from "@/models";
import { ListType } from "@/lib/const";
import {
  firstLetterUpper,
  formatTime,
  money,
  selectDate,
  usernameFormatter,
} from "@/lib/functions";
import { useCallback, useMemo } from "react";
import { Textarea } from "@heroui/input";
import { ArtistCard } from "@/components/card";

interface Step2Props {
  showError: boolean;
  values: {
    details: IOrderDetail[];
    users: Record<string, string>;
  };
  userServices: IUserService[];
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
      {Object.keys(values.users).length === 0 ? (
        <div className="w-full  bg-gray-100 flex justify-center items-center border border-gray-300 rounded-sm h-[60px]">
          <p className="text-sm text-gray-500">
            Артист сонгогдоогүй байна. Автоматаар хуваарилах эсвэл хүссэн
            артистаа сонгоно уу.
          </p>
        </div>
      ) : (
        <div className="flex justify-between">
          <p className="text-sm text-gray-500">
            Бүх үйлчилгээнд нэг артист сонгогдсон
          </p>
          <Button
            onClick={() => onChange("users", {})}
            startContent={<XIcon size={14} />}
            color="primary"
            size="sm"
            variant="light"
          >
            Цэвэрлэх
          </Button>
        </div>
      )}

      {values.details.some((v) => v.duplicated)
        ? values.details
            .filter((v) => v.duplicated)
            .map((v, i) => {
              const key = v.service_id ?? "";
              const selectedUser =
                users.items.filter(
                  (user) => user.id == values.users[key]
                )?.[0] ?? null;
              return (
                <div className="flex w-full gap-3" key={i}>
                  <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200">
                    <span>{i + 1}</span>
                  </div>
                  <div className="w-full">
                    <div className="flex w-full mb-2 justify-between items-center">
                      <div>
                        <p className="text-sm">{v.service_name}</p>
                        <p className="text-xs text-gray-300">
                          {v.duration && `${v.duration} мин • `}
                          {money(
                            (v?.min_price ?? 0).toString(),
                            "",
                            1,
                            v.max_price ? 2 : undefined
                          )}
                          {v.max_price &&
                            ` - ${money(v.max_price.toString(), "", 1, 2)}`}
                        </p>
                      </div>
                      {selectedUser && (
                        <div className="flex gap-3 items-center">
                          <span>
                            <ArrowRight size={14} />
                          </span>
                          <span className="bg-gray-100 px-3 py-1 flex gap-2 items-center rounded-xl">
                            <User2 size={14} color="gray" />
                            {firstLetterUpper(selectedUser.nickname ?? "")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {userServices
                        .filter((u) => u.service_id == v.service_id)
                        .map((user, index) => {
                          const selected =
                            values.users[key] == user.user.id &&
                            key == v.service_id;
                          const disabled = Object.entries(values.users).some(
                            ([k, v]) => k != key && v == user.user.id
                          );
                          return (
                            <ArtistCard
                              mini={true}
                              data={user.user!}
                              onClick={(id: string) => {
                                if (!selected && !disabled) {
                                  onChange("users", {
                                    ...values.users,
                                    [key]: id,
                                  });
                                }
                              }}
                              selected={selected}
                              disabled={disabled}
                              key={index}
                            />
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })
        : [""].map((v, i) => {
            return (
              <div className="grid grid-cols-2 gap-4">
                {users.items.map((user, index) => {
                  const key = "0";
                  const selected = values.users[key] == user.id;
                  return (
                    <ArtistCard
                      data={user}
                      onClick={(id: string) => {
                        if (!selected) {
                          onChange("users", { ...values.users, [key]: id });
                        }
                      }}
                      selected={selected}
                      key={index}
                    />
                  );
                })}
              </div>
            );
          })}
    </div>
  );
}
