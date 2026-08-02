"use client";
import { getEnumValues, ListType, OrderStatusValues, ActiveOrderStatuses, mnDate } from "@/lib/const";
import { OrderStatus } from "@/lib/constants";
import { firstLetterUpper, money } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { Order } from "@/models";
import { find } from "@/app/(api)";
import { PaymentView, AlertDialog } from "@/app/order/components/payment";
import { statusConfig } from "@/components/card";
import { Invoice } from "@/types";
import { Api } from "@/utils/api";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import {
  Building,
  Calendar,
  Calendar1,
  CalendarCheck,
  CalendarX,
  CheckCircle2,
  CircleCheck,
  Clock,
  CreditCard,
  PiggyBank,
  Scissors,
  Sparkles,
  Timer,
  User,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addToast } from "@heroui/toast";

/* ─── Helpers ─── */
const serviceNames = (order: Order) =>
  order.details?.map((d) => d.service_name).filter(Boolean).join(", ") ||
  order.description ||
  "Үйлчилгээ";

const branchName = (order: Order) => order.details?.[0]?.branch_name ?? "-";

const artistName = (order: Order) =>
  order.artist_name
    ? firstLetterUpper(order.artist_name.split(" ")[0])
    : order.details?.[0]?.nickname
      ? firstLetterUpper(order.details[0].nickname)
      : "-";

const formatOrderDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate(),
  ).padStart(2, "0")}`;
};

const dayLabel = (dateStr: string) => {
  const target = mnDate(new Date(dateStr));
  target.setHours(0, 0, 0, 0);
  const today = mnDate();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) return undefined;
  if (diffDays === 0) return "Өнөөдөр";
  if (diffDays === 1) return "Маргааш";
  return `${diffDays} хоногийн дараа`;
};

const canPay = (order: Order) =>
  order.order_status === OrderStatus.Pending &&
  !order.is_pre_amount_paid &&
  Number(order.pre_amount ?? 0) > 0;

/* ─── Countdown ─── */
function useCountdown(dateStr?: string, timeStr?: string) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!dateStr || !timeStr) return;
    const compute = () => {
      const [h, m] = timeStr.split(":").map(Number);
      const target = new Date(dateStr);
      target.setHours(h ?? 0, m ?? 0, 0, 0);
      const diff = target.getTime() - mnDate().getTime();
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
      });
    };
    compute();
    const id = setInterval(compute, 60000);
    return () => clearInterval(id);
  }, [dateStr, timeStr]);

  return remaining;
}

/* ─── Status badge ─── */
function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = statusConfig[status];
  if (!cfg) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
        cfg.bg,
        cfg.text,
      )}
    >
      {cfg.label}
    </span>
  );
}

/* ─── Service avatar ─── */
function ServiceAvatar({ size = 56 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl flex-shrink-0 bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500"
      style={{ width: size, height: size }}
    >
      <Scissors size={size * 0.4} className="text-white" />
    </div>
  );
}

/* ─── Progress steps ─── */
function ProgressSteps({ status }: { status: OrderStatus }) {
  const steps = [
    { label: "Захиалга үүссэн", done: true },
    {
      label: "Урьдчилгаа төлж баталгаажсан",
      done: status === OrderStatus.Active || status === OrderStatus.Finished,
    },
    { label: "Үйлчилгээ дууссан", done: status === OrderStatus.Finished },
  ];
  const activeIdx = steps.reduce((acc, s, i) => (s.done ? i : acc), 0);

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                i <= activeIdx
                  ? "bg-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.15)]"
                  : "bg-muted",
              )}
            >
              {i <= activeIdx ? (
                <CheckCircle2 size={14} className="text-white" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "w-0.5 h-7 mt-1 rounded-full",
                  i < activeIdx ? "bg-rose-500" : "bg-muted",
                )}
              />
            )}
          </div>
          <div className="pt-0.5 pb-5">
            <span
              className={cn(
                "text-sm font-medium",
                i <= activeIdx ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Detail row ─── */
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-muted-foreground ">
        <span className="text-primary">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground text-right ml-4" >{value}</span>
    </div>
  );
}

/* ─── Next appointment hero ─── */
function NextAppointmentHero({
  order,
  onView,
  onCancel,
  onPay,
}: {
  order: Order;
  onView: () => void;
  onCancel: () => void;
  onPay: () => void;
}) {
  const { days, hours, minutes } = useCountdown(order.order_date, order.start_time);
  const label = dayLabel(order.order_date);
  const cancellable = ActiveOrderStatuses.includes(order.order_status);

  return (
    <div
      onClick={onView}
      className="rounded-[24px] overflow-hidden cursor-pointer relative"
      style={{
        background: "linear-gradient(135deg, #F43F5E 0%, #fb7185 50%, #fda4af 100%)",
        boxShadow: "0 16px 48px rgba(244,63,94,0.30), 0 4px 16px rgba(244,63,94,0.15)",
      }}
    >
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-white/85" />
            <span className="text-white/85 text-xs font-bold tracking-widest uppercase">
              Таны дараагийн цаг
            </span>
          </div>
          {label && (
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex-shrink-0">
              {label}
            </span>
          )}
        </div>

        <div className="flex gap-4 items-start">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Scissors size={28} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white/40">
              <CheckCircle2 size={13} className="text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base md:text-lg leading-tight">
              {serviceNames(order)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Building size={13} className="text-white flex-shrink-0" />
              <span className="text-white text-sm font-semibold truncate">{branchName(order)}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <User size={13} className="text-white flex-shrink-0" />
              <span className="text-white text-sm font-semibold">{artistName(order)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-2xl bg-white/15 backdrop-blur-sm flex flex-wrap items-center gap-x-4 gap-y-2 justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-white/80" />
            <span className="text-white text-sm font-semibold">
              {formatOrderDate(order.order_date)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-white/80" />
            <span className="text-white text-sm font-semibold">
              {order.start_time?.slice(0, 5)}–{order.end_time?.slice(0, 5)}
            </span>
          </div>
          {order.duration ? (
            <div className="flex items-center gap-1.5">
              <Timer size={13} className="text-white/80" />
              <span className="text-white text-sm font-semibold">{order.duration} мин</span>
            </div>
          ) : null}
        </div>

        {(days > 0 || hours > 0 || minutes > 0) && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-white/90 text-xs font-semibold whitespace-nowrap">
              {days > 0 ? `${days}ө ` : ""}
              {hours}ц {minutes}м үлдсэн
            </span>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
            <CreditCard size={12} className="text-white" />
            <span className="text-white text-xs font-semibold">
              {order.is_pre_amount_paid ? "Урьдчилгаа төлсөн" : "Урьдчилгаа төлөөгүй"}
            </span>
          </div>
        </div>

        <div
          className={cn(
            "mt-5 grid gap-2",
            canPay(order) ? "grid-cols-3" : cancellable ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          {canPay(order) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPay();
              }}
              className="flex items-center justify-center gap-1.5 bg-white text-rose-600 hover:bg-white/90 active:scale-95 transition-all rounded-2xl py-3 text-sm font-bold"
            >
              Төлбөр төлөх
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 transition-all rounded-2xl py-3 text-sm font-semibold text-white"
          >
            Дэлгэрэнгүй
          </button>
          {cancellable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              className="flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 transition-all rounded-2xl py-3 text-sm font-semibold text-white"
            >
              Цуцлах
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Booking list card ─── */
function BookingListCard({
  order,
  selected,
  onView,
  onCancel,
}: {
  order: Order;
  selected: boolean;
  onView: () => void;
  onCancel: () => void;
}) {
  const label = dayLabel(order.order_date);
  const cancellable = ActiveOrderStatuses.includes(order.order_status);
  const isCancelled =
    order.order_status === OrderStatus.Cancelled || order.order_status === OrderStatus.ABSENT;

  return (
    <div
      onClick={onView}
      className={cn(
        "bg-card rounded-[20px] overflow-hidden cursor-pointer transition-all duration-200",
        selected ? "ring-2 ring-rose-500" : "hover:-translate-y-0.5",
      )}
      style={{
        boxShadow: selected
          ? "0 4px 20px rgba(244,63,94,0.15)"
          : "0 2px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {label && (
        <div
          className="px-4 py-2 flex items-center gap-2"
          style={{ background: "linear-gradient(90deg, #fff1f2, #fafafa)" }}
        >
          <Calendar size={12} className="text-rose-500" />
          <span className="text-rose-600 text-xs font-bold tracking-wide">{label}</span>
        </div>
      )}

      <div className="p-4 flex gap-3">
        <div className={isCancelled ? "opacity-50 grayscale" : ""}>
          <ServiceAvatar size={64} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground text-sm leading-snug flex-1">
              {serviceNames(order)}
            </h4>
            <StatusBadge status={order.order_status} />
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Building size={13} className="text-rose-500 flex-shrink-0" />
            <span className="text-foreground text-sm font-semibold truncate">{branchName(order)}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <User size={13} className="text-rose-500 flex-shrink-0" />
            <span className="text-foreground text-sm font-semibold">{artistName(order)}</span>
          </div>

          <div className="flex items-center justify-between mt-2.5 flex-wrap gap-y-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar size={11} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatOrderDate(order.order_date)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={11} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {order.start_time?.slice(0, 5)}
                </span>
              </div>
            </div>
            <span className="text-sm font-bold text-foreground">
              {money((order.total_amount ?? order.pre_amount ?? 0).toString())} ₮
            </span>
          </div>

          {cancellable && (
            <div className="flex justify-end mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
                className="flex items-center gap-1.5 border border-rose-500 rounded-full px-2.5 py-1 bg-rose-50 text-rose-600 text-xs cursor-pointer"
              >
                <X size={12} /> Цуцлах
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Detail body (shared by modal + side panel) ─── */
function DetailBody({
  order,
  onCancel,
  onPay,
}: {
  order: Order;
  onCancel: () => void;
  onPay: () => void;
}) {
  const total = order.total_amount ? `${money(order.total_amount)}₮` : "Тооцогдоогүй";
  const paid = order.paid_amount ? `${money(order.paid_amount)}₮` : "Тооцогдоогүй";
  const pre = order.pre_amount ? `${money(order.pre_amount)}₮` : "Тооцогдоогүй";
  const voucherDiscount = Number(order.discount ?? 0);
  const isCancelled =
    order.order_status === OrderStatus.Cancelled || order.order_status === OrderStatus.ABSENT;
  const cancellable = ActiveOrderStatuses.includes(order.order_status);

  return (
    <div className="space-y-4">
      {/* Progress / cancelled banner */}
      {isCancelled ? (
        <div className="bg-card rounded-[18px] p-4 flex items-center gap-3 border border-border">
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <CalendarX size={18} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {statusConfig[order.order_status as OrderStatus]?.label}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-[18px] p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            Захиалгын явц
          </p>
          <ProgressSteps status={order.order_status} />
        </div>
      )}

      {/* Services */}
      <div
        className="bg-card rounded-[18px] p-4 space-y-1"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
      >
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
          Үйлчилгээний дэлгэрэнгүй
        </p>
        {(order.details?.length ? order.details : [null]).map((d, i) => (
          <div key={i} className={i > 0 ? "pt-3 mt-3  border-t border-border" : ""}>
            <p className="text-sm font-semibold text-foreground mb-1">
              {d?.service_name ?? serviceNames(order)}
            </p>
            <DetailRow icon={<Calendar size={14} />} label="Огноо" value={formatOrderDate(order.order_date)} />
            <DetailRow
              icon={<Clock size={14} />}
              label="Цаг"
              value={`${(d?.start_time ?? order.start_time)?.slice(0, 5) ?? "-"}–${(d?.end_time ?? order.end_time)?.slice(0, 5) ?? "-"}`}
            />
            <DetailRow icon={<Building size={14} />} label="Салбар" value={d?.branch_name ?? branchName(order)} />
            <DetailRow icon={<User size={14} />} label="Артист" value={firstLetterUpper(d?.nickname ?? artistName(order))} />
          </div>
        ))}
      </div>

      {/* Payment */}
      <div className="bg-card rounded-[18px] p-4 space-y-2" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Төлбөр</p>
        <DetailRow icon={<Wallet size={14} />} label="Нийт төлбөр" value={total} />
        <DetailRow icon={<CircleCheck size={14} />} label="Гүйцээж төлсөн төлбөр" value={paid} />
        <DetailRow icon={<PiggyBank size={14} />} label="Урьдчилгаа төлбөр" value={pre} />
        {order.voucher_name && (
          <DetailRow
            icon={<Wallet size={14} />}
            label="Урамшуулал"
            value={`${order.voucher_name}${voucherDiscount > 0 ? ` (-${money(voucherDiscount)}₮)` : ""}`}
          />
        )}
        <DetailRow
          icon={<Calendar1 size={14} />}
          label="Цаг захиалга үүсгэсэн огноо"
          value={order.created_at ? formatOrderDate(String(order.created_at)) : "-"}
        />
        {order.updated_at && (
          <DetailRow
            icon={
              order.order_status === OrderStatus.Cancelled || order.order_status === OrderStatus.ABSENT ? (
                <CalendarX size={14} />
              ) : (
                <CalendarCheck size={14} />
              )
            }
            label={
              order.order_status === OrderStatus.Cancelled || order.order_status === OrderStatus.ABSENT
                ? "Цаг цуцлагдсан огноо"
                : order.order_status === OrderStatus.Active
                  ? "Төлбөр төлж баталгаажсан огноо"
                  : "Дууссан огноо"
            }
            value={formatOrderDate(String(order.updated_at))}
          />
        )}
      </div>

      {/* Actions */}
      {(canPay(order) || cancellable) && (
        <div className="space-y-2">
          {canPay(order) && (
            <button
              onClick={onPay}
              className="w-full py-3.5 rounded-[18px] bg-rose-500 text-white font-bold text-sm active:scale-[0.98] transition-all hover:bg-rose-600"
              style={{ boxShadow: "0 6px 24px rgba(244,63,94,0.30)" }}
            >
              Төлбөр төлөх
            </button>
          )}
          {cancellable && (
            <button
              onClick={onCancel}
              className="w-full py-3.5 rounded-[18px] border border-border text-muted-foreground font-semibold text-sm active:scale-[0.98] transition-all hover:bg-muted"
            >
              Захиалга цуцлах
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export const MyOrderPage = ({
  data,
  params,
}: {
  data: ListType<Order>;
  params?: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const invisibleStatus = [OrderStatus.Friend];
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: cancelOpen,
    onOpen: openCancel,
    onOpenChange: onCancelOpenChange,
  } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const currentTabValue = params ?? `${OrderStatus.Active}`;
  const isActiveTab = currentTabValue.includes(`${OrderStatus.Active}`);

  const view = (id: string) => {
    setSelectedOrder(data.items.filter((d) => d.id == id)[0]);
    // Below the lg breakpoint the detail is shown as a bottom sheet;
    // from lg upward it renders inline in the sticky side panel, so no modal is needed.
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }
    onOpen();
  };

  const requestCancel = (id: string) => {
    setCancelTargetId(id);
    openCancel();
  };

  const cancelOrder = async () => {
    if (!cancelTargetId) return;
    const res = await find(Api.order, {}, `cancel/${cancelTargetId}`);
    if ((res as any)?.error) {
      addToast({
        title: (res as any).error,
        timeout: 3000,
        color: "warning",
      });
      return;
    }
    addToast({ title: `Захиалга амжилттай цуцлагдлаа.`, timeout: 3000 });
    router.push("/");
  };

  const openPayment = async (order: Order, close?: () => void) => {
    if (paymentLoading) return;
    setPaymentLoading(true);
    try {
      const res = await find<Invoice>(Api.order, {}, `payment/${order.id}`);
      const payload = res.data as any;

      if (payload?.paid) {
        addToast({
          title: "Төлбөр төлөгдсөн байна.",
          timeout: 3000,
        });
        router.push(`${pathname}?status=${OrderStatus.Active}`);
        router.refresh();
        close?.();
        return;
      }

      if (payload?.expired) {
        addToast({
          title: "Төлбөрийн 10 минутын хугацаа дууссан байна.",
          timeout: 3000,
          color: "warning",
        });
        router.push(`${pathname}?status=${OrderStatus.ABSENT}`);
        router.refresh();
        close?.();
        return;
      }

      if (payload?.payment_check_unavailable) {
        addToast({
          title: "Төлбөрийн төлөв шалгаж чадсангүй. Түр хүлээгээд дахин оролдоно уу.",
          timeout: 3000,
          color: "warning",
        });
        return;
      }

      if (!payload?.invoice_id) {
        addToast({
          title: "Төлөх боломжтой QPay нэхэмжлэл олдсонгүй.",
          timeout: 3000,
          color: "warning",
        });
        return;
      }

      setPaymentInvoice({
        ...payload,
        price: Number(payload.price ?? order.pre_amount ?? 0),
        created: payload.created ?? new Date(),
        status: payload.status ?? OrderStatus.Pending,
        urls: payload.urls ?? [],
      });
      setPaymentOrderId(order.id);
      close?.();
    } finally {
      setPaymentLoading(false);
    }
  };

  if (paymentInvoice && paymentOrderId) {
    return (
      <PaymentView
        invoice={paymentInvoice}
        id={paymentOrderId}
        redirectTo={`${pathname}?status=${OrderStatus.Active}`}
        cancelRedirectTo={`${pathname}?status=${OrderStatus.ABSENT}`}
      />
    );
  }

  const nextAppointment = isActiveTab ? data.items[0] : undefined;

  return (
    <div className="min-h-screen bg-background">
      <AlertDialog
        submit={cancelOrder}
        isOpen={cancelOpen}
        onOpenChange={onCancelOpenChange}
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

      <div className="mt-14 mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 md:py-10">
        {/* Header */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest">
            Цаг захиалга
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-0.5">
            Миний цаг захиалга
          </h1>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-2 overflow-x-auto pb-1 mb-6 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {getEnumValues(OrderStatus).map((status, i) => {
            if (invisibleStatus.includes(status)) return null;
            const active = currentTabValue.includes(status.toString());
            return (
              <Link
                key={i}
                href={`${pathname}?status=${status}`}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-all",
                  active
                    ? "bg-rose-500 text-white shadow-[0_4px_16px_rgba(244,63,94,0.30)]"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {OrderStatusValues[status]}
                {active && (
                  <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-white/25 text-white">
                    {data.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-6 lg:items-start">
          <div className="min-w-0">
            {isActiveTab && nextAppointment && (
              <div className="mb-5">
                <NextAppointmentHero
                  order={nextAppointment}
                  onView={() => view(nextAppointment.id)}
                  onCancel={() => requestCancel(nextAppointment.id)}
                  onPay={() => void openPayment(nextAppointment)}
                />
              </div>
            )}

            {(!data?.items || data.items.length === 0) && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-rose-100 to-rose-200">
                  <Scissors size={32} className="text-rose-500" />
                </div>
                <h3 className="font-semibold text-foreground text-base">Захиалга олдсонгүй</h3>
                <p className="text-muted-foreground text-sm mt-1">Шинэ захиалга хийнэ үү</p>
                <Link
                  href="/order"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-all"
                >
                  <Sparkles size={16} />
                  Шинэ захиалга хийх
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
              {data?.items?.map((order) => (
                <BookingListCard
                  key={order.id}
                  order={order}
                  selected={selectedOrder?.id === order.id}
                  onView={() => view(order.id)}
                  onCancel={() => requestCancel(order.id)}
                />
              ))}
            </div>

            {data?.items && data.items.length > 0 && (
              <div className="mt-6">
                <Link
                  href="/order"
                  className="w-full py-4 rounded-[20px] flex items-center justify-center gap-2 font-bold text-base text-white transition-all hover:opacity-90 active:scale-[0.99]"
                  style={{
                    background: "linear-gradient(135deg, #F43F5E, #fb7185)",
                    boxShadow: "0 6px 24px rgba(244,63,94,0.28)",
                  }}
                >
                  <Sparkles size={18} />
                  Шинэ захиалга хийх
                </Link>
              </div>
            )}
          </div>

          {/* Desktop detail panel */}
          <aside className="hidden lg:block lg:sticky lg:top-20">
            {selectedOrder ? (
              <div className="bg-card rounded-[20px] p-4" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Захиалгын дэлгэрэнгүй</h3>
                  <StatusBadge status={selectedOrder.order_status} />
                </div>
                <DetailBody
                  order={selectedOrder}
                  onCancel={() => requestCancel(selectedOrder.id)}
                  onPay={() => void openPayment(selectedOrder)}
                />
              </div>
            ) : (
              <div className="bg-card rounded-[20px] p-8 text-center" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                <div className="w-14 h-14 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                  <Scissors size={22} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Дэлгэрэнгүйг харахын тулд захиалга сонгоно уу.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile detail sheet */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          wrapper: "lg:hidden items-end sm:items-center",
          base: "m-0 sm:m-4 rounded-t-[28px] sm:rounded-2xl max-h-[88vh] overflow-hidden flex flex-col",
          header: "flex-shrink-0",
          body: "overflow-y-auto min-h-0",
        }}
      >
        <ModalContent>
          {(onClose) =>
            selectedOrder && (
              <>
                <ModalHeader className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-lg text-foreground">Захиалгын дэлгэрэнгүй</h3>
                  <StatusBadge status={selectedOrder.order_status} />
                </ModalHeader>
                <ModalBody className="pb-6">
                  <DetailBody
                    order={selectedOrder}
                    onCancel={() => {
                      onClose();
                      requestCancel(selectedOrder.id);
                    }}
                    onPay={() => void openPayment(selectedOrder, onClose)}
                  />
                </ModalBody>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </div>
  );
};
