"use client";
import { useState, useEffect, useMemo } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";
import { arrayToMap, button, ListType } from "@/lib/const";
import {
  Branch,
  BranchService,
  IOrder,
  IOrderDetail,
  Service,
  User,
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
import { formatTime, parseDate, toYMD } from "@/lib/functions";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { PaymentMethod, VOUCHER } from "@/lib/enum";
import { OrderSlot, Slot } from "@/models/slot.model";

const WEB_VOUCHER_ENABLED = false;

const getUniqueSlots = (daySlots: Slot[] = []) =>
  Array.from(
    new Map(
      daySlots
        .map((slot) => {
          const time = slot.start_time?.toString().slice(0, 5);
          return time ? [time, slot] : null;
        })
        .filter(Boolean) as [string, Slot][],
    ).values(),
  ).sort((a, b) => (a.start_time as any).localeCompare(b.start_time));

const hasSelectableSlotForDate = (dateKey: string, daySlots: Slot[] = []) => {
  const uniqueSlots = getUniqueSlots(daySlots);
  if (!uniqueSlots.length) return false;

  const now = new Date();
  const isToday = dateKey === toYMD(now);

  return uniqueSlots.some((slot) => {
    const time = slot.start_time?.toString().slice(0, 5);
    if (!time) return false;
    if (!isToday) return true;

    const [h, m] = time.split(":").map(Number);
    return now.getHours() < h || (now.getHours() === h && now.getMinutes() < m);
  });
};

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
  const calculateVoucherDiscount = (
    subtotal: number,
    type?: number | null,
    value?: number | null,
  ) => {
    const total = Number(subtotal ?? 0);
    const voucherValue = Number(value ?? 0);

    if (total <= 0 || voucherValue <= 0) return 0;

    if (Number(type) === VOUCHER.Percent) {
      return Math.min(total, Math.round((total * voucherValue) / 100));
    }

    return Math.min(total, voucherValue);
  };
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
  const itemsQueue: (keyof IOrder)[] = [
    "branch_id",
    "details",
    "order_date",
    "start_time",
    "users",
  ];
  const [showError, setShowError] = useState(false);
  const [stepLoading, setStepLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  function setField<K extends keyof IOrder>(key: K, value: IOrder[K]) {
    if (key !== "parallel") {
      const index = itemsQueue.indexOf(key);

      setSelected((prev) => {
        const updated = { ...prev, [key]: value };

        if (index >= 0) {
          for (let i = index + 1; i < itemsQueue.length; i++) {
            const nextKey = itemsQueue[i];
            updated[nextKey] = undefined as any;
          }
        }

        return updated;
      });
      return;
    }

    setSelected((prev) => ({ ...prev, [key]: value }));
  }

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
  const step3Errors = useMemo(
    () => ({
      user:
        selected.details?.length &&
        selected.details.every((detail) => {
          const serviceId = detail.service_id;
          return Boolean(
            detail.user_id ||
              selected.users?.[serviceId] ||
              selected.users?.["0"],
          );
        })
          ? undefined
          : "Артистаа сонгоно уу!",
    }),
    [selected.details, selected.users],
  );
  const total = 4;
  const [step, setStep] = useState(1);
  const router = useRouter();
  const estimatedSubtotal =
    selected.details?.reduce((sum, detail) => sum + +(detail?.min_price ?? 0), 0) ??
    0;
  const estimatedVoucherDiscount = calculateVoucherDiscount(
    estimatedSubtotal,
    WEB_VOUCHER_ENABLED ? selected.discount_type : undefined,
    WEB_VOUCHER_ENABLED ? selected.voucher_value : undefined,
  );
  const finalTotal = Math.max(estimatedSubtotal - estimatedVoucherDiscount, 0);
  const go = async (n: number) => {
    setStep(Math.min(Math.max(1, n), total));
  };

  const prev = () => {
    if (stepLoading || submitLoading) return;
    fetcher(step - 1);
  };
  const [cant, setCant] = useState<boolean | undefined>(undefined);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isQueueModalOpen,
    onOpen: onQueueModalOpen,
    onOpenChange: onQueueModalChange,
  } = useDisclosure();
  const activeErrors =
    step === 1
      ? step1Errors
      : step === 2
        ? step2Errors
        : step === 3
          ? step3Errors
          : ({} as Record<string, string | undefined>);
  const isStepComplete = useMemo(
    () => Object.values(activeErrors).every((v) => !v),
    [activeErrors],
  );

  const handleNext = async () => {
    if (stepLoading || submitLoading) return;
    if (!isStepComplete) {
      setShowError(true);
      return;
    }
    setShowError(false);
    await fetcher(step + 1);
  };

  const getSlots = async (
    parallel?: boolean,
    options?: {
      date?: Date | string;
      updateSelectedDate?: boolean;
      suppressEmptyToast?: boolean;
      updateState?: boolean;
    },
  ) => {
    const body = {
      branch_id: selected.branch_id,
      services: selected.details?.map((s) => s.service_id),
      parallel,
      multi_artist_queue: parallel ? undefined : true,
      date: options?.date ? toYMD(new Date(options.date)) : undefined,
    };
    const res = await find<Slot>(Api.order, body, "slots");
    const slotItems = Array.isArray(res.data)
      ? res.data
      : Array.isArray((res.data as { items?: Slot[] })?.items)
        ? ((res.data as { items?: Slot[] }).items ?? [])
        : [];

    if (res.error) {
      addToast({
        title: res.error ?? "Сул цаг ачаалах үед алдаа гарлаа.",
        color: "warning",
        timeout: 3000,
      });
      return null;
    }

    const data: Record<string, Slot[]> = slotItems.reduce(
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
    const keys = Object.keys(data).sort((a, b) => a.localeCompare(b));
    const baseDate =
      options?.date ??
      selected.order_date ??
      new Date();
    const startKey = toYMD(new Date(baseDate));
    const date =
      keys.find(
        (key) =>
          key >= startKey && hasSelectableSlotForDate(key, data[key] ?? []),
      ) ?? keys.find((key) => hasSelectableSlotForDate(key, data[key] ?? []));

    if (options?.updateState !== false) {
      setAvailableSlots(data);
    }

    if (!date) {
      if (!options?.suppressEmptyToast) {
        addToast({
          title: "Тухайн үйлчилгээнд сул цаг одоогоор дууссан байна.",
          timeout: 3000,
        });
      }

      return null;
    }

    if (options?.updateSelectedDate !== false) {
      setField("order_date", new Date(date));
    }

    return data;
  };
  const getArtists = async (slotSource?: Record<string, Slot[]>) => {
    if (!selected.order_date || !selected.start_time) return {};

    const userServices = await create(
      Api.user_service,
      {
        branch_id: selected.branch_id,
        services:
          (selected.details as IOrderDetail[])?.map((d) => d.service_id) ?? [],
      },
      "client",
    );
    if (userServices.error) {
      addToast({
        title: userServices.error ?? "Алдаа гарлаа",
        color: "warning",
        timeout: 3000,
      });
      return null;
    }

    const data: OrderSlot = userServices.data.payload;
    const dayKey = toYMD(new Date(selected.order_date as Date));
    const slots = (slotSource ?? availableSlots)[dayKey] ?? [];

    const shouldFilterByStartSlot =
      selected.parallel === true || (selected.details?.length ?? 0) <= 1;
    const artistIds = slots
      .filter(
        (s) =>
          !shouldFilterByStartSlot ||
          s.start_time?.toString().slice(0, 5) === selected.start_time,
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
  const getSelectedArtistForService = (serviceId: string) =>
    selected.users?.[serviceId] ?? selected.users?.["0"];
  const canAssignParallelArtists = (slots: OrderSlot) => {
    const services = (selected.details ?? [])
      .map((detail) => detail.service_id)
      .filter((serviceId, index, array) => array.indexOf(serviceId) === index)
      .sort((a, b) => (slots[a]?.length ?? 0) - (slots[b]?.length ?? 0));

    const usedArtists = new Set<string>();

    const assign = (index: number): boolean => {
      if (index >= services.length) return true;

      const serviceId = services[index];
      const artists = slots[serviceId] ?? [];
      for (const artistId of artists) {
        if (usedArtists.has(artistId)) continue;
        usedArtists.add(artistId);
        if (assign(index + 1)) return true;
        usedArtists.delete(artistId);
      }

      return false;
    };

    return assign(0);
  };
  const hasValidSelectedArtists = (slots: OrderSlot) =>
    (selected.details ?? []).every((detail) => {
      const selectedArtist = getSelectedArtistForService(detail.service_id);
      if (!selectedArtist) return false;

      const artists = slots[detail.service_id] ?? [];
      return artists.includes(selectedArtist);
    });
  const isEmpty = (obj: object) => Object.keys(obj).length === 0;
  const step3Checker = async () => {
    const refreshedSlots = await getSlots(selected.parallel, {
      date: selected.order_date,
      updateSelectedDate: false,
      suppressEmptyToast: true,
      updateState: false,
    });

    if (!refreshedSlots) {
      addToast({
        title: "Цаг олдсонгүй дахин сонгоно уу",
        color: "warning",
        timeout: 3000,
      });
      setField("start_time", undefined);
      await go(2);
      return false;
    }

    let result = await getArtists(refreshedSlots);
    if (result == null) {
      await go(2);
      return false;
    }
    if (result == null || isEmpty(result)) {
      addToast({
        title: "Цаг олдсонгүй дахин сонгоно уу",
        color: "warning",
        timeout: 3000,
      });
      setField("start_time", undefined);
      await go(2);
      return false;
    }

    if (selected.parallel && !canAssignParallelArtists(result)) {
      onQueueModalOpen();
      return false;
    }

    setCant(false);

    if (
      selected.users &&
      Object.values(selected.users).some(Boolean) &&
      !hasValidSelectedArtists(result)
    ) {
      addToast({
        title: "Сонгосон артист боломжгүй боллоо. Дахин сонгоно уу",
        color: "warning",
        timeout: 3000,
      });
      setField("users", undefined);
      setUserService(result);
      await go(3);
      return false;
    }

    setUserService(result);
    return true;
  };
  const switchToSequentialFlow = async () => {
    setStepLoading(true);
    try {
      setField("parallel", false);
      setField("users", undefined);
      setCant(true);

      const sequentialSlots = await getSlots(false, {
        date: selected.order_date,
        updateSelectedDate: false,
        suppressEmptyToast: true,
        updateState: false,
      });

      if (!sequentialSlots) {
        addToast({
          title: "Цаг олдсонгүй дахин сонгоно уу",
          color: "warning",
          timeout: 3000,
        });
        setField("start_time", undefined);
        await go(2);
        return;
      }

      const result = await getArtists(sequentialSlots);
      if (result == null || isEmpty(result)) {
        addToast({
          title: "Цаг олдсонгүй дахин сонгоно уу",
          color: "warning",
          timeout: 3000,
        });
        setField("start_time", undefined);
        await go(2);
        return;
      }

      setUserService(result);
      await getSlots(false, {
        updateSelectedDate: false,
        suppressEmptyToast: true,
      });
      await go(3);
    } finally {
      setStepLoading(false);
    }
  };

  const fetcher = async (currentStep: number) => {
    setStepLoading(true);
    try {
      if (currentStep == 1) {
        setField("users", undefined);
      }
      if (currentStep == 2) {
        await getSlots(selected.parallel);
      }
      if (currentStep == 3) {
        const canProceed = await step3Checker();
        if (!canProceed) return;
      }
      await go(currentStep);
    } finally {
      setStepLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const formatDetails = () => {
    const details: IOrderDetail[] = [];

    selected.details?.forEach((d) => {
      const service = d.service_id;
      let user_id = d.user_id;

      const {
        category_id,
        max_price,
        min_price,
        original_price,
        pre,
        user,
        ...detailPayload
      } = d as IOrderDetail & {
        category_id?: string;
        pre?: number;
      };

      if (user_id) {
        details.push({ ...detailPayload, user_id });
        return;
      }

      const selectedUser = getSelectedArtistForService(service);
      if (selectedUser && selectedUser !== "0" && selectedUser !== "") {
        user_id = selectedUser;
      }

      details.push({ ...detailPayload, user_id });
    });

    return details;
  };

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [checked, setChecked] = useState(false);
  const [order, setOrder] = useState<string | null>(null);
  const prePaymentErrorMessage =
    "Урьдчилгаа төлбөр үүсгэхэд алдаа гарлаа. Дахин оролдоно уу";
  const onSubmit = async (): Promise<"invoice" | "completed" | false> => {
    if (submitLoading) return false;

    setShowError(true);
    if (!Object.values(step3Errors).every((value) => !value)) {
      await go(3);
      return false;
    }

      setSubmitLoading(true);
    try {
      setInvoice(null);
      setOrder(null);
      const artistCheck = await step3Checker();
      if (!artistCheck) return false;

      const details = formatDetails();
      if (details.some((detail) => !detail.user_id)) {
        addToast({
          title: "Артистаа сонгоод дахин оролдоно уу",
          color: "warning",
          timeout: 3000,
        });
        await go(3);
        return false;
      }

      const payload = {
        branch_id: selected.branch_id,
        details,
        order_date: selected.order_date,
        start_time: selected.start_time,
        description: selected.description,
        pre_method: PaymentMethod.QPAY,
        method: PaymentMethod.QPAY,
        voucher_id: WEB_VOUCHER_ENABLED ? selected.voucher_id : undefined,
        parallel: selected.parallel,
      };
      const res = await create<IOrder>(Api.order, payload);
      if (!res.success) {
        addToast({
          title: res.error ?? prePaymentErrorMessage,
          color: "warning",
          timeout: 3000,
        });

        await fetcher(2);

        return false;
      }
      const createdInvoice = res.data?.payload?.invoice;
      const createdOrderId = res.data?.payload?.id;

      if (createdInvoice?.invoice_id && createdOrderId) {
        setInvoice({
          ...createdInvoice,
          price: Number(createdInvoice.price ?? 0),
          created: createdInvoice.created ?? new Date(),
          urls: createdInvoice.urls ?? [],
        });
        setOrder(createdOrderId);
        return "invoice";
      }

      if (createdOrderId) {
        addToast({
          title: "Захиалга амжилттай баталгаажлаа.",
          timeout: 3000,
        });
        router.push("/my");
        router.refresh();
        return "completed";
      }

      addToast({
        title: prePaymentErrorMessage,
        color: "warning",
        timeout: 3000,
      });
      return false;
    } finally {
      setSubmitLoading(false);
    }
  };
  useEffect(() => {
    if (step === 5 && invoice && order && !invoice.invoice_id) {
      addToast({
        title: prePaymentErrorMessage,
        color: "warning",
        timeout: 3000,
      });
      setStep(4);
      router.refresh();
    }
  }, [invoice, order, router, step]);
  if (invoice != null && order != null && step == 5 && invoice.invoice_id) {
    return (
      <div>
        <PaymentView invoice={invoice} id={order} />
      </div>
    );
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
                    className={`space-x-2 z-10 flex flex-col  relative px-2 bg-white flex-center `}
                    // onClick={() => {
                    //   if (canJump(i + 1)) go(i + 1);
                    // }}
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
                indicator: "stroke-rose-700",
                track: "stroke-rose-700/20",
                value: "text-xl font-semibold text-rose-700",
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
              userService={userService}
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
              errors={step3Errors}
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
              token={token}
              onChange={setField}
            />
          )}

          {/* Navigation buttons */}
          <div className="flex w-full justify-between gap-4 mt-6 px-2">
            <Button
              onPress={prev}
              isDisabled={step === 1 || stepLoading || submitLoading}
              variant="bordered"
              className={
                "h-12 w-full md:w-28 border-rose-400 text-rose-500 hover:scale-105 transition-all duration-150"
              }
            >
              Буцах
            </Button>
            {step < total ? (
              <Button
                isLoading={stepLoading}
                isDisabled={stepLoading || submitLoading}
                className={cn(
                  isStepComplete ? "" : "",
                  button,
                  "h-12 text-white border shadow-xl w-full md:w-28 border-white/5 rounded-xl aspect-square flex-center",
                )}
                onPress={handleNext}
              >
                Дараах
              </Button>
            ) : (
              <Button
                isDisabled={stepLoading || submitLoading}
                onPress={() => onOpen()}
                className={cn(
                  isStepComplete ? "" : "",
                  button,
                  "h-12 text-white border shadow-xl w-full md:w-28 border-white/5 rounded-xl aspect-square flex-center",
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
                <p className="text-sm text-muted-foreground">
                  {finalTotal === 0
                    ? "Энэ захиалга урамшууллаар бүрэн хаагдах тул үргэлжлүүлсний дараа шууд баталгаажна."
                    : "Та захиалгаа баталгаажуулахын тулд урьдчилгаа төлбөр төлөх шаардлагатай. Үргэлжлүүлэх дарсны дараа QPay төлбөрийн хэсэг нээгдэнэ."}
                </p>

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
                  <span>
                    Би{" "}
                    <a href="/terms" target="_blank" className="font-bold">
                      үйлчилгээний нөхцөлийг
                    </a>{" "}
                    зөвшөөрч байна.
                  </span>
                </label>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  className="h-8 rounded-sm"
                  variant="light"
                  isDisabled={submitLoading}
                  onPress={onClose}
                >
                  Буцах
                </Button>
                <Button
                  color="primary"
                  isLoading={submitLoading}
                  isDisabled={!checked || submitLoading}
                  onPress={async () => {
                    await onSubmit().then((result) => {
                      if (result === "invoice") {
                        setStep(5);
                      }
                      onClose();
                    });
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
      <Modal isOpen={isQueueModalOpen} onOpenChange={onQueueModalChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Зэрэг үйлчилгээ боломжгүй байна
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-muted-foreground">
                  Тухайн цагт зэрэг үйлчлэх боломжгүй тул дарааллаар
                  үйлчлүүлэх үү?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  isDisabled={stepLoading || submitLoading}
                  onPress={() => {
                    setCant(false);
                    setField("start_time", undefined);
                    onClose();
                  }}
                >
                  Өөр цаг сонгох
                </Button>
                <Button
                  color="primary"
                  isLoading={stepLoading}
                  isDisabled={stepLoading || submitLoading}
                  onPress={async () => {
                    onClose();
                    await switchToSequentialFlow();
                  }}
                  className={cn(
                    button,
                    "text-white border shadow-xl border-white/5 rounded-sm",
                  )}
                >
                  Тийм, дарааллаар
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
