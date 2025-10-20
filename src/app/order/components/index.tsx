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
  IOrderDetail,
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

import { Progress } from "@heroui/progress";
import { usernameFormatter } from "@/lib/functions";
import { addToast } from "@heroui/toast";
import { orderSteps } from "@/lib/constants";
import { checkboxGroup, select } from "@heroui/theme";
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
function useStepper(total = 4) {
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

  const [times, setTimes] = useState<number[] | null>(null);
  const [limit, setLimit] = useState(7);
  const [date, setDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [userService, setUserService] =
    useState<ListType<IUserService>>(ListDefault);
  const [showError, setShowError] = useState(false);
  function setField<K extends keyof IOrder>(key: K, value: IOrder[K]) {
    setSelected((prev) => ({ ...prev, [key]: value }));
  }

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

  const { step, go, next, prev, total } = useStepper(4);
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

  // индикатор дээр үсрэх зөвшөөрөл
  function canJump(target: number) {
    // target хүртэлх өмнөх алхмууд бэлэн байх ёстой
    if (target <= 1) return true;
    if (!Object.values(step1Errors).every((v) => !v)) return false;
    if (target <= 2) return true;
    if (!Object.values(step3Errors).every((v) => !v)) return false;
    return true;
  }
  const handleNext = () => {
    console.log(isStepComplete);
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
        services:
          (selected.details as IOrderDetail[])?.map((d) => d.service_id) ?? [],
        branch_id: selected.branch_id,
        limit: -1,
      }).then((d) => {
        setUserService(d.data);
      });
    }
    if (step == 3) {
      await getAvailableTime();
    }
  };

  const getAvailableTime = async (d?: Date) => {
    setLoading(true);
    await create(
      Api.order,
      {
        serviceArtist: selected.users,
        branch_id: selected.branch_id ?? "",
        date: d,
      },
      "available_times"
    ).then((data) => {
      const { date, limit, times } = data.data.payload;
      if (d) {
        setTimes(times);
      } else {
        setTimes(times);
        const nd = mnDate(date);
        const d = new Date(
          Date.UTC(nd.getFullYear(), nd.getMonth(), nd.getDate(), 0)
        );
        setSelected((prev) => ({ ...prev, order_date: d }));
        setDate(date);
        setLimit(limit);
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetcher();
  }, [step]);

  useEffect(() => {
    if (selected.order_date) getAvailableTime(selected.order_date);
  }, [selected.order_date]);
  const reset = () => {
    setSelected({ details: [] });
    setUserService(ListDefault);
    setTimes(null);
    setDate(null);
    setLimit(7);
    go(1);
  };

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [order, setOrder] = useState<string | null>(null);
  const onSubmit = async () => {
    const st = selected.start_time?.slice(0, 2);
    const res = await create<IOrder>(Api.order, {
      branch_id: selected.branch_id,
      details: selected.details as IOrderDetail[],
      order_date: selected.order_date,
      start_time: st,
      customer_desc: selected.customer_desc,
      user_id: selected.users?.[0],
      users: selected.users,
    });
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
      reset();
    }
  };
  if (invoice != null && order != null)
    return (
      <div>
        <PaymentView invoice={invoice} id={order} />
      </div>
    );

  return (
    <div className="relative py-10">
      <div className="flex flex-col justify-center max-w-3xl p-6 py-32 mx-auto space-y-6 ">
        {/* Step indicator */}
        <div>
          <Progress
            aria-label="Loading..."
            className="w-full pb-3 px-2"
            size="sm"
            value={(step / 4) * 100}
          />
          <div className="relative flex justify-between w-full ">
            <div className="absolute top-[50%] -translate-y-[50%]  left-[50%] -translate-x-[50%] w-3/4 border-[0.5px] border-gray-400 h-[1px] border-dashed"></div>
            {orderSteps.map((s, i) => (
              <div
                key={i}
                className={`space-x-2 z-10 cursor-pointer relative px-2 bg-white flex-center font-semibold text-xs `}
                onClick={() => {
                  // if (canJump(s)) go(s);
                }}
              >
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
        <Form
          className="flex flex-col justify-center w-full gap-4 px-2"
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
        </Form>
        {/* Step Components */}

        {step === 2 && (
          <Step2
            showError={showError}
            values={{
              details: selected.details ?? [],
              users: selected.users ?? {},
            }}
            users={users}
            onChange={setField}
            userServices={userService.items}
          />
        )}

        {step === 3 && (
          <Step3
            values={{
              date: selected.order_date ?? new Date(),
              time: selected.start_time,
              details: selected.details ?? [],
              description: selected.customer_desc,
            }}
            times={times}
            loading={loading}
            date={date}
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
        <div className="flex justify-between mt-6 px-2">
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
              className="text-white bg-gray-500"
            >
              Илгээх
            </Button>
          )}
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Та итгэлтэй байна уу
              </ModalHeader>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Буцах
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    onSubmit();
                  }}
                >
                  Баталгаажсан
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
