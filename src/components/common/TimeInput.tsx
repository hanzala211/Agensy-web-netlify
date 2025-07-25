import React, { useState, useEffect } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

interface TimeInputProps {
  label?: string;
  placeholder?: string;
  inputClassname?: string;
  name?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  defaultValue?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  label,
  placeholder = "HH:MM",
  inputClassname,
  name,
  error,
  register,
  defaultValue,
}) => {
  const [displayValue, setDisplayValue] = useState(
    defaultValue?.split(":")[0] + ":" + defaultValue?.split(":")[1] || ""
  );

  useEffect(() => {
    if (defaultValue !== undefined) {
      setDisplayValue(
        defaultValue
          ? defaultValue?.split(":")[0] + ":" + defaultValue?.split(":")[1]
          : ""
      );
    }
  }, [defaultValue]);

  const formatTime = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    const limited = cleaned.slice(0, 4);

    if (limited.length <= 2) {
      return limited;
    } else {
      const hours = limited.slice(0, 2);
      const minutes = limited.slice(2, 4);
      return `${hours}:${minutes}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTime(e.target.value);
    setDisplayValue(formatted);

    if (register) {
      const updatedEvent = {
        ...e,
        target: { ...e.target, value: formatted },
      };
      register.onChange(updatedEvent);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
      setDisplayValue("");
      if (register) {
        const updatedEvent = {
          ...e,
          target: { ...e.target, value: "" },
        };
        register.onChange(updatedEvent);
      }
    }

    if (register) {
      register.onBlur(e);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="flex gap-2 flex-col relative w-full">
        <input
          type="text"
          id={name}
          {...register}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`${inputClassname} text-darkGray bg-lightGray placeholder:text-darkGray p-2
          border-[1px] border-mediumGray rounded-xl w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition-all duration-200`}
        />
      </div>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};
