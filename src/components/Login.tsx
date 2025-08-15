"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";
import AppModal from "./modal";
import PasswordInput from "./shared/PasswordInput";
import { cn } from "@/lib/utils";
import { register, sendOtp } from "@/app/(api)/auth";
import { useRouter } from "next/navigation";
import { toast } from "@heroui/theme";

export default function AuthModal() {
  const [tab, setTab] = useState<"login" | "register">("login");

  // Бүртгүүлэх
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (!phone) return;
    setOtpSent(true);

    const res = (await sendOtp(phone)).data;
    console.log(res);
    setTimer(59);
  };

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleRegister = async () => {
    if (password !== passwordConfirm) {
      setError("Нууц үг таарахгүй байна");
      return;
    }
    setError("");
    const res = await register({
      mobile: phone,
      otp: otp,
      password: password,
    });
    const data = res.data;
    if (data?.accessToken) {
      save(data.accessToken, data.merchant_id);
      alert(data.accessToken);
      // end modal haana
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

  const handleLogin = () => {
    console.log("Login submit");
  };

  return (
    <AppModal
      btn="Нэвтрэх"
      title={tab === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
      confirmText={tab === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
      onConfirm={tab === "login" ? handleLogin : handleRegister}
    >
      {/* Tab toggle */}
      <div className="flex gap-2 p-1 mb-4 bg-gray-200 border rounded-full">
        <Button
          className={cn(
            "flex-1",
            tab === "login" ? "bg-dark text-white" : "bg-gray-200"
          )}
          onClick={() => setTab("login")}
        >
          Нэвтрэх
        </Button>
        <Button
          className={cn(
            "flex-1",
            tab === "register" ? "bg-dark text-white" : "bg-gray-200"
          )}
          onClick={() => setTab("register")}
        >
          Бүртгүүлэх
        </Button>
      </div>

      {/* Login Tab */}
      {tab === "login" && (
        <div className="flex flex-col w-full gap-4">
          <Input label="Утасны дугаар" className="flex-grow" />
          <PasswordInput label="Нууц үг" />
        </div>
      )}

      {/* Register Tab */}
      {tab === "register" && (
        <div className="flex flex-col w-full gap-4">
          <div className="flex items-center space-x-3 h-14">
            <Input
              label="Утасны дугаар"
              className="flex-grow"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button
              className={cn("text-white bg-dark")}
              onClick={handleSendOtp}
              isDisabled={timer > 0}
            >
              {timer > 0
                ? `Дахин илгээх ${timer < 10 ? `0${timer}` : timer}`
                : "Илгээх"}
            </Button>
          </div>

          {otpSent && (
            <>
              <InputOtp
                size="lg"
                length={4}
                value={otp}
                onValueChange={setOtp}
              />
              <div className="flex flex-col w-full gap-2 mt-4">
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
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </>
          )}
        </div>
      )}
    </AppModal>
  );
}
