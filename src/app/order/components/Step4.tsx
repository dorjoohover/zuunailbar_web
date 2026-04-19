"use client";

import { useEffect, useMemo, useState } from "react";
import { find } from "@/app/(api)";
import { ReviewCard } from "@/components/card";
import { ListType, mnDate } from "@/lib/const";
import {
  firstLetterUpper,
  formatTime,
  getDayName,
  money,
} from "@/lib/functions";
import {
  Branch,
  IOrder,
  Service,
  User,
  Voucher,
} from "@/models";
import { VoucherStatus, VOUCHER } from "@/lib/enum";
import { Invoice } from "@/types";
import { Api } from "@/utils/api";
import {
  Calendar,
  Clock,
  Folder,
  MapPin,
  TicketPercent,
  User as LUser,
  Wallet,
} from "lucide-react";

interface Step4Props {
  values: Partial<IOrder> & {
    times?: string;
  };
  branches: ListType<Branch>;
  users: ListType<User>;
  services: ListType<Service>;
  invoice: Invoice | null;
  token?: string;
  onChange: <K extends keyof IOrder>(key: K, value: IOrder[K]) => void;
}

const calculateVoucherDiscount = (
  subtotal: number,
  voucher?: Pick<Voucher, "type" | "value"> | null,
) => {
  if (!voucher) return 0;

  const total = Number(subtotal ?? 0);
  const value = Number(voucher.value ?? 0);

  if (total <= 0 || value <= 0) return 0;

  if (Number(voucher.type) === VOUCHER.Percent) {
    return Math.min(total, Math.round((total * value) / 100));
  }

  return Math.min(total, value);
};

