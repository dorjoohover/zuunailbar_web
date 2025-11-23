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
import {
  login,
  register,
  sendOtp,
  sendOtpForget,
  updatePassword,
} from "@/app/(api)/auth";
import { usePathname } from "next/navigation";

export function AuthModal() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState<string | undefined>();
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleSendOtp = async () => {
    if (!phone) {
      addToast({
        title: "Дугаараа оруулна уу",
        size: "lg",
        color: "warning",
      });
      return;
    }

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
  const forgetPasswordSendOtp = async () => {
    if (!username) {
      addToast({
        title: "Дугаар эсвэл майл оруулна уу",
        size: "lg",
        color: "warning",
      });
      return;
    }

    const { data, error } = await sendOtpForget(username);
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
        console.log(data);
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
      addToast({
        title: "Амжилттай бүртгүүллээ",
        size: "lg",
        color: "success",
      });
      save(data.accessToken, data.merchant_id);

      onClose();
    }
  };
  const handleLogin = async () => {
    setError("");
    try {
      const res = await login({
        mobile: phone,
        password: password,
      });
      if (res.error) {
        addToast({
          title: res.error,
          size: "lg",
          color: "danger",
        });
        return;
      }
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
    } catch (error) {
      console.log(error);
    }
  };

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
    window.location.replace(window.location.href);
  };
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.includes("/order")) onOpen();
  }, [pathname]);
  const forgetPassword = async () => {
    if (password !== passwordConfirm) {
      setError("Нууц үг таарахгүй байна");
      return;
    }
    if (!username) return;
    setError("");
    const { data, error } = await updatePassword({
      mobile: username,
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
    if (data) {
      console.log(data);
      addToast({
        title: "Амжилттай нууц үг шинэчиллээ.",
        size: "lg",
        color: "success",
      });
      setForget(false);
      setOtp("");
      setTimer(0);
      setUsername(undefined);
    }
  };
  const [forget, setForget] = useState(false);
  return (
    <>
      <Button
        size="md"
        onPress={() => {
          onOpen();
        }}
        className="text-sm md:hidden font-semibold text-white bg-transparent border border-white aspect-square"
      >
        {/* <UserRound className="size-4" /> */}
        Нэвтрэх
      </Button>
      <Button
        size="md"
        onPress={() => {
          onOpen();
        }}
        className="text-sm hidden md:block font-semibold text-white bg-transparent size-10 aspect-square"
      >
        {/* <UserRound className="size-4" /> */}
        Нэвтрэх
      </Button>
      <Modal
        placement="top"
        isOpen={pathname.includes("/order") ? true : isOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          setForget(false);
          setTab("login");
        }}
      >
        <ModalContent className="p-4">
          {(onClose) => (
            <>
              <ModalHeader className={"text-dark"}>
                {forget
                  ? "Нууц үг сэргээх"
                  : tab === "login"
                    ? "Нэвтрэх"
                    : "Бүртгүүлэх"}
              </ModalHeader>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  tab === "login" && handleLogin();
                  tab === "register" && otpSent && handleRegister();
                }}
              >
                <ModalBody className="w-full">
                  {forget ? (
                    <div>
                      <div className="flex flex-col gap-4">
                        <div className="relative flex">
                          <Input
                            type="text"
                            label="Утасны дугаар эсвэл майл хаяг"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            isRequired
                          />
                          <Button
                            className="text-white px-2 bg-dark bg-[url(/bg/banner-gradient.png)] bg-no-repeat bg-cover absolute right-2 top-[50%] -translate-y-[50%] rounded-"
                            onPress={forgetPasswordSendOtp}
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
                              onChange={(e) =>
                                setPasswordConfirm(e.target.value)
                              }
                              required
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex mb-4 bg-white border rounded-full">
                        {["login", "register"].map((t) => (
                          <Button
                            key={t}
                            className={cn(
                              "flex-1 bg-cover bg-no-repeat",
                              tab === t
                                ? "bg-dark text-white bg-[url(/bg/banner-gradient.png)]"
                                : "bg-transparent text-black",
                              t === "login"
                                ? "rounded-l-full"
                                : "rounded-r-full"
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
                      {tab === "login" && (
                        <div className="flex flex-col gap-4">
                          <Input
                            label="Утасны дугаар"
                            onChange={(e) => setPhone(e.target.value)}
                            isRequired
                            errorMessage="Утасны дугаар оруулна уу"
                          />
                          <PasswordInput
                            label="Нууц үг"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />

                          <div className="flex justify-end">
                            <div
                              className="text-sm text-dark transition-all duration-300 cursor-pointer hover:text-primary"
                              onClick={() => setForget(true)}
                            >
                              Нууц үг сэргээх
                            </div>
                          </div>
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
                                onChange={(e) =>
                                  setPasswordConfirm(e.target.value)
                                }
                                required
                              />
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </ModalBody>
                {/* Modal footer */}
                <ModalFooter className="flex justify-center w-full">
                  {forget ? (
                    otpSent ? (
                      <Button
                        onClick={() => forgetPassword()}
                        className="px-10"
                      >
                        Илгээх
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setForget(false)}
                        className="px-10"
                      >
                        Буцах
                      </Button>
                    )
                  ) : (
                    tab === "login" && (
                      <Button type="submit" className="px-10">
                        Нэвтрэх
                      </Button>
                    )
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
