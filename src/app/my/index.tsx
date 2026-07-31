"use client";
import { OrderCard } from "@/components/card";
import { getEnumValues, ListType, OrderStatusValues } from "@/lib/const";
import { OrderStatus } from "@/lib/constants";
import { firstLetterUpper, money, parseDate } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { Order } from "@/models";
import { find } from "@/app/(api)";
import { PaymentView } from "@/app/order/components/payment";
import { Invoice } from "@/types";
import { Api } from "@/utils/api";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import {
  Building,
  Calendar,
  Calendar1,
  CalendarCheck,
  CalendarX,
  CircleCheck,
  Clock,
  Clock4,
  PiggyBank,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { addToast } from "@heroui/toast";

export const MyOrderPage = ({
  data,
  params,
}: {
  data: ListType<Order>;
  params?: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const invisibleStatus = [OrderStatus.Friend];
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const view = async (id: string) => {
    setSelectedOrder(data.items.filter((d) => d.id == id)[0]);
    onOpen();
  };
  const openPayment = async (order: Order, close?: () => void) => {
    if (paymentLoading) return;
    setPaymentLoading(true);
    try {
      const res = await find<Invoice>(Api.order, {}, `payment/${order.id}`);
      const payload = res.data as any;

      if (payload?.paid) {
        addToast({
          title: "Төлбөр төлөгдсөн байна.",
          timeout: 3000,
        });
        router.push(`${pathname}?status=${OrderStatus.Active}`);
        router.refresh();
        close?.();
        return;
      }

      if (payload?.expired) {
        addToast({
          title: "Төлбөрийн 10 минутын хугацаа дууссан байна.",
          timeout: 3000,
          color: "warning",
        });
        router.push(`${pathname}?status=${OrderStatus.ABSENT}`);
        router.refresh();
        close?.();
        return;
      }

      if (payload?.payment_check_unavailable) {
        addToast({
          title: "Төлбөрийн төлөв шалгаж чадсангүй. Түр хүлээгээд дахин оролдоно уу.",
          timeout: 3000,
          color: "warning",
        });
        return;
      }

      if (!payload?.invoice_id) {
        addToast({
          title: "Төлөх боломжтой QPay нэхэмжлэл олдсонгүй.",
          timeout: 3000,
          color: "warning",
        });
        return;
      }

      setPaymentInvoice({
        ...payload,
        price: Number(payload.price ?? order.pre_amount ?? 0),
        created: payload.created ?? new Date(),
        status: payload.status ?? OrderStatus.Pending,
        urls: payload.urls ?? [],
      });
      setPaymentOrderId(order.id);
      close?.();
    } finally {
      setPaymentLoading(false);
    }
  };

  if (paymentInvoice && paymentOrderId) {
    return (
      <PaymentView
        invoice={paymentInvoice}
        id={paymentOrderId}
        redirectTo={`${pathname}?status=${OrderStatus.Active}`}
        cancelRedirectTo={`${pathname}?status=${OrderStatus.ABSENT}`}
      />
    );
  }

  return (
    <div className="max-w-6xl mt-14 mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="mb-6">
        <h2 className="text-gray-900">Захиалгууд</h2>
      </div>

      <div className="grid grid-cols-5 gap-4 max-w-7xl mb-10">
        {getEnumValues(OrderStatus).map((status, i) => {
          if (invisibleStatus.includes(status)) return;
          return (
            <Link
              key={i}
              href={`${pathname}?status=${status}`}
              className={cn(
                "px-4 py-2 text-center  text-sm rounded-md hover:bg-500/50 transition-all duration-300 bg-rose-300 text-white",
                (params ?? `${OrderStatus.Active}`)?.includes(status.toString())
                  ? "bg-rose-500"
                  : "",
              )}
            >
              {OrderStatusValues[status]}
            </Link>
          );
        })}
      </div>
      {!data?.items ||
        (data.items.length == 0 && (
          <div className="w-full text-center py-10">Захиалга олдсонгүй</div>
        ))}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {data?.items.map((order) => (
          <div
            key={order.id}
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              view(order.id);
            }}
          >
            <OrderCard data={order} />
          </div>
        ))}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="">
          {(onClose) => {
            const total = selectedOrder?.total_amount
              ? `${money(selectedOrder.total_amount)}₮`
              : "Тооцогдоогүй";
            const paid = selectedOrder?.paid_amount
              ? `${money(selectedOrder.paid_amount)}₮`
              : "Тооцогдоогүй";
            const pre = selectedOrder?.pre_amount
              ? `${money(selectedOrder.pre_amount)}₮`
              : "Тооцогдоогүй";
            const voucherDiscount = Number(selectedOrder?.discount ?? 0);
            const canPayPreAmount =
              selectedOrder?.order_status === OrderStatus.Pending &&
              !selectedOrder?.is_pre_amount_paid &&
              Number(selectedOrder?.pre_amount ?? 0) > 0;
            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Захиалгын дэлгэрэнгүй
                </ModalHeader>

                <ModalBody className="space-y-2">
                  <div className="">Салбарын мэдээлэл</div>
                  <div className="mb-4 bg-secondary rounded-sm px-3 py-2">
                    <p className="text-sm text-muted-foreground mb-1">
                      Салбарын нэр
                    </p>
                    <span className="flex gap-2 items-center">
                      <Building className="text-primary" size={20} />
                      {selectedOrder?.details?.[0]?.branch_name}
                    </span>
                  </div>
                  <div>
                    <div>Үйлчилгээний дэлгэрэнгүй</div>
                    {selectedOrder?.details?.map((detail, i) => {
                      return (
                        <div
                          key={i}
                          className="mb-4 bg-secondary rounded-sm px-3 py-2 my-4"
                        >
                          <div className="mb-2">
                            <p className="text-sm text-muted-foreground mb-1 ">
                              Үйлчилгээний нэр
                            </p>
                            <p className="text-medium">{detail.service_name}</p>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm text-muted-foreground mb-1">
                              <p className="text-sm text-muted-foreground mb-1">
                                Цаг захиалга хийсэн огноо
                              </p>
                            </p>

                            <p className="flex gap-2 items-center ">
                              <Calendar className="text-primary" size={20} />
                              {selectedOrder.order_date}
                            </p>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm text-muted-foreground mb-1">
                              Эхлэх цаг
                            </p>

                            <p className="flex gap-2 items-center ">
                              <Clock4 className="text-primary" size={20} />
                              {(detail.start_time ?? selectedOrder?.start_time)?.slice(0, 5) ?? "-"}
                            </p>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm text-muted-foreground mb-1">
                              Артист
                            </p>
                            <div>
                              <p className="flex gap-2 items-center">
                                <User className="text-primary" size={20} />
                                {firstLetterUpper(detail?.nickname ?? '-')}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div>
                      <div className="mb-4">Төлбөр</div>
                      <div className="bg-secondary mb-4 bg-secondary rounded-sm px-3 py-2">
                        <div className="mb-2">
                          <p className="text-sm text-muted-foreground flex gap-2 items-center ">
                            <Wallet className="text-primary" size={20} />
                            Нийт төлбөр
                          </p>
                          <span>{total}</span>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm text-muted-foreground flex gap-2 items-center ">
                            <CircleCheck className="text-primary" size={20} />
                            Гүйцээж төлсөн төлбөр
                          </p>
                          <span>{paid}</span>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm text-muted-foreground flex gap-2 items-center ">
                            <PiggyBank className="text-primary" size={20} />
                            Урьдчилгаа төлбөр
                          </p>
                          <span>{pre}</span>
                        </div>
                        {selectedOrder?.voucher_name && (
                          <div className="mb-2">
                            <p className="text-sm text-muted-foreground flex gap-2 items-center ">
                              <Wallet className="text-primary" size={20} />
                              Урамшуулал
                            </p>
                            <span>
                              {selectedOrder.voucher_name}
                              {voucherDiscount > 0
                                ? ` (-${money(voucherDiscount)}₮)`
                                : ""}
                            </span>
                          </div>
                        )}
                        <div className="mb-2">
                          <p className="text-sm text-muted-foreground flex gap-2 items-center ">
                            <Calendar1 className="text-primary" size={20} />
                            Цаг захиалга үүсгэсэн огноо
                          </p>
                          <span>
                            {parseDate(
                              new Date(
                                selectedOrder?.created_at as unknown as string,
                              ),
                              true,
                            )}
                          </span>
                        </div>
                        {selectedOrder?.updated_at && (
                          <div className="mb-2">
                            
                            <p className="text-sm text-muted-foreground flex gap-2 items-center ">
                              {(selectedOrder.order_status ==
                                OrderStatus.Active || selectedOrder.order_status == OrderStatus.Finished) && (
                                <CalendarCheck
                                  className="text-primary"
                                  size={20}
                                />
                              )}
                              {selectedOrder.order_status ==
                                OrderStatus.Cancelled && (
                                <CalendarX className="text-primary" size={20} />
                              )}
                              {selectedOrder.order_status ==
                              OrderStatus.Cancelled
                                ? "Цаг цуцлагдсан огноо"
                                : selectedOrder.order_status ==
                                    OrderStatus.Active
                                  ? "Төлбөр төлж баталгаажсан огноо"
                                  : "Дууссан огноо"}
                             
                            </p>
                            <span>
                              {parseDate(
                                new Date(selectedOrder?.updated_at.toString()),
                                true,
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                      {canPayPreAmount && selectedOrder && (
                        <button
                          className="mb-4 w-full rounded-md bg-rose-500 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={paymentLoading}
                          onClick={() => void openPayment(selectedOrder, onClose)}
                        >
                          {paymentLoading
                            ? "QPay нээж байна..."
                            : "QPay-р урьдчилгаа төлөх"}
                        </button>
                      )}
                    </div>
                  </div>
                </ModalBody>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </div>
  );
};
