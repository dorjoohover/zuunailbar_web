"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  size?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  innerRef?: React.Ref<HTMLInputElement>;
  nextRef?: React.Ref<HTMLInputElement>;
}

export default function PasswordInput({
  label = "Нууц үг",
  placeholder,
  required,
  className,
  size = "md",
  value,
  innerRef,
  nextRef,
  onChange,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && nextRef) {
      const next = (nextRef as any)?.current;
      next?.focus?.();
      e.preventDefault();
    }
  };

  return (
    <Input
      label={label}
      ref={innerRef}
      enterKeyHint={nextRef ? "next" : "done"}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      isRequired={required}
      size="md"
      value={value}
      onChange={onChange}
      type={isVisible ? "text" : "password"}
      className={className}
      endContent={
        <button
          type="button"
          onClick={() => setIsVisible((v) => !v)}
          className="focus:outline-none"
        >
          {isVisible ? (
            <EyeOff className="text-default-400" size={20} />
          ) : (
            <Eye className="text-default-400" size={20} />
          )}
        </button>
      }
      errorMessage={value ? "" : `${label} оруулна уу`}
      {...props}
    />
  );
}
