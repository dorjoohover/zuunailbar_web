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
import { useEffect, useState } from "react";

export const AlertDialog = ({
  isOpen,
  onOpenChange,
  title = " Та итгэлтэй байна уу",
  text = "Баталгаажсан",
  submit,
}: {
  isOpen: boolean;
  onOpenChange: (e: boolean) => void;
  title?: string;
  text?: string;
  submit: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>

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
}: {
  invoice: Invoice;
  id: string;
}) => {
  const end = mnDate(invoice.created);
  end.setMinutes(end.getMinutes() + 10); // 10 минут нэмэх
  const [timeLeft, setTimeLeft] = useState(end.getTime() - mnDate().getTime());

  let diffMinutes = Math.floor(timeLeft / (1000 * 60)).toString();
  let diffSeconds = Math.floor((timeLeft % (1000 * 60)) / 1000).toString();
  diffMinutes = +diffMinutes < 10 ? `0${diffMinutes}` : diffMinutes;
  diffSeconds = +diffSeconds < 10 ? `0${diffSeconds}` : diffSeconds;

  const total = 10 * 60 * 1000;
  const progress = Math.ceil(100 - ((total - timeLeft) / total) * 100);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = mnDate();
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) cancel();
      if (+diffSeconds % 10 == 0 && +diffSeconds != 0) checkPayment();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [end]);
  const [status, setStatus] = useState(invoice.status);
  const router = useRouter();
  const checkPayment = async () => {
    const res = await find(Api.order, {}, `check/${invoice.invoice_id}/${id}`);
    const data = res.data as any;
    if (data.paid) {
      setStatus(data.status);
      router.push("/");
    }
    addToast({
      title: `${data.paid ? "Амжилттай төлөгдлөө." : "Төлбөр төлөгдөөгүй байна."}`,
    });
  };
  const cancel = async () => {
    const res = await find(Api.order, {}, `cancel/${id}`);
    addToast({
      title: `Захиалга амжилттай цуцлагдлаа.`,
    });
    router.push("/");
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="mx-auto max-w-lg mt-24 px-2">
      <AlertDialog
        submit={() => {
          cancel();
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
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
        <p className="text-sm">Нийт төлбөр</p>
        <p className="text-xl mb-2">{money(invoice.price.toString())}₮</p>
        <div className="md:hidden grid grid-cols-12 px-2 gap-4 mt-2 mb-4">
          {invoice.urls.map((url, i) => {
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
        <div className="flex items-center justify-center">
          <Image
            className="border border-gray-300 rounded-md"
            src={`data:image/png;base64,${invoice.qr_image}`}
            width={300}
            height={300}
            alt={invoice.invoice_id}
          />
        </div>

        <p className="mt-4 mb-6 text-sm">
          QPay апп-аар QR код уншиж, төлбөрөө хийнэ үү.
        </p>

        <div className="border-y border-gray-300 w-full mt-3 pt-3 pb-6 flex items-center gap-2 justify-center">
          <div className={`w-2 h-2 ${StatusColor[status]} rounded-full`} />
          <p className="text-md">{StatusValue[status]}</p>
        </div>
        <button
          className="my-4 cursor-pointer mx-auto w-full bg-gray-100 border border-gray-300 rounded-md py-2"
          onClick={checkPayment}
        >
          Шалгах
        </button>
      </div>
      <div className="my-8"></div>
    </div>
  );
};
