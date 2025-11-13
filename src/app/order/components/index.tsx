"use client";
import { useState, useEffect, useMemo } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";
import { ListDefault, ListType, mnDate } from "@/lib/const";
import {
  Branch,
  BranchService,
  DateTime,
  IOrder,
  IOrderDetail,
  IUserService,
  Service,
  User,
  UserDateTime,
} from "@/models";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { Form } from "@heroui/form";
import { create, find } from "@/app/(api)";
import { Api } from "@/utils/api";

import { CircularProgress, Progress } from "@heroui/progress";
import { addToast } from "@heroui/toast";
import { orderSteps } from "@/lib/constants";
import Step4 from "./Step4";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { PaymentView } from "./payment";
import { Invoice } from "@/types";
import { formatTime, money, parseDate } from "@/lib/functions";

function getMergedSlots(slotsArray: DateTime[]): DateTime {
  if (slotsArray == undefined || slotsArray?.length === 0) return {};

  const merged: DateTime = {};

  for (const slots of slotsArray) {
    for (const [dayStr, times] of Object.entries(slots)) {
      const day = Number(dayStr);
      if (!merged[day]) merged[day] = [];

      // unique болгож нэмж байна
      for (const t of times) {
        if (!merged[day].includes(t)) {
          merged[day].push(t);
        }
      }

      // хүсвэл цагуудыг эрэмбэлж болно
      merged[day].sort((a, b) => a - b);
    }
  }

  return merged;
}

export function getCommonSlots(
  slotsArray: DateTime[],
  artists: number
): DateTime {
  if (slotsArray.length === 0) return {};

  // 1 artist байвал давхцах шаардлагагүй — бүгдийг нэгтгээд буцаана
  if (artists === 1) {
    const merged: Record<number, Set<number>> = {};
    for (const slots of slotsArray) {
      for (const [dayStr, times] of Object.entries(slots)) {
        const day = Number(dayStr);
        if (!merged[day]) merged[day] = new Set();
        times.forEach((t: number) => merged[day].add(t));
      }
    }

    const result: DateTime = {};
    for (const [day, timeSet] of Object.entries(merged)) {
      result[Number(day)] = Array.from(timeSet).sort((a, b) => a - b);
    }
    return result;
  }

  // artists >= 2 → дор хаяж 2 artist-д давхцсан цагуудыг гаргана
  const slotCount: Record<number, Record<number, number>> = {};

  for (const slots of slotsArray) {
    for (const [dayStr, times] of Object.entries(slots)) {
      const day = Number(dayStr);

      if (!slotCount[day]) slotCount[day] = {};

      for (const t of times) {
        const value = (slotCount[day][t] ?? 0) + 1;
        if (value != 0) slotCount[day][t] = value;
      }
    }
  }

  const common: DateTime = {};
  for (const [dayStr, timesMap] of Object.entries(slotCount)) {
    const day = Number(dayStr);
    const availableTimes = Object.entries(timesMap)
      .filter(([_, count]) => count > 2)
      .map(([t]) => Number(t));

    if (availableTimes.length > 0) {
      common[day] = availableTimes.sort((a, b) => a - b);
    }
  }
  return common;
}

