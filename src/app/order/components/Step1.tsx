"use client";

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
      <Select
        label="Салбар сонгох"
        value={values.branch}
        onChange={(e) => {
          const value = e.target.value;

          if (value) onChange("branch_id", value);
        }}
        isInvalid={showError && !!errors.branch}
        errorMessage={errors.branch}
      >
        {branches.items.map((branch) => (
          <SelectItem className="text-white" key={branch.id}>
            {branch.name}
          </SelectItem>
        ))}
      </Select>

      <Select
        label="Үйлчилгээ сонгох"
        value={values.services}
        onChange={(e) => {
          const value = e.target.value;
          const values = value.split(",");
          value
            ? onChange(
                "details",
                values.map((v) => {
                  const service = services.items.filter((s) => s.id == v)?.[0];
                  return {
                    service_id: v,
                    service_name: service.name ?? "",
                    duration: service.duration,
                  };
                })
              )
            : onChange("details", []);
        }}
        selectionMode="multiple"
        isInvalid={showError && !!errors.service}
        errorMessage={errors.service}
      >
        {services.items.map((service) => (
          <SelectItem
            className="text-white"
            key={service.id}
          >{`${service.name} ${money(service.min_price.toString(), "₮")}${service.max_price ? ` - ${money(service.max_price.toString(), "₮")}` : ""}`}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
