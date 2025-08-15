"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";
import PasswordInput from "./shared/PasswordInput";
import { cn } from "@/lib/utils";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Form } from "@heroui/form";

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

  const handleRegister = () => {
    if (password !== passwordConfirm) return setError("Нууц үг таарахгүй байна");
    setError("");
    console.log({ phone, otp, password });
  };

  return (
    <>
      <Button onPress={onOpen}>Нэвтрэх</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{tab === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}</ModalHeader>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <ModalBody className="w-full">
                  {/* Tab Switch */}
                  <div className="flex mb-4 bg-white border rounded-full">
                    {["login", "register"].map((t) => (
                      <Button key={t} className={cn("flex-1 bg-cover bg-no-repeat", tab === t ? "bg-dark text-white bg-[url(/bg/banner-gradient.png)]" : "bg-transparent", t === "login" ? "rounded-l-full" : "rounded-r-full")} onPress={() => setTab(t as typeof tab)}>
                        {t === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
                      </Button>
                    ))}
                  </div>
                  {/* Login tab */}
                  {tab === "login" && (
                    <div className="flex flex-col gap-4">
                      <Input label="Утасны дугаар" isRequired />
                      <PasswordInput label="Нууц үг" required />
                    </div>
                  )}
                  {/* Register tab */}
                  {tab === "register" && (
                    <div className="flex flex-col gap-4">
                      <Input type="tel" label="Утасны дугаар" value={phone} onChange={(e) => setPhone(e.target.value)} isRequired />
                      <div className="flex flex-col items-center w-full">
                        <h1 className="text-sm text-left">Баталгаажуулах дугаар</h1>
                        <div className="flex items-center gap-4">
                          <InputOtp length={4} value={otp} onValueChange={setOtp} placeholder="x" isRequired />
                          <Button className="text-white px-2 bg-dark bg-[url(/bg/banner-gradient.png)] bg-no-repeat bg-cover" onPress={handleSendOtp} isDisabled={timer > 0}>
                            {timer > 0 ? `Илгээх ${timer < 10 ? `0${timer}` : timer}` : "Илгээх"}
                          </Button>
                        </div>
                      </div>
                      {otpSent && (
                        <>
                          <PasswordInput label="Нууц үг" value={password} onChange={(e) => setPassword(e.target.value)} required />
                          <PasswordInput label="Нууц үг давтах" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
                          {error && <p className="text-sm text-red-500">{error}</p>}
                        </>
                      )}
                    </div>
                  )}
                </ModalBody>
                {/* Modal footer */}
                <ModalFooter className="w-full">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Цуцлах
                  </Button>
                  {/* Login footer */}
                  {tab === "login" && (
                    <Button color="primary" type="submit" onSubmit={() => console.log("Login submit")}>
                      Нэвтрэх
                    </Button>
                  )}
                  {/* Register footer */}
                  {tab === "register" && otpSent && (
                    <Button color="primary" type="submit" onSubmit={handleRegister}>
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
