"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";
import PasswordInput from "./shared/PasswordInput";
import { cn } from "@/lib/utils";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Form } from "@heroui/form";
import { Check, UserRound } from "lucide-react";
import { addToast } from "@heroui/toast";

export default function AuthModal() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSendOtp = () => {
    if (!phone) return;
    setOtpSent(true);
    setTimer(59);
  };

  useEffect(() => {
    if (!timer) return;
    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleLogin = () => {
    if (!phone) return setError("Утасны дугаар оруулна уу");
    if (!password) return setError("Нууц үг оруулна уу");
    setError("");
    console.log("Login:", { phone, password });
    
    addToast({
      title: "Амжилттай бүртгүүллээ",
      size: "lg",
      color: "success",
    });
  };

  const handleRegister = () => {
    if (!otp) return setError("OTP оруулна уу");
    if (!password) return setError("Нууц үг оруулна уу");
    if (password !== passwordConfirm) return setError("Нууц үг таарахгүй байна");
    setError("");
    console.log("Register:", { phone, password });
    
    addToast({
      title: "Амжилттай бүртгүүллээ",
      size: "lg",
      color: "success",
    });
  };

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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="p-4">
          {(onClose) => (
            <>
              <ModalHeader>{tab === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}</ModalHeader>
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
                        className={cn("flex-1 bg-cover bg-no-repeat", tab === t ? "bg-dark text-white bg-[url(/bg/banner-gradient.png)]" : "bg-transparent", t === "login" ? "rounded-l-full" : "rounded-r-full")}
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
                      <Input label="Утасны дугаар" onChange={(e) => setPhone(e.target.value)} isRequired />
                      <PasswordInput label="Нууц үг" onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                  )}
                  {/* Register tab */}
                  {tab === "register" && (
                    <div className="flex flex-col gap-4">
                      <div className="relative flex">
                        <Input type="tel" label="Утасны дугаар" value={phone} onChange={(e) => setPhone(e.target.value)} isRequired />
                        <Button className="text-white px-2 bg-dark bg-[url(/bg/banner-gradient.png)] bg-no-repeat bg-cover absolute right-2 top-[50%] -translate-y-[50%] rounded-" onPress={handleSendOtp} isDisabled={timer > 0}>
                          {timer > 0 ? `Илгээх ${timer < 10 ? `0${timer}` : timer}` : "Илгээх"}
                        </Button>
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <h1 className="text-sm text-left">Баталгаажуулах дугаар</h1>
                        <div className="flex items-center justify-center gap-4">
                          <InputOtp size="lg" length={4} value={otp} onValueChange={setOtp} placeholder="x" isRequired />
                        </div>
                      </div>
                      {otpSent && (
                        <>
                          <PasswordInput label="Нууц үг" value={password} onChange={(e) => setPassword(e.target.value)} required />
                          <PasswordInput label="Нууц үг давтах" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
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
