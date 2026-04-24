import { firstLetterUpper, getDayName, money } from "@/lib/functions";
import { Branch, BranchService, Order, Service, User } from "@/models";
import { Api } from "@/utils/api";
import { Checkbox } from "@heroui/checkbox";
import {
  Calendar,
  Clock,
  DollarSign,
  LocationEdit,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import CustomImage from "./image";
import { ReactNode } from "react";
import { OrderStatus, UserLevel } from "@/lib/constants";
import { ActiveOrderStatuses, levelConfig, mnDate } from "@/lib/const";
import { cn } from "@/lib/utils";
import { AlertDialog } from "@/app/order/components/payment";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { find } from "@/app/(api)";
import { useRouter } from "next/navigation";
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
        selected ? "border-rose-600/50 border-2" : "",
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
          <h2 className="text-sm font-medium">
            {data.custom_name ?? data.meta?.serviceName}
          </h2>

          <p className="text-muted-foreground min-h-[1.6rem] leading-4 text-xs line-clamp-2">
            {data.custom_description ?? (data.meta?.description || "\u00A0")}
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
          data.max_price ? 2 : undefined,
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
      <button
        type="button"
        className={cn(
          "flex min-h-[88px] w-full items-start gap-3 rounded-2xl border bg-white p-3 text-left transition-all duration-200",
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-50"
            : "hover:-translate-y-0.5 hover:shadow-md",
          selected
            ? "border-rose-300 bg-rose-50 shadow-sm ring-2 ring-rose-100"
            : "border-rose-100",
        )}
        onClick={() => {
          if (!disabled) onClick(data.id);
        }}
      >
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <CustomImage
            img={data.profile_img}
            w={44}
            h={44}
            alt={data.nickname ?? "artist"}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-slate-900">
                {firstLetterUpper(data.nickname ?? "")}
              </h2>
              {data.branch_name && (
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {data.branch_name}
                </p>
              )}
            </div>
            {selected && (
              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                Сонгосон
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.experience != null && (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-700">
                {data.experience} жил
              </span>
            )}
            {data.level ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                {levelConfig[data.level as UserLevel]?.text ?? "Артист"}
              </span>
            ) : null}
          </div>
        </div>
      </button>
    );
  const level = data.level ? levelConfig[data.level as UserLevel] : null;
  return (
    <button
      type="button"
      className={cn(
        "col-span-6 xs:col-span-3 md:col-span-3 flex min-h-[112px] w-full items-start gap-4 rounded-3xl border bg-white p-4 text-left shadow-sm transition-all duration-200",
        disabled
          ? "cursor-not-allowed border-rose-200 bg-rose-50/60 opacity-60"
          : "hover:-translate-y-0.5 hover:shadow-lg",
        selected
          ? "border-rose-400 bg-rose-50 ring-2 ring-rose-100"
          : "border-rose-100",
      )}
      onClick={() => {
        if (!disabled) onClick(data.id);
      }}
    >
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 min-w-20 overflow-hidden rounded-2xl bg-slate-100">
          <CustomImage
            img={data.profile_img}
            w={80}
            h={80}
            alt={data.nickname ?? "artist"}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-slate-900">
                {firstLetterUpper(data.nickname ?? "")}
              </h2>
              {data.description && (
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {data.description}
                </p>
              )}
            </div>
            {selected && (
              <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white">
                Сонгосон
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {level && (
              <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
                {level.text}
              </span>
            )}
            {data.experience != null && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {data.experience} жил
              </span>
            )}
            {data.branch_name && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {data.branch_name}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
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
    label: "Урьдчилгаа төлбөр төлөөгүй тул цуцлагдсан",
  },
  [OrderStatus.ABSENT]: {
    bg: "bg-gray-100",
    text: "text-secondary-foreground",
    label: "Цуцалсан",
  },
  [OrderStatus.Friend]: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    label: "Танилын будалт",
  },
};

export function OrderCard({ data }: { data: Order }) {
  const router = useRouter();
  const cancel = async () => {
    const res = await find(Api.order, {}, `cancel/${data.id}`);
    addToast({
      title: `Захиалга амжилттай цуцлагдлаа.`, timeout: 3000
    });
    router.push("/");
  };
  const {
    order_date,
    order_status,
    artist_name,
    start_time,
    end_time,
    description,
    total_amount,
    pre_amount,
    voucher_name,
    discount,
  } = data;
  const config = statusConfig[order_status as OrderStatus];
  // Format date

  const artist = artist_name?.split(" ");
  const date = new Date(order_date);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="bg-white rounded-2xl group h-full p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <AlertDialog
        submit={() => {
          cancel();
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        text="Цаг цуцлах"
      >
        <div className="px-6">
          <p>
            Та захиалсан цагаа цуцалсан тохиолдолд урьдчилгаа төлбөр буцаан
            олгогдохгүй болохыг анхаарна уу. Та үүнийг зөвшөөрч байвал цаг
            цуцлах товчийг дарна уу?.
          </p>
        </div>
      </AlertDialog>
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

      {voucher_name && (
        <div className="mb-3 rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          Урамшуулал: {voucher_name}
          {Number(discount ?? 0) > 0 ? ` (-${money(discount ?? 0)}₮)` : ""}
        </div>
      )}

      {/* Amount */}
      <div className="flex items-center gap-1">
        <span className="text-gray-900">
          {money((total_amount ?? pre_amount ?? 0).toString())} ₮
        </span>
      </div>
      {ActiveOrderStatuses.includes(data.order_status) ? (
        <div className="flex justify-end">
          <button
            className="flex border-rose-500 border rounded-md px-2 py-1 bg-rose-50 text-rose-600 items-center cursor-pointer gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          >
            <X size={14} /> Цуцлах
          </button>
        </div>
      ) : null}
    </div>
  );
}
