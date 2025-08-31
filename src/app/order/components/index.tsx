"use client";

import { useState, useEffect, useMemo } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";
import { ListDefault, ListType, mnDate } from "@/lib/const";
import {
  Booking,
  BookingSchedule,
  Branch,
  IBooking,
  IOrder,
  IUserService,
  Schedule,
  Service,
  User,
  UserService,
} from "@/models";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { Form } from "@heroui/form";
import { create, find } from "@/app/(api)";
import { Api } from "@/utils/api";
import { usernameFormatter } from "@/lib/functions";
import { addToast } from "@heroui/toast";
function useStepper(total = 3) {
  const [step, setStep] = useState(1);
  const go = (n: number) => setStep(Math.min(Math.max(1, n), total));

  const next = () => go(step + 1);
  const prev = () => go(step - 1);

  return { step, go, next, prev, total };
}
export default function OrderPage({
  data,
  branches,
  token,
  users,
}: {
  token?: string;
  data: ListType<Service>;
  branches: ListType<Branch>;
  users: ListType<User>;
}) {
  // selected бүх мэдээллээ энд төвлөрүүлнэ
  const [selected, setSelected] = useState<
    Partial<IOrder> & { times?: string }
  >({ details: [] });

  const [bookings, setBookings] = useState<BookingSchedule>({ overlap: {} });
  const [userService, setUserService] =
    useState<ListType<IUserService>>(ListDefault);
  const [showError, setShowError] = useState(false);
  function setField<K extends keyof IOrder>(key: K, value: IOrder[K]) {
    setSelected((prev) => ({ ...prev, [key]: value }));
  }

  const step1Errors = useMemo(
    () => ({
      branch: selected.branch_id ? undefined : "Салбараа сонгоно уу!",
      service: selected.details?.some((d) => d?.service_id != undefined)
        ? undefined
        : "Үйлчилгээгээ сонгоно уу!",
    }),
    [selected.branch_id, selected.details]
  );

  const step2Errors = useMemo(
    () => ({
      date: selected.order_date ? undefined : "Захиалгын өдрөө сонгоно уу!",
      time: selected.start_time ? undefined : "Захиалгын цагаа сонгоно уу!",
      user: selected.user_id ? undefined : "Артистыг сонгоно уу!",
    }),
    [selected.order_date, selected.start_time, selected.user_id]
  );
  const { step, go, next, prev, total } = useStepper(3);

  const activeErrors =
    step === 1
      ? step1Errors
      : step === 2
        ? step2Errors
        : ({} as Record<string, string | undefined>);
  const isStepComplete = useMemo(
    () => Object.values(activeErrors).every((v) => !v),
    [activeErrors]
  );

  // индикатор дээр үсрэх зөвшөөрөл
  function canJump(target: number) {
    // target хүртэлх өмнөх алхмууд бэлэн байх ёстой
    if (target <= 1) return true;
    if (!Object.values(step1Errors).every((v) => !v)) return false;
    if (target <= 2) return true;
    if (!Object.values(step2Errors).every((v) => !v)) return false;
    return true;
  }
  const handleNext = () => {
    if (!isStepComplete) {
      setShowError(true);
      return;
    }
    setShowError(false);
    next();
  };
  const fetcher = async () => {
    if (step == 2) {
      await find<IUserService>(Api.user_service, {
        services: selected.details?.map((d) => d.service_id) ?? [],
        branch_id: selected.branch_id,
        limit: -1,
      }).then((d) => {
        setUserService(d.data);
      });

      await find<IBooking>(Api.booking, {
        start_date: mnDate(),
        branch_id: selected.branch_id,
        limit: -1,
      }).then((d) => {
        console.log(d);
        setBookings(d.data.items?.[0] as unknown as BookingSchedule);
      });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetcher();
  }, [step]);
  const reset = () => {
    setSelected({ details: [] });
    setUserService(ListDefault);
    setBookings({ overlap: {} });
    go(1);
  };
  const onSubmit = async () => {
    const res = await create<IOrder>(Api.order, {
      branch_id: selected.branch_id,
      details: selected.details,
      order_date: selected.order_date,
      start_time: selected.start_time,
      user_id: selected.user_id,
    });
    addToast({ title: res.success });
    reset();
  };

  return (
    <div className="relative py-10">
      <div className="flex flex-col justify-center max-w-xl p-6 py-32 mx-auto space-y-6 ">
        {/* Step indicator */}
        <div className="relative flex justify-between w-full px-10">
          <div className="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] w-3/4 border-[0.5px] border-gray-400 h-[1px] border-dashed"></div>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`size-10 space-x-2 z-10 cursor-pointer relative rounded-full flex-center font-semibold text-sm ${s === step ? "bg-dark-200 text-white" : "border-2 bg-background border-dark"}`}
              onClick={() => {
                if (canJump(s)) go(s);
              }}
            >
              <span>0{s}</span>
            </div>
          ))}
        </div>
        <Form
          className="flex flex-col justify-center w-full gap-4"
          onReset={() => setSelected({ details: [] })}
          onSubmit={(e) => {
            e.preventDefault();
            let data = Object.fromEntries(new FormData(e.currentTarget));

            console.log(data);
            // setSelected(data)
          }}
        >
          {step === 1 && (
            <Step1
              values={{
                branch: selected.branch_id,
                services: selected.details?.map((d) => d.service_id) ?? [],
              }}
              showError={showError}
              branches={branches}
              services={data}
              onChange={setField}
              errors={step1Errors}
            />
          )}
        </Form>
        {/* Step Components */}

        {step === 2 && (
          <Step2
            showError={showError}
            values={{
              date: selected.order_date,
              time: selected.start_time,
              user: selected.user_id,
            }}
            users={users}
            booking={bookings}
            onChange={setField}
            errors={step2Errors}
          />
        )}

        {step === 3 && (
          <Step3
            values={{
              branch: branches.items.filter(
                (b) => b.id == selected.branch_id
              )[0].name,
              date: selected.order_date ?? new Date(),
              services:
                selected
                  .details!.map((d) => d.service_name)
                  .filter((d) => d != null) ?? [],
              time: selected.start_time ?? "",
              user: usernameFormatter(
                users.items.filter((us) => us.id == selected.user_id)[0]
              ),
            }}
          />
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
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
              onPress={() => onSubmit()}
              className="text-white bg-teal-500"
            >
              ???
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
