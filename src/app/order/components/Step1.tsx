"use client";

import { LocationCard, ServiceCard } from "@/components/card";
import { ListType } from "@/lib/const";
import { money } from "@/lib/functions";
import { Branch, IOrder, Service } from "@/models";
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
}

export default function Step1({
  branches,
  onChange,
  services,
  values,
  errors,
  showError,
}: Step1Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [chosen, setChosen] = useState<
    {
      service_id: string;
      service_name: string;
      duration: number;
      max_price: number;
      min_price: number;
      duplicated: boolean;
      pre: number;
    }[]
  >([]);
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
                      let prev = false;
                      const updatedDetail = updatedDetails?.map((v) => {
                        const value = services.items.filter(
                          (s) => s.id == v
                        )[0];
                        if (
                          value.duplicated &&
                          details.length > 0 &&
                          id == value.id
                        )
                          prev = true;
                        return {
                          service_id: v,
                          service_name: value.name ?? "",
                          duration: value.duration,
                          max_price: value.max_price,
                          min_price: value.min_price,
                          duplicated: value.duplicated,
                          pre: value.pre,
                          category: value.category,
                        };
                      });
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
        <div className="w-full  bg-gray-100 flex justify-center items-center border border-gray-300 rounded-sm h-[70px]">
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
                  onPress={() => {
                    onChange("duplicated", false);
                    onChange("details", chosen);
                    onClose();
                  }}
                >
                  Дарааллаар
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onChange("duplicated", true);
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
    <div className="border w-full border-gray-500 bg-gray-100 px-2.5 py-2 rounded-md flex justify-between">
      <p className="text-sm">{values.length} Үйлчилгээ</p>
      <p>Нийт: {totalDisplay}₮</p>
    </div>
  );
};
