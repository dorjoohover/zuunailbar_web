import { money } from "@/lib/functions";
import { Branch, Service, User } from "@/models";
import { Api } from "@/utils/api";
import { Checkbox } from "@heroui/checkbox";
import { Clock, LocationEdit, Users } from "lucide-react";
import Image from "next/image";
import CustomImage from "./image";
import { ReactNode } from "react";
export const LocationCard = ({
  data,
  selected,
  onClick,
}: {
  onClick: (id: string) => void;
  data: Branch;
  selected: boolean;
}) => {
  return (
    <div
      className={`h-[80px] flex flex-col w-full cursor-pointer justify-between rounded-sm p-4 border ${selected ? "border-black bg-[#00000030]" : "border-gray-500"}`}
      onClick={() => onClick(data.id)}
    >
      <h2 className="text-sm font-medium">{data.name}</h2>
      <p className="text-gray-500 text-sm">{data.address}</p>
    </div>
  );
};

export const ServiceCard = ({
  onClick,
  selected,
  data,
}: {
  data: Service;
  onClick: (id: string) => void;
  selected: boolean;
}) => {
  return (
    <div
      className={`h-[90px] col-span-1 flex justify-between w-full cursor-pointer justify-between rounded-sm p-4 border ${selected ? "border-black bg-[#00000030]" : "border-gray-500"}`}
      onClick={() => onClick(data.id)}
    >
      <div className="flex items-start">
        <Checkbox
          isSelected={selected}
          onChange={() => onClick(data.id)}
          size="sm"
          color="default"
        ></Checkbox>
        <div>
          <h2 className="text-sm font-medium mb-1 min-h-[2.4em]">
            {data.name}
          </h2>
          <p className="text-gray-500 text-sm">{data.description}</p>
          <div className="flex gap-2">
            <div className="flex gap-0.5 py-1">
              <Clock size={15} />
              <p className="text-xs">{data.duration} мин</p>
            </div>
            {data.duplicated && (
              <div className="flex gap-0.5 px-2 py-1 rounded-xl bg-gray-200 ">
                <Users size={15} />
                <p className="text-xs">зэрэг хийж болох</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-md font-bolder whitespace-nowrap">
        {money(
          data.min_price.toString(),
          "",
          1,
          data.max_price ? 2 : undefined
        )}
        {data.max_price && ` - ${money(data.max_price.toString(), "", 1, 2)}`}₮
      </p>
    </div>
  );
};

export const ArtistCard = ({
  data,
  onClick,
  selected,
  disabled,
  mini = false,
}: {
  data: User;
  mini?: boolean;
  onClick: (id: string) => void;
  selected: boolean;
  disabled?: boolean;
}) => {
  if (mini)
    return (
      <div
        className={`h-[60px] col-span-1 flex justify-between w-full cursor-pointer justify-between rounded-sm p-2 border ${disabled ? "border-black bg-[#00000030] opacity-50" : selected ? "border-black bg-[#00000030]" : "border-gray-500"} duration-300 ease-out hover:shadow-lg transition-shadow`}
        onClick={() => onClick(data.id)}
      >
        <div className="flex items-start gap-2">
          <div className="w-[40px] h-[40px]">
            <CustomImage img={data.profile_img} w={40} h={40} />
          </div>
          <div>
            <h2 className="text-sm font-medium mb-1">{data.nickname}</h2>
            <p className="text-gray-500 text-sm">{data.description}</p>
            <div className="flex gap-2">
              {/* <div className="flex gap-0.5 py-1">
              <Clock size={15} />
              <p className="text-xs">{data.duration} мин</p>
            </div> */}
              {data.experience && (
                <div className="flex gap-0.5 px-2 py-0.5 rounded-xl bg-gray-200 ">
                  <p className="text-xs">{data.experience} жил</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div
      className={`h-[80px] col-span-1 flex justify-between w-full cursor-pointer justify-between rounded-sm p-4 border ${selected ? "border-black bg-[#00000030]" : "border-gray-500"} duration-300 ease-out hover:shadow-lg transition-shadow`}
      onClick={() => onClick(data.id)}
    >
      <div className="flex items-start gap-2">
        <div className="w-[50px] h-[50px]">
          <CustomImage img={data.profile_img} />
        </div>
        <div>
          <h2 className="text-sm font-medium mb-1">{data.nickname}</h2>
          <p className="text-gray-500 text-sm">{data.description}</p>
          <div className="flex gap-2">
            {/* <div className="flex gap-0.5 py-1">
              <Clock size={15} />
              <p className="text-xs">{data.duration} мин</p>
            </div> */}
            {data.experience && (
              <div className="flex gap-0.5 px-2 py-1 rounded-xl bg-gray-200 ">
                <p className="text-xs">{data.experience} жил</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReviewCard = ({
  Icon,
  bold,
  title,
  children,
}: {
  bold?: boolean;
  title: string;
  Icon: typeof LocationEdit;
  children: ReactNode;
}) => {
  return (
    <div className="border-b  border-gray-300 py-3 flex w-full items-start justify-start gap-3">
      <span className="w-[35px] h-[35px] rounded-full flex items-center justify-center bg-gray-200">
        <Icon size={18}  color="#242526"/>
      </span>
      <div className="w-full">
        <p className={`text-md ${bold && "font-bolder"}`}>{title}</p>
        {children}
      </div>
    </div>
  );
};
