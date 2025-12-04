"use client";

import { LocationCard, ServiceCard } from "@/components/card";
import { button, ListType } from "@/lib/const";
import { money } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { Branch, BranchService, IOrder, Service } from "@/models";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { useState } from "react";

interface Step1Props {
  branches: ListType<Branch>;
  services: ListType<Service>;
  onChange: <K extends keyof IOrder>(key: K, value: IOrder[K]) => void;
  errors: { branch?: string; service?: string };
  values: { branch?: string; services?: string[] };
  showError: boolean;
  branch_services: ListType<BranchService>;
}

export default function Step1({
  branches,
  onChange,
  services,
  values,
  branch_services,
  errors,
  showError,
}: Step1Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [chosen, setChosen] = useState<
    {
      service_id?: string;
      service_name?: string;
      duration?: number;
      max_price?: number;
      min_price?: number;
      parallel?: boolean;
      pre?: number;
    }[]
  >([]);
  const filteredServices = branch_services.items.filter(
    (service) => service.branch_id == values.branch
  );
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4 ">
      <div className="flex flex-col xs:flex-row justify-between w-full gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
            {filteredServices.map((service, i) => {
              const details = values.services as string[];
              const selected = details?.includes(service.service_id) ?? false;
              return (
                <ServiceCard
                  key={i}
                  data={service}
                  onClick={(id: string) => {
                    let updatedDetails = selected
                      ? details.filter((u) => u != id)
                      : [...details, id];
                    let prev = false;
                    const updatedDetail = updatedDetails?.map((v) => {
                      const value = services.items.filter((s) => s.id == v)[0];
                      return {
                        service_id: v,
                        service_name: value.name ?? "",
                        duration: value.duration,
                        max_price: value.max_price,
                        min_price: value.min_price,
                        pre: value.pre,
                        category_id: value.category_id,
                      };
                    });
                    const categoryIds = updatedDetail.map((a) => a.category_id);
                    const allSame = new Set(categoryIds).size === 1;
                    if (updatedDetail.length > 1 && allSame) {
                      addToast({
                        title: "Ижил төрлийн үйлчилгээ зэрэг авах боломжгүй",
                      });
                      return;
                    }
                    if (updatedDetail.length > 1) {
                      prev = true;
                    }
                    if (updatedDetail.length > 2) {
                      addToast({
                        title: "Хамгийн ихдээ 2 үйлчилгээ сонгоно уу.",
                      });
                      return;
                    }
                    if (prev) {
                      onOpen();
                      setChosen(updatedDetail);
                    } else {
                      setChosen(updatedDetail);
                      onChange("details", updatedDetail);
                    }
                  }}
                  selected={selected}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="w-full  bg-rose-100/50 flex justify-center items-center border border-rose-400/50 rounded-sm h-[70px]">
          <p className="text-sm text-gray-500">Салбараа сонгоно уу</p>
        </div>
      )}
      {errors.service && showError && errors.branch == undefined && (
        <p className="mt-1 text-sm text-red-600">{errors.service}</p>
      )}
      {values.services && values.services.length > 0 && (
        <Price services={services.items} values={values.services} />
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Та зэрэг үйлчилгээ авах боломжтой
              </ModalHeader>
              <ModalBody>
                <p>
                  Эдгээр үйлчилгээг хоёр артист нэгэн зэрэг хийж болно. Та
                  үйлчилгээг зэрэг үйлчлүүлэх (түргэн) эсвэл дарааллаар
                  үйлчлүүлэх (нэг нэгээр нь) байдлаар авах уу?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="bordered"
                  className="border border-rose-600 rounded-md text-rose-500"
                  onPress={() => {
                    onChange("parallel", false);
                    onChange("details", chosen);
                    onClose();
                  }}
                >
                  Дарааллаар
                </Button>
                <Button
                  color="primary"
                  className={cn(button, 'rounded-md')}
                  onPress={() => {
                    onChange("parallel", true);
                    onClose();
                    onChange("details", chosen);
                  }}
                >
                  Зэрэг (2 артист)
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
    <div className="border w-full border-rose-400/50 bg-rose-100/50 px-2.5 py-2 rounded-md flex justify-between">
      <p className="text-sm">{values.length} Үйлчилгээ</p>
      <p>Нийт: {totalDisplay}₮</p>
    </div>
  );
};
