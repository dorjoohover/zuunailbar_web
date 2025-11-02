"use client";
import { OrderCard } from "@/components/card";
import { ListType } from "@/lib/const";
import { Order } from "@/models";

export const MyOrderPage = ({ data }: { data: ListType<Order> }) => {
  return (
    <div className="max-w-6xl mt-14 mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="mb-6">
        <h2 className="text-gray-900">Захиалгууд</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {data?.items.map((order) => <OrderCard data={order} key={order.id} />)}
      </div>
    </div>
  );
};