export default function Step4({
  values,
  branches,
  services,
  users,
  invoice,
  token,
  onChange,
}: Step4Props) {
  const branch = branches.items.filter((a) => a.id == values.branch_id)[0];
  const [vouchers, setVouchers] = useState<ListType<Voucher>>({
    count: 0,
    items: [],
  });
  const [voucherLoading, setVoucherLoading] = useState(false);

  const duration =
    values.details?.reduce((acc, item) => acc + (item?.duration ?? 0), 0) ?? 0;
  const subtotal =
    values.details?.reduce((sum, item) => sum + +(item?.min_price ?? 0), 0) ?? 0;
  const date = values.order_date ?? mnDate();

  useEffect(() => {
    let cancelled = false;

    const loadVouchers = async () => {
      if (!token) {
        setVouchers({ count: 0, items: [] });
        return;
      }

      setVoucherLoading(true);

      try {
        const res = await find<Voucher>(
          Api.voucher,
          {
            limit: -1,
            voucher_status: VoucherStatus.Available,
          },
          "my",
        );

        if (!cancelled) {
          setVouchers(res.data);
        }
      } finally {
        if (!cancelled) {
          setVoucherLoading(false);
        }
      }
    };

    loadVouchers();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const selectedVoucher = useMemo(
    () => vouchers.items.find((item) => item.id === values.voucher_id) ?? null,
    [values.voucher_id, vouchers.items],
  );

  useEffect(() => {
    if (voucherLoading || !values.voucher_id) return;

    if (!selectedVoucher) {
      onChange("voucher_id", null);
      onChange("voucher_name", undefined);
      onChange("voucher_value", undefined);
      onChange("discount_type", undefined);
    }
  }, [onChange, selectedVoucher, values.voucher_id, voucherLoading]);

  const discount = calculateVoucherDiscount(
    subtotal,
    selectedVoucher ?? {
      type: values.discount_type as VOUCHER,
      value: Number(values.voucher_value ?? 0),
    },
  );
  const finalTotal = Math.max(subtotal - discount, 0);
  const pre = invoice?.price ?? 0;

  return (
    <div className="space-y-10 w-full">
      <h2 className="mb-8 text-xl font-semibold text-center gap-y-10">
        Захиалгын тойм
      </h2>
      <div className="border border-gray-300 rounded-lg py-2 px-4">
        <div className="grid grid-cols-1 space-y-2">
          <ReviewCard Icon={MapPin} title="Байршил">
            <div>
              <p className="text-gray-500 text-sm">
                {firstLetterUpper(branch?.name ?? "")}
              </p>
              <p className="text-gray-500 text-xs">{branch?.address}</p>
            </div>
          </ReviewCard>
          <ReviewCard Icon={Calendar} title="Өдөр | Цаг" bold={true}>
            <div>
              <p className="text-gray-500 text-sm">
                {getDayName(date.getDay() == 0 ? 7 : date.getDay())},{" "}
                {date.getMonth() + 1}-р сарын {date.getDate()},{" "}
                {date.getFullYear()}
              </p>
              <p className="text-gray-500 text-xs">
                {formatTime(values.start_time!)}
              </p>
            </div>
          </ReviewCard>
          <ReviewCard Icon={LUser} title="Үйлчилгээ | Артист" bold={true}>
            <div className="w-full">
              {values.details?.map((service, i) => {
                const min = service.min_price ?? 0;
                const user_id =
                  values.users?.[service.service_id] ?? values.users?.["0"];
                const user = users.items.filter((u) => u.id == user_id)?.[0];
                return (
                  <div
                    className="bg-gray-100 my-2 px-2 py-3 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center"
                    key={i}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="flex items-center justify-start gap-2">
                        <p className="text-sm">
                          {firstLetterUpper(service.service_name ?? "")}
                        </p>
                        <span className="rounded-md bg-gray-200 px-2 py-1 text-xs">
                          {service.duration} мин
                        </span>
                      </div>
                      {user && (
                        <span className="text-gray-500 flex items-center gap-1 text-xs">
                          <LUser size={12} color="#6B7280" />
                          {firstLetterUpper(user?.nickname ?? "")}
                        </span>
                      )}
                    </div>
                    {min != 0 && <p>{money(min.toString())}₮</p>}
                  </div>
                );
              })}
            </div>
          </ReviewCard>
          {token && (
            <ReviewCard Icon={TicketPercent} title="Voucher">
              <div className="w-full space-y-3">
                {voucherLoading ? (
                  <p className="text-sm text-gray-500">
                    Voucher мэдээлэл уншиж байна...
                  </p>
                ) : vouchers.items.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Ашиглах боломжтой voucher алга байна.
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {vouchers.items.map((voucher) => {
                      const selected = voucher.id === values.voucher_id;
                      const voucherDiscount = calculateVoucherDiscount(
                        subtotal,
                        voucher,
                      );
                      const label =
                        Number(voucher.type) === VOUCHER.Percent
                          ? `${voucher.value ?? 0}%`
                          : `${money(voucher.value ?? 0)}₮`;

                      return (
                        <button
                          key={voucher.id}
                          type="button"
                          className={`rounded-xl border px-3 py-3 text-left transition-all ${
                            selected
                              ? "border-rose-400 bg-rose-50 shadow-sm"
                              : "bg-white hover:border-rose-200"
                          }`}
                          onClick={() => {
                            const cleared = selected;
                            onChange("voucher_id", cleared ? null : voucher.id);
                            onChange(
                              "voucher_name",
                              cleared ? undefined : voucher.name,
                            );
                            onChange(
                              "voucher_value",
                              cleared ? undefined : voucher.value,
                            );
                            onChange(
                              "discount_type",
                              cleared ? undefined : voucher.type,
                            );
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-sm">
                                {voucher.name}
                              </p>
                              <p className="text-xs text-gray-500">{label}</p>
                            </div>
                            {selected && (
                              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                                Сонгосон
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            {voucherDiscount > 0
                              ? `${money(voucherDiscount)}₮ хасагдана`
                              : "Хөнгөлөлт тооцогдохгүй"}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
                {selectedVoucher && (
                  <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {selectedVoucher.name} хэрэглэж,
                    {` ${money(discount)}₮`} хасагдана.
                    {finalTotal === 0 &&
                      " Энэ захиалга voucher-аар бүрэн хаагдана."}
                  </div>
                )}
              </div>
            </ReviewCard>
          )}
          {values.description && (
            <ReviewCard Icon={Folder} title="Тайлбар">
              <div>
                <p className="text-gray-500 text-sm">
                  {firstLetterUpper(values.description)}
                </p>
              </div>
            </ReviewCard>
          )}
        </div>
        <div className="flex pt-8 justify-between">
          {pre && pre > 0 ? (
            <div>
              <div className="flex items-center gap-2">
                <Wallet size={14} color="#6B7280" />
                <p className="text-sm text-gray-500">Урьдчилгаа</p>
              </div>
              <p className="text-md">{money(pre.toString())}₮</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <Clock size={14} color="#6B7280" />
                <p className="text-sm text-gray-500">Нийт хугацаа</p>
              </div>
              <p className="text-md">{duration} мин</p>
            </div>
          )}
          <div className="flex flex-col items-end">
            <p className="text-sm text-gray-500">Үндсэн үнэ</p>
            <p className="text-md">{money(subtotal.toString())}₮</p>
            {discount > 0 && (
              <>
                <p className="mt-1 text-sm text-gray-500">Voucher хөнгөлөлт</p>
                <p className="text-md text-rose-600">-{money(discount)}₮</p>
              </>
            )}
            <p className="mt-1 text-sm text-gray-500">Төлөх дүн</p>
            <p className="text-lg">{money(finalTotal.toString())}₮</p>
          </div>
        </div>
      </div>
    </div>
  );
}
