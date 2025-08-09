"use client";

import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";

interface Step1Props {
  branch: string;
  service: string;
  setBranch: (val: string) => void;
  setService: (val: string) => void;
  errors: Record<string, string>;
  clearError: (field: string) => void;
}

export default function Step1({ branch, service, setBranch, setService, errors, clearError }: Step1Props) {
  return (
    <div className="space-y-4">
      <Select
        label="Салбар сонгох"
        selectedKeys={branch ? [branch] : []}
        onChange={(e) => {
          setBranch(e.target.value);
          if (errors.branch) clearError("branch");
        }}
        isInvalid={!!errors.branch}
        errorMessage={errors.branch}
      >
        <SelectItem key="a">Option A</SelectItem>
        <SelectItem key="b">Option B</SelectItem>
      </Select>

      <Select
        label="Үйлчилгээ сонгох"
        selectedKeys={service ? [service] : []}
        onChange={(e) => {
          setService(e.target.value);
          if (errors.service) clearError("service");
        }}
        isInvalid={!!errors.service}
        errorMessage={errors.service}
      >
        <SelectItem key="x">Option X</SelectItem>
        <SelectItem key="y">Option Y</SelectItem>
      </Select>
    </div>
  );
}
