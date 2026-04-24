import { find } from "@/app/(api)";
import { mnDate } from "@/lib/const";
import { OrderStatus, StatusColor, StatusValue } from "@/lib/constants";
import { money } from "@/lib/functions";
import { Invoice } from "@/types";
import { Api } from "@/utils/api";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Progress } from "@heroui/progress";
import { addToast } from "@heroui/toast";
import { Clock, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";

export const AlertDialog = ({
  isOpen,
  onOpenChange,
  title = " Та итгэлтэй байна уу",
  text = "Баталгаажсан",
  submit,
  children,
}: {
  isOpen: boolean;
  onOpenChange: (e: boolean) => void;
  title?: string;
  text?: string;
  submit: () => void;
  children?: ReactNode;
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            {children}
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Буцах
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  onClose();
                  submit();
                }}
              >
                {text}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export const PaymentView = ({
  invoice,
  id,
  redirectTo = "/",
  cancelRedirectTo = redirectTo,
}: {
  invoice: Invoice;
  id: string;
  redirectTo?: string;
  cancelRedirectTo?: string;
}) => {
  const qrImage = invoice.qr_image?.trim();
  const paymentLinks = invoice.urls ?? [];
  const end = mnDate(new Date(invoice.created));
  end.setMinutes(end.getMinutes() + 10); // 10 минут нэмэх
  const endTime = end.getTime();
  const time = mnDate().getTime();
  const [timeLeft, setTimeLeft] = useState(endTime - time);
  const expiryHandledRef = useRef(false);
  const checkInFlightRef = useRef(false);

  let diffMinutes = Math.floor(timeLeft / (1000 * 60)).toString();
  let diffSeconds = Math.floor((timeLeft % (1000 * 60)) / 1000).toString();
  diffMinutes = +diffMinutes < 10 ? `0${diffMinutes}` : diffMinutes;
  diffSeconds = +diffSeconds < 10 ? `0${diffSeconds}` : diffSeconds;

  const total = 10 * 60 * 1000;
  const progress = Math.ceil(100 - ((total - timeLeft) / total) * 100);
  const [status, setStatus] = useState(invoice.status);
  const router = useRouter();
  const checkPayment = async (showResult = true) => {
    if (checkInFlightRef.current) return null;
    checkInFlightRef.current = true;
    try {
      const res = await find(Api.order, {}, `check/${invoice.invoice_id}/${id}`);
      if (res.error) {
        if (showResult) {
          addToast({
            title: "Төлбөрийн төлөв шалгаж чадсангүй. Түр хүлээгээд дахин оролдоно уу.",
            timeout: 3000,
            color: "warning",
          });
        }
        return null;
      }
      const data = res.data as any;
      if (data?.paid) {
        setStatus(data.status);
        router.push(redirectTo);
        if (showResult) {
          addToast({
            title: "Амжилттай төлөгдлөө.",
            timeout: 3000,
          });
        }
        return true;
      }
      if (showResult) {
        addToast({
          title: "Төлбөр төлөгдөөгүй байна.",
          timeout: 3000,
        });
      }
      return false;
    } finally {
      checkInFlightRef.current = false;
    }
  };
  const cancel = async () => {
    const res = await find(Api.order, {}, `cancel/${id}`);
    if (res.error) {
      addToast({
        title: res.error,
      });
      return;
    }
    addToast({
      title: `Захиалга амжилттай цуцлагдлаа.`,
    });
    router.push(cancelRedirectTo);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const now = mnDate();
      const diff = endTime - now.getTime();
      const secondsLeft = Math.max(0, Math.floor(diff / 1000));

      if (diff <= 0) {
        setTimeLeft(0);
        if (!expiryHandledRef.current) {
          expiryHandledRef.current = true;
          void checkPayment(false).then((paid) => {
            if (paid === null) {
              expiryHandledRef.current = false;
            } else if (paid === false) {
              void cancel();
            }
          });
        }
        return;
      }

      if (secondsLeft % 15 == 0) void checkPayment(false);
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="mx-auto max-w-lg mt-24 px-2">
      <AlertDialog
        submit={() => {
          cancel();
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        text="Зөвшөөрөх"
      >
        <div className="px-6">
          <p>Та цагаа цуцалвал урьдчилгаа буцаагдахгүй.</p>
        </div>
      </AlertDialog>
      <div className="flex mb-4 justify-between items-center">
        <p className="">Төлбөр гүйцээх</p>
        <button
          className="flex items-center cursor-pointer gap-2"
          onClick={() => onOpen()}
        >
          <X size={14} /> Цуцлах
        </button>
      </div>
      <div
        className={`mb-4 border ${progress > 30 ? "border-gray-300 bg-gray-50" : "border-red-300 bg-red-50"} rounded-md py-2 px-2 flex gap-2 items-start`}
      >
        <Clock
          size={14}
          className="mt-1"
          color={progress > 30 ? "#F43F5E" : "#F59E0B"}
        />

        <div className="">
          <p
            className={`${progress > 30 ? "text-gray-500" : "text-red-300"} text-sm mb-2`}
          >
            Та захиалгаа баталгаажуулахын тулд {diffMinutes}:{diffSeconds} дотор
            төлбөрөө хийж дуусгана уу.
          </p>
          <Progress
            value={progress}
            size="sm"
            classNames={{
              indicator: progress > 30 ? "bg-rose-500" : "#F59E0B",
            }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center rounded-md bg-white py-4 px-3 border border-gray-300">
        <p className="text-sm">Урьдчилгаа төлбөр</p>
        <p className="text-xl mb-2">
          {money(String(invoice.price ?? 0))}₮
        </p>
        <div className="flex items-center justify-center">
          {qrImage ? (
            <Image
              className="border border-gray-300 rounded-md"
              src={`data:image/png;base64,${qrImage}`}
              width={300}
              height={300}
              alt={invoice.invoice_id}
            />
          ) : (
            <div className="max-w-[300px] rounded-md border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-800">
              QR код ачаалагдсангүй. Доорх холбоосоор эсвэл QPay app дээр
              нэхэмжлэлээ шалгаж төлбөрөө үргэлжлүүлнэ үү.
            </div>
          )}
        </div>

        <p className="mt-4 mb-6 text-sm">
          QPay апп-аар QR код уншиж, төлбөрөө хийнэ үү.
        </p>

        {!qrImage && invoice.qr_text && (
          <div className="mb-4 w-full rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-xs break-all text-gray-500">
            {invoice.qr_text}
          </div>
        )}

        <div className="border-y border-gray-300 w-full mt-3 pt-3 pb-6 flex items-center gap-2 justify-center">
          <div className={`w-2 h-2 ${StatusColor[status]} rounded-full`} />
          <p className="text-md">{StatusValue[status]}</p>
        </div>
        <div className="md:hidden grid grid-cols-12 px-2 gap-4 mt-2 mb-4">
          {paymentLinks.map((url, i) => {
            return (
              <Link
                href={url.link}
                key={i}
                className="col-span-3 flex items-start"
              >
                <div className="flex items-center flex-col w-full">
                  <Image
                    src={`${url.logo}`}
                    width={100}
                    height={100}
                    alt={url.name}
                  />
                  <p className="mt-2 text-center">{url.name}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <button
          className="my-4 cursor-pointer mx-auto w-full bg-gray-100 border border-gray-300 rounded-md py-2"
          onClick={() => void checkPayment()}
        >
          Шалгах
        </button>
      </div>
      <div className="my-8"></div>
    </div>
  );
};
