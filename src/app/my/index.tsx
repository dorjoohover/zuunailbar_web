"use client";
import { OrderCard } from "@/components/card";
import { getEnumValues, ListType, OrderStatusValues } from "@/lib/const";
import { OrderStatus } from "@/lib/constants";
import { money } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { Order } from "@/models";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import {
  Building,
  CircleCheck,
  Clock,
  Clock4,
  PiggyBank,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export const MyOrderPage = ({
  data,
  params,
}: {
  data: ListType<Order>;
  params?: string;
}) => {
  const pathname = usePathname();
  const invisibleStatus = [OrderStatus.Cancelled, OrderStatus.Friend];
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const view = async (id: string) => {
    setSelectedOrder(data.items.filter((d) => d.id == id)[0]);
    onOpen();
  };
  return (
    <div className="max-w-6xl mt-14 mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="mb-6">
        <h2 className="text-gray-900">Захиалгууд</h2>
      </div>
      <div className="grid grid-cols-4 gap-4 max-w-7xl mb-10">
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
                  : ""
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
            onClick={() => view(order.id)}
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
                      {selectedOrder?.details?.[0]?.user?.branch_name}
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
                              Эхлэх цаг
                            </p>
                            <p className="flex gap-2 items-center ">
                              <Clock4 className="text-primary" size={20} />
                              {detail.start_time?.slice(0, 5)}
                            </p>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm text-muted-foreground mb-1">
                              Артист
                            </p>
                            <div>
                              <p className="flex gap-2 items-center">
                                <User className="text-primary" size={20} />
                                {detail.user?.nickname}
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
                      </div>
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
