"use client";

import { useState, useEffect } from "react";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import { CalendarDate } from "@internationalized/date";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";

export default function OrderPage() {
  const [step, setStep] = useState(1);

  const [branch, setBranch] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState<CalendarDate | null>(null);
  const [choiceTime, setChoiceTime] = useState("");
  const [choiceArtist, setChoiceArtist] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    let newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!branch) newErrors.branch = "Салбараа сонгоно уу!";
      if (!service) newErrors.service = "Үйлчилгээгээ сонгоно уу!";
    }
    if (step === 2) {
      if (!date) newErrors.date = "Захиалгын өдрөө сонгоно уу!";
      if (!choiceTime) newErrors.choiceTime = "Захиалгын цагаа сонгоно уу!";
      if (!choiceArtist) newErrors.choiceArtist = "Артистыг сонгоно уу!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const isStepComplete = () => {
    if (step === 1) return branch !== "" && service !== "";
    if (step === 2) return date !== null && choiceTime !== "" && choiceArtist !== "";
    return true;
  };

  const clearError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="relative py-10">
      <div className="flex flex-col justify-center max-w-xl p-6 py-32 mx-auto space-y-6 ">
       
        {/* Step indicator */}
        <div className="relative flex justify-between w-full px-10">
          <div className="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] w-3/4 border-[0.5px] border-gray-400 h-[1px] border-dashed"></div>
          {[1, 2, 3].map((s) => (
            <div key={s} className={`size-10 space-x-2 z-10 relative rounded-full flex-center font-semibold text-sm ${s === step ? "bg-dark-200 text-white" : "border-2 bg-background border-dark"}`}>
              <span>0{s}</span>
            </div>
          ))}
        </div>

        {/* Step Components */}
        {step === 1 && (
          <Step1 branch={branch} service={service} setBranch={setBranch} setService={setService} errors={errors} clearError={clearError} />
        )}
        {step === 2 && (
          <Step2
            date={date}
            setDate={setDate}
            choiceTime={choiceTime}
            setChoiceTime={setChoiceTime}
            choiceArtist={choiceArtist}
            setChoiceArtist={setChoiceArtist}
            errors={errors}
            clearError={clearError}
          />
        )}
        {step === 3 && <Step3 branch={branch} service={service} date={date} choiceTime={choiceTime} choiceArtist={choiceArtist} />}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button onClick={prevStep} disabled={step === 1} variant="bordered" className="h-12 w-28">
            Буцах
          </Button>
          {step < 3 ? (
            <Button
              className={cn(
                isStepComplete() ? "" : "",
                "h-12 text-white border shadow-xl w-28 border-white/5 rounded-xl aspect-square flex-center",
                "bg-dark bg-no-repeat bg-cover bg-[url(/bg/banner-gradient.png)]"
              )}
              onClick={nextStep}
            >
              Дараах
            </Button>
          ) : (
            <Button onClick={() => alert("Form submitted!")} className="text-white bg-teal-500">
              ???
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
