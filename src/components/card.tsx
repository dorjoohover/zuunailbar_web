import { money } from "@/lib/functions";
import { Branch, Service, User } from "@/models";
import { Api } from "@/utils/api";
import { Checkbox } from "@heroui/checkbox";
import { Clock, Users } from "lucide-react";
import Image from "next/image";
import CustomImage from "./image";
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
      className={`h-[80px] col-span-1 flex justify-between w-full cursor-pointer justify-between rounded-sm p-4 border ${selected ? "border-black bg-[#00000030]" : "border-gray-500"}`}
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
          <h2 className="text-sm font-medium mb-1">{data.name}</h2>
          <p className="text-gray-500 text-sm">{data.description}</p>
          <div className="flex gap-2">
            <div className="flex gap-0.5 py-1">
              <Clock size={15} />
              <p className="text-xs">{data.duration} мин</p>
            </div>
            {!data.duplicated && (
              <div className="flex gap-0.5 px-2 py-1 rounded-xl bg-gray-200 ">
                <Users size={15} />
                <p className="text-xs">зэрэг хийж болох</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-md font-bolder">
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
}: {
  data: User;
  onClick: (id: string) => void;
  selected: boolean;
}) => {
  return (
    <div
      className={`h-[80px] col-span-1 flex justify-between w-full cursor-pointer justify-between rounded-sm p-4 border ${selected ? "border-black bg-[#00000030]" : "border-gray-500"}`}
      onClick={() => onClick(data.id)}
    >
      <div className="flex items-start">
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
