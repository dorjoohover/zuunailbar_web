"use client";
import { useState, useEffect, useMemo } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";
import { arrayToMap, button, ListDefault, ListType, mnDate } from "@/lib/const";
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
  UserService,
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
import { formatTime, money, parseDate, toYMD } from "@/lib/functions";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { PaymentMethod } from "@/lib/enum";
import { OrderSlot, ParallelOrderSlot, Slot } from "@/models/slot.model";

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

  const userMap = arrayToMap<User>(users.items);
  const serviceMap = arrayToMap<Service>(data.items);
  // zasna
  const [userService, setUserService] = useState<OrderSlot>({});
  const [availableSlots, setAvailableSlots] = useState<Record<string, Slot[]>>(
    {},
  );

  const [showError, setShowError] = useState(false);
  function setField<K extends keyof IOrder>(key: K, value: IOrder[K]) {
    setSelected((prev) => ({ ...prev, [key]: value }));
  }

  const [userDatetimes, setUserDateTimes] = useState<UserDateTime[]>([]);

  const step1Errors = useMemo(
    () => ({
      branch: selected.branch_id ? undefined : "Салбараа сонгоно уу!",
      service: (selected.details as IOrderDetail[])?.some(
        (d) => d?.service_id != undefined,
      )
        ? undefined
        : "Үйлчилгээгээ сонгоно уу!",
    }),
    [selected.branch_id, selected.details as IOrderDetail[]],
  );

  const step2Errors = useMemo(
    () => ({
      date: selected.order_date ? undefined : "Захиалгын өдрөө сонгоно уу!",
      time: selected.start_time ? undefined : "Захиалгын цагаа сонгоно уу!",
    }),
    [selected.order_date, selected.start_time],
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

  const prev = () => {
    fetcher(step - 1);
  };
  const [cant, setCant] = useState<boolean | undefined>(undefined);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const activeErrors =
    step === 1
      ? step1Errors
      : step === 2
        ? step2Errors
        : ({} as Record<string, string | undefined>);
  const isStepComplete = useMemo(
    () => Object.values(activeErrors).every((v) => !v),
    [activeErrors],
  );

  const handleNext = () => {
    if (!isStepComplete) {
      setShowError(true);
      return;
    }
    setShowError(false);
    fetcher(step + 1);
  };

  const getSlots = async (parallel?: boolean) => {
    const body = {
      branch_id: selected.branch_id,
      services: selected.details?.map((s) => s.service_id),
      parallel,
    };
    const res = await find<Slot>(Api.order, body, "slots");
    // console.log(res);
    console.log(res.data);
    const data: Record<string, Slot[]> = (res.data as unknown as Slot[]).reduce(
      (acc, item) => {
        const key = toYMD(new Date(item.date));

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push({ ...item, key });
        return acc;
      },
      {} as Record<string, Slot[]>,
    );
    let date;

    const keys = Object.keys(data);

    for (const k of keys) {
      const value = data[k];
      if (value?.length > 0) {
        date = k;
        break;
      }
    }

    if (!date) {
      addToast({
        title: "Тухайн үйлчилгээнд сул цаг одоогоор дууссан байна.",
      });

      return;
    } else {
      setField("order_date", new Date(date));
      setAvailableSlots(data);
    }
  };
  const getArtists = async () => {
    // selected.start_time, selected.parallel, selected.order_date;
    const userServices = await create(
      Api.user_service,
      {
        branch_id: selected.branch_id,
        services:
          (selected.details as IOrderDetail[])?.map((d) => d.service_id) ?? [],
        order_date: selected.order_date,
        start_time: selected.start_time,
        parallel: selected.parallel,
      },
      "client",
    );
    if (userServices.error) {
      fetcher(2);
      addToast({
        title: userServices.error ?? "Алдаа гарлаа",
        color: "warning",
      });
      return;
    }
    // serviceId: artists

    const data: OrderSlot = userServices.data.payload;
    const slots =
      availableSlots[toYMD(new Date(selected.order_date as Date))] ?? [];

    const artistIds = slots
      .filter(
        (s) => s.start_time?.toString().slice(0, 5) === selected.start_time,
      )
      .map((s) => s.artist_id);

    const result = Object.fromEntries(
      Object.entries(data)
        .map(([service, artists]) => [
          service,
          artists.filter((a) => artistIds.includes(a)),
        ])
        .filter(([_, artists]) => artists.length > 0),
    );
    return result;
  };

  const step3Checker = async () => {
    let result = await getArtists();
    let checker = selected.details?.every((detail) => {
      if (result[detail.service_id] == undefined) return true;
      return result[detail.service_id]?.length <= 1;
    });

    if (selected.parallel && checker) {
      setField("parallel", false);
      await getSlots(false);
      result = await getArtists();
      setUserService(result);
      setCant(true);
    } else {
      setCant(false);
      setUserService(result);
    }
  };

  const fetcher = async (currentStep: number) => {
    if (currentStep == 1) {
      setField("users", undefined);
    }
    if (currentStep == 2) {
      await getSlots(selected.parallel);
    }
    if (currentStep == 3) {
      step3Checker();
    }
    // onSubmit();
    go(currentStep);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

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
        (u) => u.service_id === service && u.slots?.[day]?.includes(startHour),
      );

      const selectedUser = selected.users?.[service] ?? selected.users?.[0];
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

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [checked, setChecked] = useState(false);
  const [order, setOrder] = useState<string | null>(null);
  const onSubmit = async () => {
    const payload = {
      branch_id: selected.branch_id,
      details: formatDetails(),
      order_date: selected.order_date,
      start_time: selected.start_time,
      description: selected.description,
      method: PaymentMethod.P2P,
      parallel: selected.parallel,
    };
    const res = await create<IOrder>(Api.order, payload);
    if (!res.success) {
      addToast({
        title: res.error ?? "Алдаа гарлаа дахин оролдоно уу",
        color: "warning",
      });

      fetcher(2);

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
  const router = useRouter();
  if (invoice != null && order != null && step == 5) {
    if (invoice.price)
      return (
        <div>
          <PaymentView invoice={invoice} id={order} />
        </div>
      );
    else {
      addToast({ title: "Амжилттай.", color: "success" });
      router.refresh();
    }
  }
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
    if (index == 2) {
      const selected_users = selected.users
        ? Object.values(selected.users).filter((a) => a != undefined)
        : [];

      if (selected_users.length === 0) {
        return undefined;
      }
      const matchedUsers = users.items.filter((u) =>
        selected_users.includes(u.id),
      );

      const uniqueUserIds = Array.from(new Set(matchedUsers.map((u) => u.id)));

      if (uniqueUserIds.length > 1) {
        return "2 Артист";
      }

      return matchedUsers[0]?.nickname;
    }
    if (index == 1) {
      const date = selected.order_date;
      const time = selected.start_time;
      if (!date || !time) return undefined;
      return `${parseDate(date, false)} ${formatTime(time)}`;
    }
    return undefined;
  };

  const canJump = (s: number) => {
    if (s == 1) return true;
    if (s == 2)
      return (
        selected.branch_id && selected.details && selected.details?.length > 0
      );
    if (s == 3) return selected.order_date && selected.start_time;
    if (s == 4)
      return (
        selected.users &&
        Object.values(selected.users).length > 0 &&
        invoice?.invoice_id
      );
  };

  return (
    <div className="relative py-10">
      <div className="flex flex-col justify-center max-w-3xl p-6 py-12 md:py-18 xl:py-24 mx-auto space-y-6 ">
        {/* Step indicator */}
        <div className="hidden sm:block">
          <Progress
            aria-label="Loading..."
            className="w-full pb-3 px-2 "
            classNames={{
              track: "drop-shadow-md border border-default",
              indicator: "bg-linear-to-r from-rose-600 to-rose-500",
              label: "tracking-wider font-medium text-default-600",
              value: "text-foreground/60",
            }}
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
                      if (canJump(i + 1)) go(i + 1);
                    }}
                  >
                    <span
                      className={`font-bolder pb-1 mb-1 text-sm ${current ? "bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent " : ""} ${!value && current ? "border-b-2 border-rose-600" : ""}`}
                    >
                      {s.name}
                    </span>
                    <span
                      className={`pb-1 text-xs  ${current ? "bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent border-b  border-rose-600" : ""} font-light`}
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
                    (d) => d.service_id,
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

          {step === 2 && availableSlots != null && (
            <Step2
              values={{
                date: selected.order_date,
                time: selected.start_time,
                details: selected.details ?? [],
                description: selected.description,
                parallel: selected.parallel,
                // users: selected.users,
              }}
              loading={false}
              slots={availableSlots}
              errors={step2Errors}
              onChange={setField}
              showError={showError}
            />
          )}
          {step === 3 && userService != null && (
            <Step3
              showError={showError}
              values={{
                details: selected.details ?? [],
                users: selected.users ?? {},
                parallel: selected.parallel ?? false,
                order_date: selected.order_date,
                start_time: selected.start_time,
              }}
              users={userMap}
              services={serviceMap}
              cant={cant}
              onChange={setField}
              slots={userService}
            />
          )}
          {step === 4 && (
            <Step4
              values={selected}
              branches={branches}
              services={data}
              users={users}
              invoice={invoice}
            />
          )}

          {/* Navigation buttons */}
          <div className="flex w-full justify-between mt-6 px-2">
            <Button
              onPress={prev}
              disabled={step === 1}
              variant="bordered"
              className={
                "h-12 w-28 border-rose-400 text-rose-500 hover:scale-105 transition-all duration-150"
              }
            >
              Буцах
            </Button>
            {step < total ? (
              <Button
                className={cn(
                  isStepComplete ? "" : "",
                  button,
                  "h-12 text-white border shadow-xl w-28 border-white/5 rounded-xl aspect-square flex-center",
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
                  button,
                  "h-12 text-white border shadow-xl w-28 border-white/5 rounded-xl aspect-square flex-center",
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
                {!invoice?.price && (
                  <p className="text-sm text-muted-foreground">
                    Энэхүү захиалга урьдчилгаа төлбөргүйгээр баталгаажна.
                  </p>
                )}

                {invoice?.price && (
                  <p className="text-sm text-muted-foreground">
                    Та захиалгаа баталгаажуулахын тулд{" "}
                    <span className="font-semibold text-primary">
                      {money(invoice.price)}₮
                    </span>{" "}
                    урьдчилгаа төлбөр төлөх шаардлагатай. Энэ төлбөр буцаан
                    олгогдохгүйг анхаарна уу. Мөн энэхүү урьдчилгаа нь таны нийт
                    төлбөрөөс хасагдан тооцогдох болно.
                  </p>
                )}

                {/* ✅ Checkbox хэсэг */}
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    className="
    mt-1 h-4 w-4
    appearance-none
    rounded
    border border-gray-400
    checked:bg-primary    
    checked:border-primary
    checked:text-white
    flex items-center justify-center
  "
                  />
                  {checked && (
                    <Check
                      className="absolute font-bold text-white pointer-events-none"
                      size={12}
                      strokeWidth={6}
                      style={{ marginTop: 3, marginLeft: 2 }}
                    />
                  )}
                  <span>Би үйлчилгээний нөхцөлийг зөвшөөрч байна.</span>
                </label>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  className="h-8 rounded-sm"
                  variant="light"
                  onPress={onClose}
                >
                  Буцах
                </Button>
                <Button
                  color="primary"
                  isDisabled={!checked} // 👈 checkbox шалгаагүй бол disable
                  onPress={() => {
                    onClose();
                    setStep(5);
                  }}
                  className={cn(
                    button,
                    "text-white border shadow-xl h-8 border-white/5 rounded-sm w-28 aspect-square flex-center",
                  )}
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
