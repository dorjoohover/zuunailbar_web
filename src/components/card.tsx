import { getDayName, money } from "@/lib/functions";
import { Branch, BranchService, Order, Service, User } from "@/models";
import { Api } from "@/utils/api";
import { Checkbox } from "@heroui/checkbox";
import { Calendar, Clock, DollarSign, LocationEdit, Users } from "lucide-react";
import Image from "next/image";
import CustomImage from "./image";
import { ReactNode } from "react";
import { OrderStatus } from "@/lib/constants";
import { mnDate } from "@/lib/const";
import { cn } from "@/lib/utils";
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
      className={`h-[80px] flex flex-col w-full cursor-pointer justify-between rounded-sm p-4 border ${selected ? "border-rose-600/50 border-2 bg-rose-100/50" : "border-border hover:border-rose-400/50"}`}
      onClick={() => onClick(data.id)}
    >
      <h2 className="text-sm font-medium">{data.name}</h2>
      <p className="text-muted-foreground text-sm">{data.address}</p>
    </div>
  );
};

export const ServiceCard = ({
  onClick,
  selected,
  data,
}: {
  data: BranchService;
  onClick: (id: string) => void;
  selected: boolean;
}) => {
  return (
    <div
      className={cn(
        `col-span-1 flex justify-between items-start w-full cursor-pointer rounded-md p-4 border transition-all duration-200 ${
          data.meta?.categoryName?.toLowerCase() === "гар"
            ? "border-slate-200 bg-rose-50 hover:border-rose-200"
            : "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300"
        }`,
        selected ? "border-rose-600/50 border-2" : ""
      )}
      onClick={() => onClick(data.service_id)}
    >
      {/* Left Section */}
      <div className="flex items-start gap-2">
        <Checkbox
          isSelected={selected}
          onChange={() => onClick(data.service_id)}
          size="sm"
          color="default"
        />
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium">{data.meta?.serviceName}</h2>

          <p className="text-muted-foreground min-h-[1.6rem] leading-4 text-xs line-clamp-2">
            {data.meta?.description || "\u00A0"}
          </p>

          <div className="flex gap-2 mt-1">
            <div className="flex items-center gap-1 text-secondary-foreground">
              <Clock size={13} />
              <p className="text-xs">{data.duration} мин</p>
            </div>

            {/* {data.meta?.categoryName && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gray-200">
                <Users size={13} />
                <p className="text-xs">{data.meta?.categoryName}</p>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <p className="text-sm font-semibold whitespace-nowrap text-right">
        {money(
          data.min_price.toString(),
          "",
          1,
          data.max_price ? 2 : undefined
        )}
        {data.max_price &&
          data.max_price != data.min_price &&
          ` - ${money(data.max_price.toString(), "", 1, 2)}`}
        ₮
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
        className={`h-[60px] col-span-6 xs:col-span-3 md:col-span-2 flex justify-between w-full cursor-pointer justify-between rounded-sm p-2 border ${disabled ? "border-rose-400/50 bg-rose-100/50 opacity-50" : selected ? "border-rose-600/50 bg-rose-100/50" : "border-rose-50"} duration-300 ease-out hover:shadow-lg transition-shadow`}
        onClick={() => onClick(data.id)}
      >
        <div className="flex items-start gap-2">
          <div className="w-[40px] h-[40px]">
            <CustomImage img={data.profile_img} w={40} h={40} />
          </div>
          <div>
            <h2 className="text-sm font-medium mb-1">{data.nickname}</h2>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {data.description}
            </p>
            <div className="flex gap-2">
              {/* <div className="flex gap-0.5 py-1">
              <Clock size={15} />
              <p className="text-xs">{data.duration} мин</p>
            </div> */}
              {data.experience && (
                <div className="flex gap-0.5 px-2 py-0.5 rounded-xl bg-rose-200/50 ">
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
      className={`h-[60px] col-span-6 xs:col-span-3 md:col-span-2 flex justify-between w-full cursor-pointer justify-between rounded-sm p-2 border ${disabled ? "border-rose-400/50 bg-rose-100/50" : selected ? "border-rose-600/50 bg-rose-100/50" : "border-rose-100"} duration-300 ease-out hover:shadow-lg transition-shadow`}
      onClick={() => onClick(data.id)}
    >
      <div className="flex items-start gap-2">
        <div className="w-[50px] h-[50px]">
          <CustomImage img={data.profile_img} />
        </div>
        <div>
          <h2 className="text-sm font-medium mb-1">{data.nickname}</h2>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {data.description}
          </p>
          <div className="flex gap-2">
            {/* <div className="flex gap-0.5 py-1">
              <Clock size={15} />
              <p className="text-xs">{data.duration} мин</p>
            </div> */}
            {data.experience && (
              <div className="flex gap-0.5 px-2 py-1 rounded-xl bg-rose-200 ">
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
        <Icon size={18} color="#242526" />
      </span>
      <div className="w-full">
        <p className={`text-md ${bold && "font-bolder"}`}>{title}</p>
        {children}
      </div>
    </div>
  );
};

export const statusConfig = {
  [OrderStatus.Pending]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    label: "Урьдчилгаа төлөөгүй",
  },
  [OrderStatus.Active]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Урьдчилгаа төлсөн",
  },
  [OrderStatus.Finished]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    label: "Дууссан",
  },
  [OrderStatus.Cancelled]: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Цуцлагдсан",
  },
  [OrderStatus.ABSENT]: {
    bg: "bg-gray-100",
    text: "text-secondary-foreground",
    label: "Ирээгүй",
  },
  [OrderStatus.Friend]: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    label: "Танилын будалт",
  },
};

export function OrderCard({ data }: { data: Order }) {
  const {
    order_date,
    order_status,
    artist_name,
    start_time,
    end_time,
    description,
    total_amount,
  } = data;
  const config = statusConfig[order_status as OrderStatus];
  // Format date

  const artist = artist_name?.split(" ");
  const date = new Date(order_date);
  return (
    <div className="bg-white rounded-2xl h-full p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Artist Name */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-rose-600">{artist?.[0]}</h3>
        <div
          className={`inline-flex items-center px-2.5 py-1 rounded-full ${config.bg}`}
        >
          <span className={`text-xs ${config.text}`}>{config.label}</span>
        </div>
      </div>

      {/* Date and Time */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {getDayName(date.getDay() == 0 ? 7 : date.getDay())},{" "}
            {date.getMonth() + 1}-р сарын {date.getDate()}, {date.getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {start_time.slice(0, 5)} - {end_time.slice(0, 5)}
          </span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground mb-3 pb-3 border-b border-gray-100">
          {description}
        </p>
      )}

      {/* Amount */}
      <div className="flex items-center gap-1">
        <span className="text-gray-900">
          {money((total_amount ?? 0).toString())} ₮
        </span>
      </div>
    </div>
  );
}
