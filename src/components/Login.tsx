"use client";

import { useState, useEffect, useRef } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { button, text } from "@/lib/const";

function useAutoFocus(condition: boolean, ref: any) {
  useEffect(() => {
    if (!condition) return;

    if (ref.current?.focus) {
      ref.current.focus();
      return;
    }

    const inner = ref.current?.querySelector?.("input");
    inner?.focus?.();
  }, [condition, ref]);
}

export function AuthModal() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [forget, setForget] = useState(false);
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();

  // ----------------- REFS -----------------
  const usernameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  // ----------------- AUTO FOCUS -----------------
  useAutoFocus(forget, usernameRef);
  useAutoFocus(tab === "login", phoneRef);
  useAutoFocus(otpSent, otpRef);

  // OTP дуусмагц → Password руу focus
  useEffect(() => {
    if (otp.length === 4 && (forget || tab === "register")) {
      const pass = passwordRef.current;
      pass?.focus?.() ?? pass?.querySelector?.("input")?.focus?.();
    }
  }, [otp, forget, tab]);

  // Timer countdown
  useEffect(() => {
    if (!timer) return;
    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  // ----------------- API HANDLERS -----------------
  const handleSendOtp = async () => {
    if (!phone)
      return addToast({
        title: "Дугаараа оруулна уу",
        size: "lg",
        color: "warning",
      });
    const { data, error } = await sendOtp(phone);
    if (error) return addToast({ title: error, size: "lg", color: "danger" });
    setOtpSent(true);
    setTimer(59);
    addToast({ title: "OTP илгээлээ", size: "lg", color: "success" });
  };

  const forgetPasswordSendOtp = async () => {
    if (!username)
      return addToast({
        title: "Дугаар эсвэл майл оруулна уу",
        size: "lg",
        color: "warning",
      });
    setOtpSent(true);
    setTimer(59);
    const { data, error } = await sendOtpForget(username);
    if (error) {
      setOtpSent(false);
      setTimer(0);
      return addToast({ title: error, size: "lg", color: "danger" });
    }
    addToast({ title: "OTP илгээлээ", size: "lg", color: "success" });
  };

  const handleRegister = async () => {
    if (password !== passwordConfirm)
      return setError("Нууц үг таарахгүй байна");
    const { data, error } = await register({ mobile: phone, otp, password });
    if (error) return addToast({ title: error, size: "lg", color: "danger" });
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
    const res = await login({ mobile: phone, password });
    if (res.error)
      return addToast({ title: res.error, size: "lg", color: "danger" });
    if (res.data?.accessToken) {
      addToast({ title: "Амжилттай нэвтэрлээ", size: "lg", color: "success" });
      save(res.data.accessToken, res.data.merchant_id);
      onClose();
    }
  };

  const forgetPassword = async () => {
    if (password !== passwordConfirm)
      return setError("Нууц үг таарахгүй байна");
    if (!username) return;
    const { data, error } = await updatePassword({
      mobile: username,
      otp,
      password,
    });
    if (error) return addToast({ title: error, size: "lg", color: "danger" });
    addToast({
      title: "Нууц үг амжилттай шинэчлэгдлээ",
      size: "lg",
      color: "success",
    });
    setForget(false);
    setOtp("");
    setTimer(0);
    setUsername("");
    setError("");
  };

  const save = async (token: string, merchant: string) => {
    await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, merchant }),
    });
    window.location.replace(window.location.href);
  };

  useEffect(() => {
    if (pathname.includes("/order")) onOpen();
  }, [pathname]);

  // ----------------- SUBMIT HANDLER -----------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forget) return;
    if (tab === "login") handleLogin();
    if (tab === "register" && otpSent) handleRegister();
  };

  // ----------------- RENDER -----------------
  return (
    <>
      <Button
        size="md"
        onPress={onOpen}
        variant="ghost"
        className="text-sm md:hidden w-full text-center font-semibold text-white border text-rose-400 bg-transparent border border-rose-400/50 aspect-square"
      >
        Нэвтрэх
      </Button>
      <Button
        size="md"
        onPress={onOpen}
        className="text-sm hidden md:block font-semibold text-rose-400 bg-transparent border border-rose-400/50 rounded-full px-6"
      >
        Нэвтрэх
      </Button>

      <Modal
        placement="top"
        isOpen={pathname.includes("/order") ? true : isOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          setForget(false);
          setTab("login");
          onClose();
          router.push("/");
        }}
      >
        <ModalContent className="p-4">
          {(onClose) => (
            <>
              <ModalHeader className={cn(text, "text-xl font-semibold")}>
                {forget
                  ? "Нууц үг сэргээх"
                  : tab === "login"
                    ? "Нэвтрэх"
                    : "Бүртгүүлэх"}
              </ModalHeader>

              <Form onSubmit={handleSubmit} autoComplete="off">
                <ModalBody className="w-full">
                  {forget ? (
                    <div className="flex flex-col gap-4">
                      {/* USERNAME */}
                      <div className="relative flex">
                        <Input
                          ref={usernameRef}
                          type="text"
                          label="Утасны дугаар эсвэл майл хаяг"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          isRequired
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && timer === 0)
                              forgetPasswordSendOtp();
                          }}
                        />
                        <Button
                          type="button"
                          className="text-white px-2 bg-rose-500/90 absolute right-2 top-[50%] -translate-y-[50%]"
                          onPress={forgetPasswordSendOtp}
                          isDisabled={timer > 0}
                        >
                          {timer > 0
                            ? `Илгээх ${timer < 10 ? `0${timer}` : timer}`
                            : "Илгээх"}
                        </Button>
                      </div>

                      {/* OTP */}
                      {otpSent && (
                        <div className="flex flex-col items-center w-full">
                          <h1 className="text-sm text-left">
                            Баталгаажуулах дугаар
                          </h1>
                          <div className="flex items-center justify-center gap-4">
                            <InputOtp
                              ref={otpRef as any}
                              size="lg"
                              length={4}
                              value={otp}
                              onValueChange={setOtp}
                              placeholder="x"
                              className="focus:outline-none focus:ring-2 focus:ring-E11D48"
                              isRequired
                              autoComplete="one-time-code"
                              inputMode="numeric"
                            />
                          </div>
                        </div>
                      )}

                      {/* PASSWORD RESET */}
                      {otpSent && (
                        <>
                          <PasswordInput
                            innerRef={passwordRef}
                            nextRef={passwordConfirmRef}
                            label="Нууц үг"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <PasswordInput
                            innerRef={passwordConfirmRef}
                            label="Нууц үг давтах"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                          />
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Tabs */}
                      <div className="flex mb-4 bg-white border rounded-full">
                        {["login", "register"].map((t) => (
                          <Button
                            key={t}
                            className={cn(
                              "flex-1 bg-cover bg-no-repeat",
                              tab === t
                                ? "bg-rose-500/90 text-white"
                                : "bg-transparent text-black",
                              t === "login"
                                ? "rounded-l-full"
                                : "rounded-r-full"
                            )}
                            onPress={() => {
                              setTab(t as any);
                              setError("");
                            }}
                          >
                            {t === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
                          </Button>
                        ))}
                      </div>

                      {/* LOGIN */}
                      {tab === "login" && (
                        <div className="flex flex-col gap-4">
                          <Input
                            ref={phoneRef}
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
                              className="text-sm  cursor-pointer hover:text-rose-400 translation-all duration-300"
                              onClick={() => setForget(true)}
                            >
                              Нууц үг сэргээх
                            </div>
                          </div>
                        </div>
                      )}

                      {/* REGISTER */}
                      {tab === "register" && (
                        <div className="flex flex-col gap-4">
                          <div className="relative flex">
                            <Input
                              label="Утасны дугаар"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              isRequired
                            />
                            <Button
                              type="button"
                              className="text-white px-2 bg-rose-500/90 absolute right-2 top-[50%] -translate-y-[50%]"
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
                              <div
                                ref={otpRef}
                                className="flex items-center justify-center gap-4"
                              >
                                <InputOtp
                                  size="lg"
                                  length={4}
                                  value={otp}
                                  onValueChange={setOtp}
                                  placeholder="x"
                                  isRequired
                                  autoComplete="one-time-code"
                                />
                              </div>
                            </div>
                          )}

                          {otpSent && (
                            <>
                              <PasswordInput
                                innerRef={passwordRef}
                                nextRef={passwordConfirmRef}
                                label="Нууц үг"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                              />
                              <PasswordInput
                                innerRef={passwordConfirmRef}
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

                {/* Footer */}
                <ModalFooter className="flex justify-center w-full">
                  {forget ? (
                    otpSent ? (
                      <Button
                        onClick={forgetPassword}
                        type="submit"
                        className={cn(button, "px-10 rounded-xl")}
                      >
                        Илгээх
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setForget(false)}
                        className={cn(button, "px-10 rounded-xl")}
                      >
                        Буцах
                      </Button>
                    )
                  ) : tab === "login" ? (
                    <Button
                      type="submit"
                      className={cn(button, "px-10 rounded-xl")}
                    >
                      Нэвтрэх
                    </Button>
                  ) : tab === "register" && otpSent ? (
                    <Button
                      type="submit"
                      className={cn(button, "px-10 rounded-xl")}
                    >
                      Баталгаажуулах
                    </Button>
                  ) : null}
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
