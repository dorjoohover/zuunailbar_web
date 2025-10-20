"use client";

import { LocationCard, ServiceCard } from "@/components/card";
import { ListType } from "@/lib/const";
import { money } from "@/lib/functions";
import { Branch, IOrder, Service } from "@/models";
import { Select, SelectItem } from "@heroui/select";

interface Step1Props {
  branches: ListType<Branch>;
  services: ListType<Service>;
  onChange: <K extends keyof IOrder>(key: K, value: IOrder[K]) => void;
  errors: { branch?: string; service?: string };
  values: { branch?: string; services?: string[] };
  showError: boolean;
}

export default function Step1({
  branches,
  onChange,
  services,
  values,
  errors,
  showError,
}: Step1Props) {
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4 ">
      <div className="flex justify-between w-full gap-4">
        {branches.items.map((branch, i) => {
          return (
            <LocationCard
              data={branch}
              selected={branch.id == values.branch}
              onClick={(id: string) => {
                onChange("branch_id", id);
                onChange("details", []);
              }}
              key={i}
            />
          );
        })}
      </div>
      {values.branch ? (
        <div className="pt-6 w-full">
          <p className="font-medium mb-2">Үйлчилгээ сонгох</p>
          <div className="grid grid-cols-2 w-full gap-4">
            {services.items
              .filter((service) => service.branch_id == values.branch)
              .map((service, i) => {
                const details = values.services as string[];
                const selected = details?.includes(service.id) ?? false;
                return (
                  <ServiceCard
                    key={i}
                    data={service}
                    onClick={(id: string) => {
                      let updatedDetails = selected
                        ? details.filter((u) => u != id)
                        : [...details, id];
                      const updatedDetail = updatedDetails?.map((v) => {
                        const value = services.items.filter(
                          (s) => s.id == v
                        )[0];
                        return {
                          service_id: v,
                          service_name: value.name ?? "",
                          duration: value.duration,
                          max_price: value.max_price,
                          min_price: value.min_price,
                          duplicated: value.duplicated,
                          pre: value.pre,
                        };
                      });

                      onChange("details", updatedDetail);
                    }}
                    selected={selected}
                  />
                );
              })}
          </div>
        </div>
      ) : (
        <div className="w-full  bg-gray-100 flex justify-center items-center border border-gray-300 rounded-sm h-[70px]">
          <p className="text-sm text-gray-500">Салбараа сонгоно уу</p>
        </div>
      )}

      {values.services && values.services.length > 0 && (
        <Price services={services.items} values={values.services} />
      )}
    </div>
  );
}
export const totalPrice = ({
  services,
  values,
}: {
  services: Service[];
  values: string[];
}) => {
  const selectedServices = services.filter((s) => values.includes(s.id));

  // Нийт min
  const totalMin = selectedServices.reduce((sum, s) => sum + +s.min_price, 0);

  // Нийт max
  const totalMax = selectedServices.reduce(
    (sum, s) => sum + +(s.max_price ?? s.min_price),
    0
  );

  // Дисплейд
  const totalDisplay =
    totalMin === totalMax
      ? money(totalMin.toString())
      : `${money(totalMin.toString())} - ${money(totalMax.toString())}`;
  return totalDisplay;
};

const Price = ({
  services,
  values,
}: {
  services: Service[];
  values: string[];
}) => {
  const totalDisplay = totalPrice({ services: services, values: values });

  return (
    <div className="border w-full border-gray-500 bg-gray-100 px-2.5 py-2 rounded-md flex justify-between">
      <p className="text-sm">{values.length} Үйлчилгээ</p>
      <p>Нийт: {totalDisplay}₮</p>
    </div>
  );
};