export default function OrderPage({
  data,
  branches,
  token,
  users,
  branch_services,
}: {
  token?: string;
  data: ListType<Service>;
  branches: ListType<Branch>;
  branch_services: ListType<BranchService>;
  users: ListType<User>;
}) {
  // selected бүх мэдээллээ энд төвлөрүүлнэ
  const [selected, setSelected] = useState<IOrder>({
    details: [],
    parallel: false,
  });

  const [limit, setLimit] = useState(7);
  const [showError, setShowError] = useState(false);
  function setField<K extends keyof IOrder>(key: K, value: IOrder[K]) {
    setSelected((prev) => ({ ...prev, [key]: value }));
  }

  const [userDatetimes, setUserDateTimes] = useState<UserDateTime[]>([]);

  const step1Errors = useMemo(
    () => ({
      branch: selected.branch_id ? undefined : "Салбараа сонгоно уу!",
      service: (selected.details as IOrderDetail[])?.some(
        (d) => d?.service_id != undefined
      )
        ? undefined
        : "Үйлчилгээгээ сонгоно уу!",
    }),
    [selected.branch_id, selected.details as IOrderDetail[]]
  );

  const step3Errors = useMemo(
    () => ({
      date: selected.order_date ? undefined : "Захиалгын өдрөө сонгоно уу!",
      time: selected.start_time ? undefined : "Захиалгын цагаа сонгоно уу!",
    }),
    [selected.order_date, selected.start_time]
  );
  const total = 4;
  const [step, setStep] = useState(1);
  const go = async (n: number) => {
    if (n == 4 && !order) {
      const result = await onSubmit();
      if (!result) return;
    }
    setStep(Math.min(Math.max(1, n), total));
  };

  const next = () => go(step + 1);
  const prev = () => go(step - 1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const activeErrors =
    step === 1
      ? step1Errors
      : step === 3
        ? step3Errors
        : ({} as Record<string, string | undefined>);
  const isStepComplete = useMemo(
    () => Object.values(activeErrors).every((v) => !v),
    [activeErrors]
  );

  const handleNext = () => {
    if (!isStepComplete) {
      setShowError(true);
      return;
    }
    setShowError(false);
    next();
  };
  const fetcher = async () => {
    if (step == 1) setField("users", undefined);
    if (step == 2) {
      await getAvailableArtists();
      setField("order_date", undefined);
      setField("start_time", undefined);
    }
  };

  const getAvailableArtists = async () => {
    await create(
      Api.order,
      {
        services:
          (selected.details as IOrderDetail[])?.map((d) => d.service_id) ?? [],
        branch_id: selected.branch_id,
        parallel: selected.parallel,
      },
      "artists"
    ).then((d) => {
      console.log(d);
      if (d.success) {
        setUserDateTimes(d.data.payload.items);
        setLimit(d.data.payload.limit ?? 7);
      }
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetcher();
  }, [step]);

  const reset = () => {
    setSelected({ details: [] });
    setUserDateTimes([]);
    setLimit(7);
    go(1);
  };

  const formatDetails = () => {
    const details: IOrderDetail[] = [];
    let day = mnDate(selected.order_date)?.getDay() - 1;
    if (day === -1) day = 6;

    const startHour = +(selected?.start_time?.slice(0, 2) ?? "");

    selected.details?.forEach((d, i) => {
      const service = d.service_id;
      let user_id = d.user_id;

      // аль хэдийн user_id байгаа бол тэрийг хадгална
      if (user_id) {
        details.push({ ...d, user_id });
        return;
      }

      // parallel тохиолдолд 2 artist байх боломжтой
      if (selected.parallel) {
        const selectedUser = selected.users?.[service];
        if (selectedUser) {
          details.push({ ...d, user_id: selectedUser });
          return;
        }

        // тухайн цагт хийж чадах artist-ууд
        const availableArtists = userDatetimes.filter((u) => {
          const canDoService = u.service_id === service;
          const hasSlot = u.slots?.[day]?.includes(startHour);
          if (!canDoService || !hasSlot) return false;

          // 2 дахь service-ийн artist өмнөхтэй давхцахгүй байх ёстой
          if (i === 1 && details.length > 0) {
            return u.user?.id !== details[0].user_id;
          }
          return true;
        });

        if (availableArtists.length > 0) {
          const index = Math.floor(Math.random() * availableArtists.length);
          details.push({
            ...d,
            user_id: availableArtists[index].user?.id,
          });
        }

        return;
      }

      // parallel биш — 1 artist
      const availableTimes = userDatetimes.filter(
        (u) => u.service_id === service && u.slots?.[day]?.includes(startHour)
      );
      console.log(selected);
      const selectedUser = selected.users?.[service] ?? selected.users?.[0];
      console.log(selectedUser);
      if (selectedUser && selectedUser !== "0" && selectedUser !== "") {
        user_id = selectedUser;
      } else if (availableTimes.length > 0) {
        const index = Math.floor(Math.random() * availableTimes.length);
        user_id = availableTimes?.[index].user?.id;
      }

      details.push({ ...d, user_id });
    });

    return details;
  };

  const availableTimes = (): DateTime => {
    const artists = Object.values(selected.users ?? {}).length;
    if (selected.parallel && artists > 1) {
      const slots = getCommonSlots(
        userDatetimes
          .filter((u) =>
            Object.values(selected.users ?? {}).includes(u.user?.id ?? "")
          )
          .map((u) => u.slots),
        1
      );
      return slots;
    }

    const selectedServiceIds = selected.details?.map((d) => d.service_id) ?? [];

    const slotsArray =
      artists > 0
        ? userDatetimes
            .filter((u) =>
              Object.values(selected.users ?? {}).includes(u.user?.id ?? "")
            )
            .map((u) => u.slots)
        : userDatetimes
            .filter((u) =>
              u.services.every((s) => selectedServiceIds.includes(s))
            )
            .map((u) => u.slots);

    const slots = selected.parallel
      ? getCommonSlots(slotsArray, artists > 0 ? 1 : 2)
      : getMergedSlots(slotsArray);
    return slots;
  };
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [checked, setChecked] = useState(false);
  const [order, setOrder] = useState<string | null>(null);
  const onSubmit = async () => {
    const st = selected.start_time?.slice(0, 2);
    const payload = {
      branch_id: selected.branch_id,
      details: formatDetails(),
      order_date: selected.order_date,
      start_time: st,
      description: selected.description,

      parallel: selected.parallel,
    };
    const res = await create<IOrder>(Api.order, payload);
    if (!res.success) {
      addToast({
        title: res.error ?? "Алдаа гарлаа дахин оролдоно уу",
        color: "danger",
      });
      return;
    }
    if (res.data?.payload?.invoice) {
      setInvoice(res.data.payload.invoice);
      setOrder(res.data.payload.id);
    } else {
      addToast({ title: "Амжилттай.", color: "success" });
      // reset();
    }
    return res.success;
  };
  if (invoice != null && order != null && step == 5)
    return (
      <div>
        <PaymentView invoice={invoice} id={order} />
      </div>
    );
  const stepValue = (index: number) => {
    const selected_services = selected.details;
    if (index == 0) {
      if (!selected_services) return undefined;
      let value =
        selected_services?.length > 1
          ? "2 Үйлчилгээ"
          : selected_services?.length > 0
            ? selected_services?.[0]?.service_name
            : undefined;
      return value;
    }
    if (index == 1) {
      const selected_users = selected.users
        ? Object.values(selected.users).filter((a) => a != undefined)
        : [];

      if (selected_users.length === 0) {
        return selected_services && selected_services?.length > 0
          ? "Артистыг автоматаар оноох"
          : undefined;
      }
      const matchedUsers = users.items.filter((u) =>
        selected_users.includes(u.id)
      );

      const uniqueUserIds = Array.from(new Set(matchedUsers.map((u) => u.id)));

      if (uniqueUserIds.length > 1) {
        return "2 Артист";
      }

      return matchedUsers[0]?.nickname;
    }
    if (index == 2) {
      const date = selected.order_date;
      const time = selected.start_time;
      if (!date || !time) return undefined;
      return `${parseDate(date, false)} ${formatTime(time)}`;
    }
    return undefined;
  };

  return (
    <div className="relative py-10">
      <div className="flex flex-col justify-center max-w-3xl p-6 py-12 md:py-18 xl:py-24 mx-auto space-y-6 ">
        {/* Step indicator */}
        <div className="hidden sm:block">
          <Progress
            aria-label="Loading..."
            className="w-full pb-3 px-2"
            size="sm"
            value={(step / 4) * 100}
          />
          <div className="relative flex justify-between w-full mt-2">
            {/* <div className="absolute top-[50%] -translate-y-[50%]  left-[50%] -translate-x-[50%] w-3/4 border-[0.5px] border-gray-400 h-[1px] border-dashed"></div> */}
            {orderSteps.map((s, i) => {
              const value = stepValue(i);
              const current = i == step - 1;
              return (
                <div key={i} className="flex flex-col">
                  <div
                    className={`space-x-2 z-10 flex flex-col cursor-pointer relative px-2 bg-white flex-center `}
                    onClick={() => {
                      // if (canJump(s)) go(s);
                    }}
                  >
                    <span
                      className={`font-bolder pb-1 mb-1 text-sm ${current ? "text-primary" : ""} ${!value && current ? "border-b-2 border-primary" : ""}`}
                    >
                      {s.name}
                    </span>
                    <span
                      className={`pb-1 text-xs  ${current ? "text-primary border-b  border-primary" : ""} font-light`}
                    >
                      {value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="block sm:hidden mb-4">
          <div className="flex items-center gap-4 px-2">
            <CircularProgress
              showValueLabel={true}
              classNames={{
                svg: "w-20 h-20 drop-shadow-md",
                indicator: "stroke-black",
                track: "stroke-black/10",
                value: "text-xl font-semibold text-black",
              }}
              value={(step / 4) * 100}
            />
            <div>
              <p className="font-bold text-medium">Алхам {step}</p>
              <p>{orderSteps[step - 1].name}</p>
            </div>
          </div>
        </div>
        <Form
          className="flex flex-col justify-center w-full gap-4 px-2"
          onReset={() => setSelected({ details: [] })}
          onSubmit={(e) => {
            e.preventDefault();
            let data = Object.fromEntries(new FormData(e.currentTarget));

            // setSelected(data)
          }}
        >
          {step === 1 && (
            <Step1
              branch_services={branch_services}
              values={{
                branch: selected.branch_id,
                services:
                  (selected.details as IOrderDetail[])?.map(
                    (d) => d.service_id
                  ) ?? [],
              }}
              showError={showError}
              branches={branches}
              services={data}
              onChange={setField}
              errors={step1Errors}
            />
          )}

          {/* Step Components */}

          {step === 2 && (
            <Step2
              showError={showError}
              values={{
                details: selected.details ?? [],
                users: selected.users ?? {},
                parallel: selected.parallel ?? false,
              }}
              users={users}
              onChange={setField}
              userDateTimes={userDatetimes}
            />
          )}

          {step === 3 && (
            <Step3
              values={{
                date: selected.order_date,
                time: selected.start_time,
                details: selected.details ?? [],
                description: selected.description,
              }}
              loading={false}
              slots={availableTimes()}
              limit={limit}
              errors={step3Errors}
              onChange={setField}
              showError={showError}
              users={users}
            />
          )}
          {step === 4 && (
            <Step4
              values={selected}
              branches={branches}
              services={data}
              users={users}
            />
          )}

          {/* Navigation buttons */}
          <div className="flex w-full justify-between mt-6 px-2">
            <Button
              onPress={prev}
              disabled={step === 1}
              variant="bordered"
              className="h-12 w-28"
            >
              Буцах
            </Button>
            {step < total ? (
              <Button
                className={cn(
                  isStepComplete ? "" : "",
                  "h-12 text-white border shadow-xl w-28 border-white/5 rounded-xl aspect-square flex-center",
                  "bg-dark bg-no-repeat bg-cover bg-[url(/bg/banner-gradient.png)]"
                )}
                onPress={handleNext}
              >
                Дараах
              </Button>
            ) : (
              <Button
                onPress={() => onOpen()}
                className={cn(
                  isStepComplete ? "" : "",
                  "h-12 text-white border shadow-xl w-28 border-white/5 rounded-xl aspect-square flex-center",
                  "bg-gray-500 bg-no-repeat bg-cover bg-[url(/bg/banner-gradient.png)]"
                )}
              >
                Илгээх
              </Button>
            )}
          </div>
        </Form>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Та захиалгаа баталгаажуулахдаа итгэлтэй байна уу?
              </ModalHeader>

              <ModalBody className="space-y-3">
                {invoice?.price && (
                  <p className="text-sm text-muted-foreground">
                    Та захиалгаа баталгаажуулахын тулд{" "}
                    <span className="font-semibold text-primary">
                      {money(invoice.price)}₮
                    </span>{" "}
                    урьдчилгаа төлбөр төлөх шаардлагатай. Энэ төлбөр буцаан
                    олгогдохгүйг анхаарна уу.
                  </p>
                )}

                {/* ✅ Checkbox хэсэг */}
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    className="mt-1"
                  />
                  <span>Би үйлчилгээний нөхцөлийг уншиж, зөвшөөрч байна.</span>
                </label>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Буцах
                </Button>
                <Button
                  color="primary"
                  isDisabled={!checked} // 👈 checkbox шалгаагүй бол disable
                  onPress={() => {
                    onClose();
                    setStep(5);
                  }}
                >
                  Үргэлжлүүлэх
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
