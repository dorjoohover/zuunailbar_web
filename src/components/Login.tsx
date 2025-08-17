"use client";
import { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";
import PasswordInput from "./shared/PasswordInput";
import { cn } from "@/lib/utils";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";
import { login, register, sendOtp } from "@/app/(api)/auth";
import { usePathname, useRouter } from "next/navigation";

export default function AuthModal() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleSendOtp = async () => {
    if (!phone) return;

    const { data, error } = await sendOtp(phone);
    if (error) {
      addToast({
        title: error,
        size: "lg",
        color: "danger",
      });
      setOtpSent(false);
      setTimer(0);
    } else {
      if (data) {
        setOtpSent(true);
        setTimer(59);
        addToast({
          title: "Нэг удаагийн нууц үг илгээлээ",
          size: "lg",
          color: "success",
        });
      }
    }
  };

  useEffect(() => {
    if (!timer) return;
    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleRegister = async () => {
    if (password !== passwordConfirm) {
      setError("Нууц үг таарахгүй байна");
      return;
    }
    setError("");
    const { data, error } = await register({
      mobile: phone,
      otp: otp,
      password: password,
    });
    if (error) {
      addToast({
        title: error,
        size: "lg",
        color: "danger",
      });
      return;
    }
    if (data?.accessToken) {
      save(data.accessToken, data.merchant_id);

      // end modal haana
      addToast({
        title: "Амжилттай бүртгүүллээ",
        size: "lg",
        color: "success",
      });
      onClose();
    }
  };
  const handleLogin = async () => {
    setError("");
    const res = await login({
      mobile: phone,
      password: password,
    });
    const data = res.data;
    if (data?.accessToken) {
      save(data.accessToken, data.merchant_id);
      // end modal haana
      onClose();
      addToast({
        title: "Амжилттай Нэвтэрлээ",
        size: "lg",
        color: "success",
      });
    }
  };
  const router = useRouter();

  const save = async (token: string, merchant: string) => {
    await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        merchant,
      }),
    });
    router.refresh();
  };
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.includes("/order")) onOpen();
  }, [pathname]);
  return (
    <>
      <Button
        size="sm"
        onPress={() => {
          onOpen();
        }}
        className="text-sm font-semibold text-white bg-transparent size-10 aspect-square"
      >
        {/* <UserRound className="size-4" /> */}
        Нэвтрэх
      </Button>
      <Modal
        isOpen={pathname.includes("/order") ? true : isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="p-4">
          {(onClose) => (
            <>
              <ModalHeader>
                {tab === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
              </ModalHeader>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  tab === "login" && handleLogin();
                  tab === "register" && otpSent && handleRegister();
                }}
              >
                <ModalBody className="w-full">
                  {/* Tab Switch */}
                  <div className="flex mb-4 bg-white border rounded-full">
                    {["login", "register"].map((t) => (
                      <Button
                        key={t}
                        className={cn(
                          "flex-1 bg-cover bg-no-repeat",
                          tab === t
                            ? "bg-dark text-white bg-[url(/bg/banner-gradient.png)]"
                            : "bg-transparent",
                          t === "login" ? "rounded-l-full" : "rounded-r-full"
                        )}
                        onPress={() => {
                          setTab(t as typeof tab);
                          setError("");
                        }}
                      >
                        {t === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
                      </Button>
                    ))}
                  </div>
                  {/* Login tab */}
                  {tab === "login" && (
                    <div className="flex flex-col gap-4">
                      <Input
                        label="Утасны дугаар"
                        onChange={(e) => setPhone(e.target.value)}
                        isRequired
                      />
                      <PasswordInput
                        label="Нууц үг"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  {/* Register tab */}
                  {tab === "register" && (
                    <div className="flex flex-col gap-4">
                      <div className="relative flex">
                        <Input
                          type="tel"
                          label="Утасны дугаар"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          isRequired
                        />
                        <Button
                          className="text-white px-2 bg-dark bg-[url(/bg/banner-gradient.png)] bg-no-repeat bg-cover absolute right-2 top-[50%] -translate-y-[50%] rounded-"
                          onPress={handleSendOtp}
                          isDisabled={timer > 0}
                        >
                          {timer > 0
                            ? `Илгээх ${timer < 10 ? `0${timer}` : timer}`
                            : "Илгээх"}
                        </Button>
                      </div>
                      {otpSent && (
                        <div className="flex flex-col items-center w-full">
                          <h1 className="text-sm text-left">
                            Баталгаажуулах дугаар
                          </h1>
                          <div className="flex items-center justify-center gap-4">
                            <InputOtp
                              size="lg"
                              length={4}
                              value={otp}
                              onValueChange={setOtp}
                              placeholder="x"
                              isRequired
                            />
                          </div>
                        </div>
                      )}
                      {otpSent && (
                        <>
                          <PasswordInput
                            label="Нууц үг"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <PasswordInput
                            label="Нууц үг давтах"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                          />
                        </>
                      )}
                    </div>
                  )}
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </ModalBody>
                {/* Modal footer */}
                <ModalFooter className="flex justify-center w-full">
                  {/* <Button color="danger" variant="light" onPress={() => onClose()}>
                    Цуцлах
                  </Button> */}
                  {/* Login footer */}
                  {tab === "login" && (
                    <Button color="primary" type="submit" className="px-10">
                      Нэвтрэх
                    </Button>
                  )}
                  {/* Register footer */}
                  {tab === "register" && otpSent && (
                    <Button
                      color="primary"
                      type="submit"
                      className="px-10"
                      onSubmit={() => {
                        handleRegister();
                      }}
                    >
                      Баталгаажуулах
                    </Button>
                  )}
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
