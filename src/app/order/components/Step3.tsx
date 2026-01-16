"use client";
import { Button } from "@heroui/button";
import { ArrowRight, User2, XIcon } from "lucide-react";
import { IOrder, IOrderDetail, Service, User } from "@/models";
import { MapType } from "@/lib/const";
import { firstLetterUpper, money } from "@/lib/functions";
import { ArtistCard } from "@/components/card";
import { OrderSlot, ParallelOrderSlot } from "@/models/slot.model";

interface Step3Props {
  showError: boolean;
  values: {
    details: IOrderDetail[];
    users: Record<string, string>;
    parallel: boolean;
    order_date?: Date | string;
    start_time?: string;
  };
  slots: OrderSlot;

  // eniig hiine
  users: MapType<User>;
  services: MapType<Service>;
  onChange: <K extends keyof IOrder>(key: K, value: IOrder[K]) => void;
  // clearError: (field: string) => void;
}

export default function Step3({
  // date,
  onChange,
  users,
  slots,
  showError,
  services,
  values,
  // clearError,
}: Step3Props) {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <p className="font-medium ">Артист сонгох </p>
        {/* <p className="text-gray-500 text-xs">
          Артистаа сонгох эсвэл автоматаар хуваарилах боломжтой.
        </p> */}
      </div>
      {Object.keys(values.users).length === 0 ? (
        <div className="w-full  border-rose-400/50 flex justify-center items-center border bg-rose-100/50 rounded-sm h-[60px]">
          <p className="text-sm text-gray-500 px-2 py-2 text-center">
            Артист сонгогдоогүй байна.
          </p>
        </div>
      ) : (
        <div className="flex justify-between">
          <p className="text-sm text-gray-500">
            Бүх үйлчилгээнд нэг артист сонгогдсон
          </p>
          <Button
            onClick={() => onChange("users", {})}
            startContent={<XIcon size={14} />}
            color="primary"
            size="sm"
            variant="light"
            className="text-rose-500"
          >
            Цэвэрлэх
          </Button>
        </div>
      )}
      {!values.parallel && (
        <div className="grid grid-cols-6 gap-4">
          {Array.from(new Set(Object.values(slots).flat())).map(
            (artistId, index) => {
              const key = "0";
              const artist = users[artistId];
              const selected = values.users[key] == artistId;
              return (
                <ArtistCard
                  data={artist}
                  onClick={(id: string) => {
                    if (!selected) {
                      onChange("users", { ...values.users, [key]: id });
                    }
                  }}
                  selected={selected}
                  key={index}
                />
              );
            }
          )}{" "}
        </div>
      )}
      {values.parallel &&
        Object.entries(slots).map(([serviceId, artists], i) => {
          const service = services[serviceId];
          const key = serviceId ?? "";
          const selectedUserId = values.users[key];
          const selectedUser = selectedUserId ? users[selectedUserId] : null;

          return (
            <div className="flex w-full gap-3" key={i}>
              <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200">
                <span>{i + 1}</span>
              </div>
              <div className="w-full">
                <div className="flex w-full mb-2 justify-between items-center">
                  <div>
                    <p className="text-sm">{service.name}</p>
                    <p className="text-xs text-gray-300">
                      {service.duration && `${service.duration} мин • `}
                      {money(
                        (service?.min_price ?? 0).toString(),
                        "",
                        1,
                        service.max_price ? 2 : undefined
                      )}
                      {service.max_price &&
                        ` - ${money(service.max_price.toString(), "", 1, 2)}`}
                    </p>
                  </div>
                  {selectedUser && (
                    <div className="flex gap-3 items-center">
                      <span>
                        <ArrowRight size={14} />
                      </span>
                      <span className="bg-gray-100 px-3 py-1 flex gap-2 items-center rounded-xl">
                        <User2 size={14} color="gray" />
                        {firstLetterUpper(selectedUser.nickname ?? "")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-6 gap-3">
                  {artists.map((artistId, index) => {
                    const prevKey = Object.keys(values.users).find(
                      (k) => k != artistId
                    );
                    const user = users[artistId];
                    const prevArtistId = prevKey ? values.users[prevKey] : null;

                    const selected = values.users[serviceId] == artistId;
                    console.log(user);
                    return (
                      <ArtistCard
                        mini={true}
                        data={user}
                        onClick={(id: string) => {
                          if (!selected) {
                            const current = Object.entries(values.users).some(
                              ([k, v]) => k != key && v == id
                            );
                            current
                              ? onChange("users", {
                                  [key]: id,
                                })
                              : onChange("users", {
                                  ...values.users,
                                  [key]: id,
                                });
                          }
                        }}
                        selected={selected}
                        disabled={false}
                        key={index}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      {/* {values.parallel
        ? values.details.map((v, i) => {
            const key = v.service_id ?? "";
            const selectedUser =
              users.items.filter((user) => user.id == values.users[key])?.[0] ??
              null;
            return (
              <div className="flex w-full gap-3" key={i}>
                <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200">
                  <span>{i + 1}</span>
                </div>
                <div className="w-full">
                  <div className="flex w-full mb-2 justify-between items-center">
                    <div>
                      <p className="text-sm">{v.service_name}</p>
                      <p className="text-xs text-gray-300">
                        {v.duration && `${v.duration} мин • `}
                        {money(
                          (v?.min_price ?? 0).toString(),
                          "",
                          1,
                          v.max_price ? 2 : undefined
                        )}
                        {v.max_price &&
                          ` - ${money(v.max_price.toString(), "", 1, 2)}`}
                      </p>
                    </div>
                    {selectedUser && (
                      <div className="flex gap-3 items-center">
                        <span>
                          <ArrowRight size={14} />
                        </span>
                        <span className="bg-gray-100 px-3 py-1 flex gap-2 items-center rounded-xl">
                          <User2 size={14} color="gray" />
                          {firstLetterUpper(selectedUser.nickname ?? "")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {slots.map((slot) => {
                      const selected = (values.users[key] = slot.artists);
                    })}
                    {userServices
                      .filter((u) => u.service_id == v.service_id)
                      .map((user, index) => {
                        const selected =
                          values.users[key] == user?.user?.id &&
                          key == v.service_id;
                        const prevKey = Object.keys(values.users).find(
                          (k) => k != key
                        );
                        const prevArtistId = prevKey
                          ? values.users[prevKey]
                          : null;
                        let parallel = true;
                        if (prevArtistId) {
                          const prevArtist = userServices.find(
                            (u) => u.user?.id == prevArtistId
                          );
                          // if (prevArtist)
                          //   parallel = hasOverlap(prevArtist.slots, user.slots);
                        }

                        // өөр service-д давхцахгүй эсэхийг шалгана
                        const disabled =
                          Object.entries(values.users).some(
                            ([k, v]) => k != key && v == user.user?.id
                          ) || !parallel;
                        return (
                          <ArtistCard
                            mini={true}
                            data={user.user!}
                            onClick={(id: string) => {
                              if (!selected && !disabled) {
                                onChange("users", {
                                  ...values.users,
                                  [key]: id,
                                });
                              }
                            }}
                            selected={selected}
                            disabled={disabled}
                            key={index}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })
        : [""].map((v, i) => {
            return (
              <div className="grid grid-cols-6 gap-4" key={i}>
                {userServices.map((user, index) => {
                  const key = "0";
                  const selected = values.users[key] == user.user?.id;
                  if (user.user)
                    return (
                      <ArtistCard
                        data={user.user}
                        onClick={(id: string) => {
                          if (!selected) {
                            onChange("users", { ...values.users, [key]: id });
                          }
                        }}
                        selected={selected}
                        key={index}
                      />
                    );
                })}
              </div>
            );
          })} */}
    </div>
  );
}
