"use client";

import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";
import AppModal from "./modal";

export default function Login() {
  const [value, setValue] = useState("");

  return (
    // useLink href="/order"
      <AppModal btn="Login Modal"  title="Дугаар баталгаажуулах">
        <p className="mb-4 text-sm">
          Анхаарах: Та утасны дугаараа баталгаажуулснаар захиалга үүсгэх боломжтой болох болно. Баярлалаа.
        </p>

        <div className="flex items-center mb-4 space-x-3">
          <Input placeholder="Утасны дугаар" className="flex-grow" />
          <Button className="text-white bg-dark">Илгээх</Button>
        </div>

        <div className="space-y-1">
          <InputOtp length={4} value={value} onValueChange={setValue} />
          <span className="text-xs text-gray-500">00:59</span>
        </div>
      </AppModal>
  );
}

